const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const config = require('../../config/config');


// Generate JWT token
const generateToken = (payload, expiresIn =  '24h') => {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
};

// Verify JWT token
const verifyToken = (token) => {
    return jwt.verify(token, config.JWT_SECRET);
};

// Hash password
const hashPassword = async (password) => {
    const saltRounds =  12;
    return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};


// Authentication middleware
const authenticateToken = () => {

    return async (req, res, next) => {

        try {

            const authHeader = req.headers['authorization'];

            const token = authHeader && authHeader.split(' ')[1];



            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Access token is required'
                });
            }

            const decoded = verifyToken(token);

            // Get  user data from database
            const user = await db('admin_users').where('id', decoded.id).first();



            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }


            // Attach user info to request
            req.user = user;

            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired'
                });
            }

            console.error('Auth middleware error:', error);
            return res.status(500).json({
                success: false,
                message: 'Authentication error'
            });
        }
    };
};



module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword,
    authenticateToken,
};