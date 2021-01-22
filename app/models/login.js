const User = require("./users");
const bcrypt = require("bcrypt");
// constructor
class Login {
  constructor(credentials) {
    this.email = credentials.email;
    this.password = credentials.password;
  }
  static login(credentials,result) {
    User.findByEmail(credentials.email, (err,data) => {
        if (err) {
            if (err.kind === "not_found") {
                result({kind: "Incorrect email"},null);
                return;
            } else {
                result({kind: err},null);
                return;
            }
        } else {
            if (!bcrypt.compareSync(credentials.password, data.passHash)) {
                result({kind: "Incorrect password"},null);
                return;
            }
            else {
                result(null, data);
                return;
            }
        }
    });
  }
}
module.exports = Login;



//stockmarket 
//autonoumus driving
//

//Global warming
//Global garbage desposal
//

// Interested in helping people grow in financing, particular the stockmarket, hard to find people that want to accept help, therefor creating a website to market my idéa.
// Want to earn money through stock financing, not big enough capital, trying to market to find investors.