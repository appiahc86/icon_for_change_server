const db = require("../config/db");

const Country = async () => {
    if (!await db.schema.hasTable('countries')){

        await db.schema.createTable('countries', table => {
            table.bigIncrements('id').unsigned().primary();
            table.string('name');
            table.string('currency', 8);
            table.string('iso2', 8);
            table.string('iso3', 8);

            //Index
            table.index('name')


            table.engine('InnoDB');
        });

    }



}

module.exports = Country;