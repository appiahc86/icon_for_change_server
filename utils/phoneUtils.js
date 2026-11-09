const { parsePhoneNumber, isValidPhoneNumber } = require('libphonenumber-js');

// Default Ghana phone configuration (fallback if config is not available)
const DEFAULT_PHONE_CONFIG = {
    country: 'GH',
    countryCode: '+233',
    allowedPrefixes: ['20', '21', '23', '24', '25', '26', '27', '28', '29', '50', '53', '54', '55', '56', '57', '59'],
    minLength: 9,
    maxLength: 9
};

// Try to import config, fallback to default if not available
let phoneConfig;
try {
    const config = require('../config/config');
    phoneConfig = config.phone || DEFAULT_PHONE_CONFIG;
} catch (error) {
    console.warn('Config not found, using default phone configuration');
    phoneConfig = DEFAULT_PHONE_CONFIG;
}

/**
 * Validate Ghana phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} Validation result
 */
function validateGhanaPhone(phone) {
    const errors = [];

    if (!phone) {
        return {
            isValid: false,
            errors: ['Phone number is required'],
            formatted: null
        };
    }

    try {
        // Remove all non-digit characters except +
        let cleanPhone = phone.toString().replace(/[^\d+]/g, '');

        // Handle different input formats
        if (cleanPhone.startsWith('0')) {
            // Convert local format (0xxxxxxxxx) to international (+233xxxxxxxxx)
            cleanPhone = '+233' + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith('233')) {
            // Add + if missing
            cleanPhone = '+' + cleanPhone;
        } else if (!cleanPhone.startsWith('+233') && !cleanPhone.startsWith('0')) {
            // If no country code and doesn't start with 0, assume Ghana local without 0
            cleanPhone = '+233' + cleanPhone;
        }

        //console.log(`Original: ${phone}, Cleaned: ${cleanPhone}`); // Debug log

        // Basic length check before parsing
        if (cleanPhone.length !== 13) { // +233xxxxxxxxx = 13 characters
            errors.push('Ghana phone numbers must be 9 digits (excluding country code)');
            return {
                isValid: false,
                errors,
                formatted: null
            };
        }

        // Parse using libphonenumber-js
        const phoneNumber = parsePhoneNumber(cleanPhone, 'GH');

        if (!phoneNumber) {
            errors.push('Unable to parse phone number');
            return {
                isValid: false,
                errors,
                formatted: null
            };
        }

        // Check if it's a Ghana number
        if (phoneNumber.country !== 'GH') {
            errors.push('Only Ghana phone numbers are allowed');
        }

        // Get the national number (without country code)
        const nationalNumber = phoneNumber.nationalNumber;

        if (nationalNumber.length !== 9) {
            errors.push('Phone number must be 9 digits (excluding country code)');
        }

        // Check against allowed prefixes (Ghana mobile network prefixes)
        const prefix = nationalNumber.substring(0, 2);
        if (!phoneConfig.allowedPrefixes.includes(prefix)) {
            errors.push(`Invalid mobile network prefix: ${prefix}. Please use a valid Ghana mobile number (supported: ${phoneConfig.allowedPrefixes.join(', ')})`);
        }

        // Validate using libphonenumber-js
        if (!phoneNumber.isValid()) {
            errors.push('Phone number is not valid');
        }

        return {
            isValid: errors.length === 0,
            errors,
            formatted: errors.length === 0 ? phoneNumber.format('E.164') : null, // +233xxxxxxxxx
            national: errors.length === 0 ? phoneNumber.format('NATIONAL') : null, // 0xx xxx xxxx
            international: errors.length === 0 ? phoneNumber.format('INTERNATIONAL') : null, // +233 xx xxx xxxx
            carrier: getCarrierInfo(prefix),
            nationalNumber: nationalNumber,
            prefix: prefix
        };

    } catch (error) {
        console.error('Phone validation error:', error);
        return {
            isValid: false,
            errors: [`Phone number parsing failed: ${error.message}`],
            formatted: null
        };
    }
}

/**
 * Get carrier information based on phone prefix
 * @param {string} prefix - First 2 digits of phone number
 * @returns {object} Carrier information
 */
function getCarrierInfo(prefix) {
    const carriers = {
        '20': { name: 'Telecel', network: 'telecel' },
        '21': { name: 'Telecel', network: 'telecel' },
        '23': { name: 'AirtelTigo', network: 'airteltigo' },
        '24': { name: 'MTN', network: 'mtn' },
        '25': { name: 'AirtelTigo', network: 'airteltigo' },
        '26': { name: 'AirtelTigo', network: 'airteltigo' },
        '27': { name: 'AirtelTigo', network: 'airteltigo' },
        '28': { name: 'AirtelTigo', network: 'airteltigo' },
        '29': { name: 'AirtelTigo', network: 'airteltigo' },
        '50': { name: 'Telecel', network: 'telecel' },
        '53': { name: 'MTN', network: 'mtn' },
        '54': { name: 'MTN', network: 'mtn' },
        '55': { name: 'MTN', network: 'mtn' },
        '56': { name: 'AirtelTigo', network: 'airteltigo' },
        '57': { name: 'AirtelTigo', network: 'airteltigo' },
        '59': { name: 'MTN', network: 'mtn' }
    };

    return carriers[prefix] || { name: 'Unknown', network: 'unknown' };
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @param {string} format - Format type: 'national', 'international', 'e164'
 * @returns {string} Formatted phone number
 */
function formatPhone(phone, format = 'national') {
    try {
        const phoneNumber = parsePhoneNumber(phone, 'GH');

        if (!phoneNumber || !phoneNumber.isValid()) {
            return phone; // Return original if can't parse
        }

        switch (format.toLowerCase()) {
            case 'national':
                return phoneNumber.format('NATIONAL'); // 0xx xxx xxxx
            case 'international':
                return phoneNumber.format('INTERNATIONAL'); // +233 xx xxx xxxx
            case 'e164':
                return phoneNumber.format('E.164'); // +233xxxxxxxxx
            default:
                return phoneNumber.format('NATIONAL');
        }
    } catch (error) {
        return phone;
    }
}

/**
 * Extract phone number without country code
 * @param {string} phone - Full phone number
 * @returns {string} Phone number without country code
 */
function getLocalNumber(phone) {
    try {
        const phoneNumber = parsePhoneNumber(phone, 'GH');
        return phoneNumber ? phoneNumber.nationalNumber : phone;
    } catch (error) {
        return phone;
    }
}

/**
 * Normalize phone number to E.164 format
 * @param {string} phone - Phone number to normalize
 * @returns {string} Normalized phone number
 */
function normalizePhone(phone) {
    const validation = validateGhanaPhone(phone);
    return validation.isValid ? validation.formatted : null;
}

/**
 * Check if phone number exists in database
 * @param {string} phone - Phone number to check
 * @param {string} table - Database table to check ('users', 'merchants', 'admins')
 * @param {number} excludeId - ID to exclude from check (for updates)
 * @returns {Promise<boolean>} Whether phone exists
 */
async function phoneExists(phone, table = 'users', excludeId = null) {
    const db = require('../config/db');

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) return false;

    let query = db(table).where('phone', normalizedPhone);

    if (excludeId) {
        query = query.whereNot('id', excludeId);
    }

    const result = await query.first();
    return !!result;
}

/**
 * Generate a list of valid Ghana phone number examples
 * @returns {Array} List of example phone numbers
 */
function getPhoneExamples() {
    return [
        { format: 'Local', example: '0244123456', description: 'Standard local format' },
        { format: 'International', example: '+233244123456', description: 'International format' },
        { format: 'With spaces', example: '024 412 3456', description: 'Local with spaces' },
        { format: 'With dashes', example: '024-412-3456', description: 'Local with dashes' }
    ];
}

/**
 * Mask phone number for display (privacy)
 * @param {string} phone - Phone number to mask
 * @param {number} visibleDigits - Number of digits to show at end
 * @returns {string} Masked phone number
 */
function maskPhone(phone, visibleDigits = 4) {
    const formatted = formatPhone(phone, 'national');
    if (formatted.length <= visibleDigits + 2) return formatted;

    const visible = formatted.slice(-visibleDigits);
    const masked = '*'.repeat(formatted.length - visibleDigits - 2);
    return formatted.substring(0, 2) + masked + visible;
}

/**
 * Get phone configuration (for debugging)
 * @returns {object} Phone configuration
 */
function getPhoneConfig() {
    return phoneConfig;
}

module.exports = {
    validateGhanaPhone,
    getCarrierInfo,
    formatPhone,
    getLocalNumber,
    normalizePhone,
    phoneExists,
    getPhoneExamples,
    maskPhone,
    getPhoneConfig
};