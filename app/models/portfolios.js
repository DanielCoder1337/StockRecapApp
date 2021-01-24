const sql = require("./db");
const User = require("./users")
const Investment = require("./investments")
// constructor
class Portfolio {
  constructor(portfolioInfo) {
    this.name = portfolioInfo.name;
    this.description = portfolioInfo.description;
    this.value = portfolioInfo.value;
  }
  static create(newPortfolio, result) {
    this.findByName(newPortfolio.name, (err,data) => {
      if (err) {
        sql.query("INSERT INTO portfolios SET ?", newPortfolio, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log("created users: ", { id: res.insertId, ...newPortfolio });

          result(null, { id: res.insertId, ...newPortfolio });
        });
      } else {
        result({kind:"Name used!"}, null)
      }
    });
  }
  static findById(portfolioId, result) {
    sql.query("SELECT * FROM portfolios WHERE id = ?", [portfolioId],(err, res) => {
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
  static findByName(portfolioName, result) {
    sql.query("SELECT * FROM portfolios WHERE name = ?",[portfolioName], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found portfolio: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Customer with the email
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(result) {
    sql.query("SELECT * FROM portfolios", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      else {
        console.log("portfolios: ", res);
        result(null, res);
      }
    });
  }
  static updateById(id, portfolio, result) {
    sql.query(
      "UPDATE portfolios SET name = ?, description = ?, value = ? WHERE id = ?",
      [portfolio.name, portfolio.description, portfolio.value, id],
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
        result(null, { id: id, ...portfolio });
      }
    );
  }
  static findAllUsers(id, result){
    sql.query(
      `SELECT * FROM users u INNER JOIN portfolio_subscriptions r ON u.id=r.userId WHERE r.portfolioId = ${id}`, (err,res) =>{
        if (err){
          result({kind: "Could not gather users"}, null);
          return;
        }
        else {
          result(null, res);
          return;
        }
      }
    )
  }

  static findUserInPortfolio(portfolioId, userId, result){
    sql.query(
      "SELECT * FROM users u INNER JOIN portfolio_subscriptions r ON u.id=r.userId WHERE r.portfolioId = ? AND u.id = ?",[portfolioId, userId], (err,res) =>{
        console.log(err,res)
        if (err){
          result({kind: "No such user in portfolio"}, null);
          return;
        }
        else if (res.length){
          result(null, res)
          return;
        }
        else {
          result({kind: "Nothing to search"},null)
          return;
        }
      }
    )
  }

  static updateValue(portfolioId,newValue, result){
    this.findById(portfolioId, (err, res)=>{
      var portf = res;
      portf.value = parseInt(newValue);
      const investmentInfo = new Investment({
        value: parseInt(newValue)-parseInt(res.value),
        userId: 3,
        portfolioId: portfolioId,
        portfolioValue: portf.value
      })
      this.updateById(portfolioId, portf, (err,updateResult)=>{
        Investment.create(investmentInfo, (err,investmentResult)=>{
          console.log(err,investmentResult)
          result(null, updateResult);
          return;
        })
      })
    })
  }

  static addInvestor(portfolioId, userId, investmentValue, result){
    this.findById(portfolioId, (err,portfolioResult) =>{
      if (investmentValue >= 0){
        this.findUserInPortfolio(portfolioId, userId, (err,userFound) => {
          if (err){
            sql.query(
              "INSERT INTO portfolio_subscriptions SET ?",{portfolioId,userId}, (err,res) => {
                if (err){
                  result({kind: "Error adding user", portfolio: portfolioResult},null)
                  console.log(err)
                  return;
                }
                else {
                  var portf = portfolioResult;
                  portf.value += parseInt(investmentValue);
                  const investmentInfo = new Investment({
                    value: investmentValue,
                    userId: userId,
                    portfolioId: portfolioId,
                    portfolioValue: portf.value
                  })
                  this.updateById(portfolioId, portf, (err,updateResult)=>{
                    Investment.create(investmentInfo, (err,investmentResult)=>{
                      console.log(err,investmentResult)
                      result(null, updateResult);
                      return;
                    })
                  })
                  
                }
              }
            )
          }
          else {
            var portf = portfolioResult;
            portf.value += parseInt(investmentValue);
            const investmentInfo = new Investment({
              value: investmentValue,
              userId: userId,
              portfolioId: portfolioId,
              portfolioValue: portf.value
            })
            this.updateById(portfolioId, portf, (err,updateResult)=>{
              Investment.create(investmentInfo, (err,investmentResult)=>{
                console.log(err,investmentResult)
                result(null, updateResult);
                return;
              })
            })
          }
        });
      }
      else {
        result({kind: "Investmentvalue can't be 0 or less",portfolio: portfolioResult},null)
        return;
      }
    }
  )}
}
  
module.exports = Portfolio;



