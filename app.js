const express = require('express');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
const runMigration = require("./models/index");
const db = require("./config/db");
const config = require("./config/config");
const logger = require("./winston");
const { pollPendingDonations } = require('./services/paystackPollingService');



// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // or 'combined', 'dev', 'tiny', etc.




//Set TimeZone
process.env.TZ = 'Africa/Accra';


//Create database tables
(async () => {
    // await db.raw(`SET time_zone = 'UTC';`);
    await db.raw("SET FOREIGN_KEY_CHECKS=0");
    await runMigration();
    await db.raw("SET FOREIGN_KEY_CHECKS=1");
})()

const port = process.env.port || 3000;

//Load Routes
const router = require("./src/routes/index");
const adminRouter = require("./src/routes/adminRoutes");

//Use Routes
app.use("/", router);
app.use("/admin", adminRouter);


// ============= CRON JOBS =============

// Schedule Paystack polling every 15 minutes
// Cron pattern: minute hour day month day-of-week
// */15 * * * * = every 15 minutes
cron.schedule('*/15 * * * *', async () => {

    try {
        await pollPendingDonations();
    } catch (error) {
        logger.error('Cron job failed:', error);
    }
});


//404 handler
app.use((req, res, next) => {
    res.status(400).send('404');
})

//Handle errors
app.use((err, req, res, next) => {

    logger.error(err.message, err);
    res.status(400).send('Sorry, something went wrong');
});


if (process.env.NODE_ENV !== 'production'){
    app.listen(port, () => {
        logger.info(`server running on port ${port}`);
    })
}else app.listen();

