const nodemailer = require("nodemailer");
const email = require("../routes/email");
// constructor

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: "danielekeroth123321@gmail.com",
    clientId: "946168617917-n8q2dn1e0q8mlsbhndm2h3spggnj9obk.apps.googleusercontent.com",
    clientSecret: process.env.CLIENTSECRET,
    refreshToken: "1//042f6a8rHAhBMCgYIARAAGAQSNwF-L9IrC8mfVvbK1a8Kb8uGG0zxjFghF_CBp-V2Q5JbfTBPE12PmsqOc76mOt7IeAf0SkEBE0A",
    accessToken: "ya29.a0AfH6SMABo4sx9MhxkWVRrjaeuGihK7o7CaeDauFQ_vF3vyAslV_JKqtc6TeaElRUzXQgLLiLK2WmMkTnIjhzOIF2UhwrsCxtGLmpYYu1YW5oCwoBYZh3DxK_mzxyxWYSrT6dDb_Extr-q-Hr1MibWwuM6S6zKwOCQ42_1N7RuIU"
  }
});

const emailConfig = {
    user: "daniel.ekeroth1@hotmail.se",
    pass: "Danneifk1!"
}

class Email {
  constructor(information) {
    this.rubric = information.rubric;
    this.content = information.content;
  }

  static sendEmail(information,result) {
    const mailData = {
      from: "danielekeroth123321@gmail.com",  // sender address
      to: 'daniel.ekeroth1@hotmail.se',   // list of receivers
      subject: information.rubric,
      text: information.content
    };
    transporter.sendMail(mailData, function (err, info) {
      if(err){
        result({kind: "Could not send emails!"}, null);
        return;
      }
      else{
        result(null, info);
        return;
      }
    });
    return;
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