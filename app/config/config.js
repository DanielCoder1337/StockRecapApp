require("dotenv").config()


module.exports = {
    HOST: process.env.DATABASEIP,
    USER: "root",
    PASSWORD: process.env.DATABASEPASSWORD,
    DB: "investordb"
};