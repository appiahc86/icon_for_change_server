const db = require("../config/db");

const Donation = async () => {
    if (!await db.schema.hasTable('donations')){

        await db.schema.createTable('donations', table => {
            table.bigIncrements('id').unsigned().primary();
            table.bigInteger('donator_id').unsigned().nullable();
            table.decimal('amount', 15, 2).notNullable();
            table.string('currency', 10).defaultTo('GHS');
            table.string('reference', 255).notNullable().unique();
            table.string('payment_status', 50).defaultTo('pending');
            table.enum('donation_type', ['Children Education', 'Elderly Care', 'General']);
            table.text('message');
            table.boolean('is_anonymous').defaultTo(false);
            table.string('paystack_reference', 255);
            table.text('paystack_response');
            table.date('date').defaultTo(db.fn.now());
            table.timestamps(true, true);

            //index
            table.index('donation_type');
            table.index('date');
            table.index('payment_status');
            table.index('is_anonymous');
            table.index('paystack_reference');
            table.index('created_at');

            // Composite indexes for optimized dashboard queries
            table.index(['payment_status', 'created_at'], 'idx_status_created');
            table.index(['payment_status', 'donation_type'], 'idx_status_type');
            table.index(['payment_status', 'created_at', 'donation_type'], 'idx_status_created_type');


            table.foreign('donator_id').references('donators.id').onDelete('SET NULL');
            table.engine('InnoDB');
        });

    }



}

module.exports = Donation;