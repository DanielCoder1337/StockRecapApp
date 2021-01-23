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

