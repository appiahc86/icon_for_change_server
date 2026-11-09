const db = require("../config/db");

const Donator = async () => {
    if (!await db.schema.hasTable('donators')){

        await db.schema.createTable('donators', table => {
            table.bigIncrements('id').unsigned().primary();
            table.string('name', 255).notNullable();
            table.string('email', 255).notNullable();
            table.string('phone', 20).nullable();
            table.bigInteger('country_id').unsigned().nullable();
            table.timestamps(true, true);

            //Index
            table.index('name');
            table.index('email');
            table.index('created_at');

            table.engine('InnoDB');
            table.foreign('country_id').references('id').inTable('countries').onDelete('SET NULL');

        });

    }



}

module.exports = Donator;