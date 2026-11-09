if (process.env.NODE_ENV !== 'production'){
    module.exports = {
        DB_HOST: "127.0.0.1",
        DB_USER: "root",
        DB_PASS: "",
        DB_NAME: "my_db",
        PAYSTACK_SECRET_KEY: "",
        PAYSTACK_PUBLIC_KEY: "",
        PAYMENT_EMAIL: "",
        PAYSTACK_BASE_URL: "",
        FRONTEND_URL: "",
        JWT_SECRET: ""
    };
}



else { //In production

    module.exports = {
        DB_HOST: "127.0.0.1",
        DB_USER: "root",
        DB_PASS: "",
        DB_NAME: "my_db",
        PAYSTACK_SECRET_KEY: "",
        PAYSTACK_PUBLIC_KEY: "",
        PAYMENT_EMAIL: "",
        PAYSTACK_BASE_URL: "",
        FRONTEND_URL: "",
        JWT_SECRET: ""
    };

}
