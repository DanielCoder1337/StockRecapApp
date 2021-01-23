const nodemailer = require("nodemailer");
const User = require("./users");
require("dotenv").config()

// constructor

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: "danielekeroth123321@gmail.com",
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    refreshToken: process.env.REFRESHTOKEN,
    accessToken: process.env.ACCESSTOKEN
  }
});

class Email {
  constructor(information) {
    this.rubric = information.rubric;
    this.content = information.content;
  }

  static sendEmail(information,result) {

    User.getAll((err,data) => {
      if (err) {
          res.status(500).send({
          message:
              err.message || "Some error occurred while retrieving users."
          });
      }
      else {
        var allEmails = ""
        for (var i = 0; i < data.length; i++){
          var email = data[i].email.toLowerCase();
          if (email != "danielekeroth123321@gmail.com" && email != "daniel.ekeroth1@hotmail.se" && email != "admin@admin.com"){
            if (i == data.length -1) allEmails += email
            else allEmails += email + ","
          }
        }
        const mailData = {
          from: "danielekeroth123321@gmail.com",  // sender address
          to: allEmails,   // list of receivers
          subject: information.rubric,
          text: information.content
        };
        transporter.sendMail(mailData, function (err, info) {
          if(err){
            console.log(err)
            result({kind: "Could not send emails!"}, null);
            return;
          }
          else{
            result(null, info);
            return;
          }
        });
      }
    })
  }
}
module.exports = Email;



//stockmarket 
//autonoumus driving
//

//Global warming
//Global garbage desposal
//

// Interested in helping people grow in financing, particular the stockmarket, hard to find people that want to accept help, therefor creating a website to market my idéa.
// Want to earn money through stock financing, not big enough capital, trying to market to find investors.