const Email = require("../models/email");
require("dotenv").config()

exports.sendEmail = (req,res) => {
    if (!req.body) {
        const model = {
            title: "Mass email!",
            notif: {type: 'warning', message:"Fields can't be empty!"}
        }
        res.render("sendEmail.hbs", model);
    }
    const information = new Email({
        rubric: req.body.emailRubric,
        content: req.body.emailContent
    });
    if (res.locals.admin){
        Email.sendEmail(information, (err,result) => {
            if (err){
                const model = {
                    notif:{type: 'danger', message: "Could not send emails!"}
                }
                res.render("sendEmail.hbs", model)
            }
            else {
                const model = {
                    notif: {type: 'success', message: "Successfully sent emails!"}
                }
                res.render("home.hbs", model)
            }
        });
    }
}