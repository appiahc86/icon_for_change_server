const axios = require('axios');
const knex = require('../config/db');
const config = require('../config/config');
const logger = require('../winston');

/**
 * Poll Paystack for pending donations and update their status
 */
async function pollPendingDonations() {
    try {

        // Get all pending donations from the last 24 hours
        const pendingDonations = await knex('donations')
            .where('payment_status', 'pending')
            .where('created_at', '>=', knex.raw('DATE_SUB(NOW(), INTERVAL 24 HOUR)'))
            .select('id', 'paystack_reference', 'reference', 'amount', 'created_at');

        if (pendingDonations.length === 0) {
            return { checked: 0, updated: 0 };
        }


        let updatedCount = 0;

        // Verify each pending donation with Paystack
        for (const donation of pendingDonations) {
            try {
                // Use paystack_reference if available, otherwise use reference
                const referenceToCheck = donation.paystack_reference || "";

                // Verify with Paystack API
                const paystackResponse = await axios.get(
                    `${config.PAYSTACK_BASE_URL}/transaction/verify/${referenceToCheck}`,
                    {
                        headers: {
                            Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`
                        }
                    }
                );

                const { status, data } = paystackResponse.data;

                if (status && data) {
                    const currentStatus = data.status; // success, failed, abandoned, etc.

                    // Only update if status has changed from pending
                    if (currentStatus !== 'pending') {
                        await knex('donations')
                            .where({ id: donation.id })
                            .update({
                                payment_status: currentStatus,
                                paystack_response: JSON.stringify(paystackResponse.data),
                                updated_at: knex.fn.now()
                            });

                        updatedCount++;
                    }
                }

                // Add a small delay to avoid hitting rate limits
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
                // Log individual donation verification errors but continue with others
                logger.error(`Error verifying donation ${donation.reference}:`, {
                    error: error.response?.data || error.message,
                    donationId: donation.id
                });
            }
        }

        logger.info(`Paystack polling completed. Checked: ${pendingDonations.length}, Updated: ${updatedCount}`);

        return {
            checked: pendingDonations.length,
            updated: updatedCount
        };

    } catch (error) {
        logger.error('Error in Paystack polling service:', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}

module.exports = {
    pollPendingDonations
};