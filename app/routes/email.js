module.exports = app => {
    const email = require("../controllers/sendEmailController");
  
    // Create a new User
    app.post("/sendEmail", email.sendEmail);
  
    app.get("/sendEmail", (req,res) => {
        res.render("sendEmail.hbs")
    });
};
