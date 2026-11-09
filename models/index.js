const AdminUser = require("./AdminUser");
const ContactMessage = require("./ContactMessage");
const Donator = require("./Donator");
const Donation = require("./Donation");
const Country = require("./Country");
const logger = require("../winston");

const migrations =  [ AdminUser, Country, Donator, Donation, ContactMessage ];

const runMigrations = async () => {

    for (const migration of migrations) {
        await migration();
    }


    console.log(`Database Connected`);
}

module.exports = runMigrations;