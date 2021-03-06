const sql = require("./db");
const bcrypt = require("bcrypt");

class SaveUser{
  constructor(user){
    this.email = user.email,
    this.passHash = user.password,
    this.firstName = user.firstName,
    this.lastName = user.lastName
  }
}


// constructor
class User {
  constructor(user) {
    this.email = user.email.toLowerCase();
    this.password = user.password;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
  static create(newUser, result) {
    this.findByEmail(newUser.email.toLowerCase(), (err,data) => {
      if (err) {
        const saveUser = new SaveUser(newUser);
        const saltRounds = 10;
        saveUser.passHash = bcrypt.hashSync(saveUser.passHash, saltRounds)
        sql.query("INSERT INTO users SET ?", saveUser, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("created users: ", { id: res.insertId, ...saveUser });

          result(null, { id: res.insertId, ...saveUser });
        });
      } else {
        result({kind:"Email used!"}, null)
      }
    });
  }
  static findById(userId, result) {
    sql.query(`SELECT * FROM users WHERE id = ${userId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found customer: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Customer with the id
      result({ kind: "not_found" }, null);
    });
  }
  static findByEmail(userEmail, result) {
    sql.query("SELECT * FROM users WHERE email = ?",[userEmail], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found User: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Customer with the email
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(result) {
    sql.query("SELECT * FROM users", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      else {
        console.log("users: ", res);
        result(null, res);
      }
    });
  }
  static updateById(id, user, result) {
    sql.query(
      "UPDATE users SET email = ?, firstName = ?, lastName = ? WHERE id = ?",
      [user.email, user.firstName, user.lastName, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found User with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated user: ", { id: id, ...user });
        result(null, { id: id, ...user });
      }
    );
  }
}
  
module.exports = User;



