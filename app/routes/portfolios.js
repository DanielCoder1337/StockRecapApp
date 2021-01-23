module.exports = app => {
    const portfolio = require("../controllers/portfolioController");
  
    app.post("/portfolios", portfolio.create);
  
    app.get("/portfoliosAll", portfolio.findAll);
  
    app.get("/portfolios/:portfolioId", portfolio.findOne);
  
    app.get("/portfolios", (req,res) => {
        res.render("portfoliosCreate.hbs")
    });

    app.get("/portfoliosEdit/:portfolioId", (req,res) => {
        res.render("portfoliosCreate.hbs")
    });

    app.post("/portfoliosAddInvestor/:portfolioId", portfolio.addInvestor)

    app.put("/portfolios/:portfolioId", portfolio.update);

    app.post("/portfolioValueChange/:portfolioId", portfolio.updateValue);

    app.get("/portfoliosInvetors/:portfolioId", portfolio.getInvestors)
};
