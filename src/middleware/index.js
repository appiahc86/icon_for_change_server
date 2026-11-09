const config = require("../../config/config");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = require("../routes");

// Admin authentication middleware
const adminAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify JWT token here
        req.admin = jwt.verify(token, config.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = adminAuth;