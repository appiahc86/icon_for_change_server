const db = require("../config/db");

const AdminUser = async () => {
    if (!await db.schema.hasTable('admin_users')){

        await db.schema.createTable('admin_users', table => {
            table.bigIncrements('id').unsigned().primary();
            table.string('name', 100).notNullable();
            table.string('email', 100).notNullable().unique();
            table.string('password').notNullable();
            table.enum('role', [ 'admin', 'operator']).defaultTo('admin');
            table.enum('status', ['active', 'inactive']).defaultTo('active');

            // Security fields
            table.integer('failed_login_attempts').defaultTo(0);
            table.datetime('locked_until').nullable();
            table.datetime('last_login_at').nullable();

            table.timestamps(true, true);

            table.index('role');
            table.engine('InnoDB');
        });

    }



}

module.exports = AdminUser;