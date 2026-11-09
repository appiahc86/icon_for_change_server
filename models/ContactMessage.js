const db = require("../config/db");

const ContactMessage = async () => {
    if (!await db.schema.hasTable('contact_messages')){

        await db.schema.createTable('contact_messages', table => {
            table.bigIncrements('id').unsigned().primary();
            table.string('name', 255).notNullable();
            table.string('email', 255).notNullable();
            table.string('subject', 255);
            table.text('message').notNullable();
            table.boolean('is_read').defaultTo(false);
            table.timestamps(true, true);

            table.index('is_read');
            table.index('created_at');
            table.index('email');

            table.engine('InnoDB');
        });

    }



}

module.exports = ContactMessage;