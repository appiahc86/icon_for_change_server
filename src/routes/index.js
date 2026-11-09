const express = require("express");
const router = express.Router();
const knex = require("../../config/db")
const axios = require('axios');
const crypto = require('crypto');
const config = require('../../config/config');
const { v4: uuidv4 } = require('uuid');
const logger = require("../../winston");



// ============= ROUTES =============

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Icon of Change API is running' });
});

//Load countries
router.get('/countries', async (req, res) => {

    try {
        const countries = await knex('countries').select('name', 'id');

        res.json({
            success: true,
            data: {
                countries: countries
            }
        });
    }catch (e) {
        logger.error(e.message);
    }

})

// Initialize payment
router.post('/donations/initialize', async (req, res) => {
    try {
        const { name, email, phone, country, amount, donationType, message, isAnonymous } = req.body;

        // Validation
        if (!name || !email || !amount) {
            return res.status(400).json({ error: 'Name, email, and amount are required' });
        }

        if (amount < 1) {
            return res.status(400).json({ error: 'Minimum donation amount is 1 GHS' });
        }

        // Create or get donator
        let donator = await knex('donators').where({ email }).first();

        if (!donator) {
            const [donatorId] = await knex('donators').insert({
                name,
                email,
                phone,
                country_id: country
            });
            donator = { id: donatorId };
        } else {
            // Update donator info
            await knex('donators').where({ id: donator.id }).update({
                name,
                phone,
                country_id : country,
                updated_at: knex.fn.now()
            });
        }

        // Generate unique reference
        // const reference = 'IOC-' + crypto.randomBytes(8).toString('hex').toUpperCase();
         const reference = 'IOC-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
        // const reference = 'IOC-' + uuidv4().toUpperCase();

        // Create donation record
        const [donationId] = await knex('donations').insert({
            donator_id: donator.id,
            amount,
            reference,
            donation_type: donationType,
            message,
            is_anonymous: isAnonymous || false,
            payment_status: 'pending'
        });

        // Initialize Paystack payment
        const paystackResponse = await axios.post(
            `${config.PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                email,
                amount: Math.round(amount * 100), // Convert to pesewas
                currency: 'GHS',
                reference,
                callback_url: `${config.FRONTEND_URL}/donation-success`,
                metadata: {
                    donation_id: donationId,
                    donator_name: name,
                    donation_type: donationType,
                    custom_fields: [
                        {
                            display_name: 'Donation Type',
                            variable_name: 'donation_type',
                            value: donationType || 'General'
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Update donation with Paystack reference
        await knex('donations').where({ id: donationId }).update({
            paystack_reference: paystackResponse.data.data.reference,
            paystack_response: JSON.stringify(paystackResponse.data)
        });

        res.json({
            success: true,
            data: {
                authorization_url: paystackResponse.data.data.authorization_url,
                access_code: paystackResponse.data.data.access_code,
                reference: paystackResponse.data.data.reference
            }
        });

    } catch (error) {
        console.error('Initialize payment error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to initialize payment',
            details: error.response?.data?.message || error.message
        });
    }
});

// Verify payment
router.get('/donations/verify/:reference', async (req, res) => {
    try {
        const { reference } = req.params;

        // Verify with Paystack
        const paystackResponse = await axios.get(
            `${config.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const { status, data } = paystackResponse.data;

        if (status) {
            // Update donation status
            const donation = await knex('donations')
                .where({ paystack_reference: reference })
                .first();

            if (donation) {
                await knex('donations')
                    .where({ id: donation.id })
                    .update({
                        payment_status: data.status,
                        paystack_response: JSON.stringify(paystackResponse.data),
                        updated_at: knex.fn.now()
                    });
            }

            res.json({
                success: true,
                data: {
                    status: data.status,
                    amount: data.amount / 100,
                    currency: data.currency,
                    reference: data.reference
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Verification failed' });
        }

    } catch (error) {
        console.error('Verify payment error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to verify payment',
            details: error.response?.data?.message || error.message
        });
    }
});

// Paystack webhook
router.post('/webhooks/paystack', async (req, res) => {
    try {
        const hash = crypto
            .createHmac('sha512', config.PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash === req.headers['x-paystack-signature']) {
            const event = req.body;


            //Charge Success Response
            if (event.event === 'charge.success') {
                const { reference, status } = event.data;

                console.log(event.data)

                await knex('donations')
                    .where({ paystack_reference: reference })
                    .update({
                        payment_status: status,
                        paystack_response: JSON.stringify(event),
                        updated_at: knex.fn.now()
                    });
            }
        }

        res.sendStatus(200);
    } catch (error) {
        logger.error('Paystack Webhook Error ', error);
        console.error('Webhook error:', error);
        res.sendStatus(500);
    }
});

// Contact form submission
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        await knex('contact_messages').insert({
            name,
            email,
            subject,
            message
        });

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

module.exports = router;