const sql = require("./db");
const User = require("./users");
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
  static profit(userId,portfolioId, result){
    const Portfolio = require("./portfolios");
    Portfolio.findUserInPortfolio(portfolioId,userId, (err,res)=>{
      if (!err){
        sql.query(
          "SELECT * FROM investments WHERE portfolioId = ? ORDER BY date ASC", [portfolioId], (err,allInvestments)=>{
            Portfolio.findById(portfolioId, (err,portResult)=>{
              const currentPortfolioValue = portResult.value
              var userInvestedTotal = 0;
              var totalInvested = 0;
              var lastCountedAt = 0;
              var profit = 0;
              for (var i = 0; i < allInvestments.length; i++){
                if (allInvestments[i].userId == userId){ // calculate profits to this point
                  totalInvested+= allInvestments[i].value
                  userInvestedTotal+= allInvestments[i].value
                  let margin = ((allInvestments[i+1].portfolioValue - allInvestments[i+1].value) - totalInvested) - lastCountedAt;
                  if (margin != 0) lastCountedAt = allInvestments[i].portfolioValue + margin;
                  let userCut = userInvestedTotal / totalInvested;
                  profit += margin * userCut;
                }
                else if (i == allInvestments.length-1){
                  totalInvested+= allInvestments[i].value
                  let margin = currentPortfolioValue - (totalInvested + lastCountedAt);
                  lastCountedAt = allInvestments[i].portfolioValue + margin;
                  let userCut = userInvestedTotal / totalInvested;
                  profit += margin * userCut;
                }
                else {
                  totalInvested+= allInvestments[i].value
                }
              }
              totalInvested = totalInvested.toFixed(2);
              profit = profit.toFixed(2);
              userInvestedTotal = userInvestedTotal.toFixed(2);
              result(null, {profit, totalInvested, userInvestedTotal})
            })
          }
        )
      }
      else{
        result({kind: "Not found in this portfolio"},null)
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



