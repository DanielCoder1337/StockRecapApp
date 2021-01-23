const sql = require("./db");
const User = require("./users");
const Portfolio = require("./portfolios");
// constructor
class Investment {
  constructor(investmentInformation) {
    this.value = investmentInformation.value;
    this.userId = investmentInformation.userId;
    this.portfolioId = investmentInformation.portfolioId;
    this.portfolioValue = investmentInformation.portfolioValue
  }
  static create(newInvestment, result) {
    User.findById(newInvestment.userId, (err,user)=>{
      if (err){
          result({kind: "Error retriving user!"}, null)
          return;
      }
      else {
        require("./portfolios").findById(newInvestment.portfolioId, (err,portfolio)=>{
          if (err){
              result({kind: "Error retriving portfolio!"}, null)
              return;
          }
          else {
            sql.query(
              "INSERT INTO investments SET ?", newInvestment, (err,res) => {
                if (err) {
                    result(err,null);
                    return;
                }
                result(null, { id: res.insertId, ...newInvestment });
              }
            )
          }
        });
      }
    })
  }
  static findById(investmentId, result) {
    sql.query("SELECT * FROM investments WHERE id = ?", [investmentId],(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found investment: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Customer with the id
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(result) {
    sql.query("SELECT * FROM investments", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      else {
        console.log("investments: ", res);
        result(null, res);
      }
    });
  }
  static findAllInPortfolio(portfolioId, result){
    sql.query(
      "SELECT * FROM investments WHERE portfolioId = ?",[portfolioId], (err,res) =>{
        if (err){
          result({kind: "No investments in portfolio"}, null);
          return;
        }
        else if (res.length){
          result(null, "investments exist")
        }
        else {
          result({kind: "Nothing to search"},null)
        }
      }
    )
  }

  static updateValue(portfolioId,newValue, result){
    this.findById(portfolioId, (err, res)=>{
      this.updateById(portfolioId, portf, (err,updateResult)=>{
        var portf = res;
        portf.value += parseInt(newValue);
        result(null, updateResult);
        return;
      })
    })
  }
}
  
module.exports = Investment;



