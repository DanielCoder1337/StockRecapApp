require("dotenv").config()

url('/fronPageBackground')
module.exports = {
    HOST: "0.0.0.0",
    USER: "root",
    PASSWORD: process.env.DATABASEPASSWORD,
    DB: "investordb"
};