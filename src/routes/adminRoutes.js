const express = require("express");
const router = express.Router();
const db = require("../../config/db")
const axios = require('axios');
const crypto = require('crypto');
const config = require('../../config/config');
const {authenticateToken, comparePassword, hashPassword, generateToken} = require('../middleware/auth');
const logger = require('../../winston');
const { body, validationResult } = require('express-validator');


// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => error.msg)
        });
    }
    next();
};


// ============= ADMIN ROUTES =============

// Health check
router.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Icon of Change API is running' });
});

//LOGIN
router.post('/login',
    [
        body('email')
            .notEmpty()
            .withMessage('Email is required')
        .isEmail()
            .withMessage('Invalid email address'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],
    handleValidationErrors,
    async (req, res) => {

    const { email, password } = req.body;

    try{

        //query database
        const user = await db('admin_users').where({ email: email.toLowerCase() }).first();

        if (!user){
            console.log('user not found');
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }


        isValidCredential = await comparePassword(password, user.password);

        if (!isValidCredential) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Password'
            });
        }

        //Generate JWT token
        // Generate JWT token
        const tokenPayload = {
            id: user.id,
            email: user.email,
        };
        const token = generateToken(tokenPayload);

        const responseData = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: responseData,
                token
            }
        });



    }catch (e) {

       logger.error(e);
        // console.log(e.message)
        res.status(400).json({
            success: false,
            message: 'Failed to login, Please try again later',
        });
    }

});



// Get all donations (admin) with pagination and filters
router.get('/donations', authenticateToken(), async (req, res) => {

    try {


        const {
            page = 1,
            limit = 10,
            payment_status,
            dateFrom,
            dateTo,
            donation_type,
            search = '',
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = req.query;


        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Build query
        let query = db('donations')
            .join('donators', 'donations.donator_id', 'donators.id')
            .select(

                'donations.id',
                'donations.amount',
                'donations.donation_type',
                'donations.payment_status',
                'donations.created_at',
                'donations.reference',
                'donators.name as donator_name',
                'donators.email as donator_email',
                'donators.phone as donator_phone'
            );

        // Apply filters
        if (payment_status) {
            query = query.where('donations.payment_status', payment_status);
        }

        if (dateFrom) {
            query = query.where('donations.date', '>=', dateFrom);
        }

        if (dateTo) {
            query = query.where('donations.date', '<=', dateTo);
        }
        if (donation_type) {
            query = query.where('donations.donation_type', '=', donation_type);
        }


        if (search) {
            query = query.where(function() {
                this.where('donators.name', 'like', `%${search}%`)
                    .orWhere('donators.email', 'like', `%${search}%`)
            });
        }

        // Get total count for pagination
        const totalQuery = query.clone().clearSelect().clearOrder().count('* as count');
        const [{ count: total }] = await totalQuery;

        // Apply sorting and pagination
        const donations = await query
            .orderBy(`donations.${sortBy}`, sortOrder)
            .limit(limitNum)
            .offset(offset);


        res.json({
            success: true,
            donations,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: parseInt(total),
                totalPages: Math.ceil(total / limitNum)
            }
        });


    } catch (error) {
        console.error('Get donations error:', error);
        res.status(500).json({ error: 'Failed to fetch donations' });
    }
});



// Get donation statistics
router.get('/donations/stats', authenticateToken(), async (req, res) => {
    try {

        // Get current year
        const currentYear = new Date().getFullYear();

        // Overall stats (all time)
        const stats = await db('donations')
            .where({ payment_status: 'success' })
            .select(
                db.raw('COUNT(DISTINCT donator_id) as total_donators')
            )
            .first();

        // Monthly breakdown for current year only (optimized with indexed created_at)
        // const monthlyData = await db('donations')
        //     .where({ payment_status: 'success' })
        //     .whereRaw('YEAR(created_at) = ?', [currentYear])
        //     .select(
        //         db.raw('YEAR(created_at) as year'),
        //         db.raw('MONTH(created_at) as month'),
        //         db.raw('SUM(amount) as total_amount'),
        //         db.raw('COUNT(*) as donation_count')
        //     )
        //     .groupBy(db.raw('YEAR(created_at), MONTH(created_at)'))
        //     .orderBy(db.raw('MONTH(created_at)'));

        // Donation type breakdown for current year only (optimized with indexed donation_type)
        // const donationTypeData = await db('donations')
        //     .where({ payment_status: 'success' })
        //     .whereRaw('YEAR(created_at) = ?', [currentYear])
        //     .select(
        //         'donation_type',
        //         db.raw('SUM(amount) as total_amount'),
        //         db.raw('COUNT(*) as donation_count')
        //     )
        //     .groupBy('donation_type')
        //     .orderBy('total_amount', 'desc');

        // Combined monthly + donation type breakdown for current year only
        const monthlyByType = await db('donations')
            .where({ payment_status: 'success' })
            .whereRaw('YEAR(created_at) = ?', [currentYear])
            .select(
                // db.raw('YEAR(created_at) as year'),
                db.raw('MONTH(created_at) as month'),
                'donation_type',
                db.raw('SUM(amount) as total_amount'),
                db.raw('COUNT(*) as donation_count')
            )
            .groupBy(db.raw('YEAR(created_at), MONTH(created_at), donation_type'))
            .orderBy(db.raw('MONTH(created_at)'));



        // Recent donations
        const recentDonations = await db('donations')
            .join('donators', 'donations.donator_id', 'donators.id')
            .where({ payment_status: 'success' })
            .where('donations.is_anonymous', false)
            .select('donations.id','donators.name', 'donations.amount',
                'donations.donation_type', 'donations.currency',
                'donations.created_at', 'donations.payment_status')
            .orderBy('donations.created_at', 'desc')
            .limit(10);

        res.json({
            success: true,
            stats: {
                totalDonators: parseInt(stats.total_donators) || 0
            },
            currentYear: {
                // monthlyData: monthlyData.map(row => ({
                //     year: row.year,
                //     month: row.month,
                //     totalAmount: parseFloat(row.total_amount) || 0,
                //     donationCount: parseInt(row.donation_count) || 0
                // })),
                // donationTypeData: donationTypeData.map(row => ({
                //     donationType: row.donation_type,
                //     totalAmount: parseFloat(row.total_amount) || 0,
                //     donationCount: parseInt(row.donation_count) || 0
                // })),
                data: monthlyByType.map(row => ({
                    year: row.year,
                    month: row.month,
                    donationType: row.donation_type,
                    totalAmount: parseFloat(row.total_amount) || 0,
                    donationCount: parseInt(row.donation_count) || 0
                }))
            },
            recentDonations
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router;