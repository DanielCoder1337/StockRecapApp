const Portfolio = require("../models/portfolios");
const User = require("../models/users");
const Investment = require("../models/investments")
// Create and Save a new Customer
exports.create = (req, res) => {
  // Validate request
  if (!req.session.admin) res.render("home.hbs", {notif: {type: 'danger', message: "You are not eligible to register an account!"}})
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const portfolio = new Portfolio({
    name: req.body.name,
    description: req.body.description,
    value: req.body.value
  });

  // Save Customer in the database
  Portfolio.create(portfolio, (err, data) => {
    if (err)
      if (err.kind === "Name used!"){
        const model = {
          title: "Create portfolio!", notif: {type: "Name used!", message: "This name is already used!"}
        }
        res.render("portfoliosCreate.hbs", model)
      }else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      }
    else {
        const model = {
            notif: {type: 'success', message: "Successfully created portfolio!"}
        }
        res.render("home.hbs", model)
    }
  });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
    Portfolio.getAll((err, data) => {
        if (err)
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving users."
            });
        else {
            const model = {
            title: "All portfolios!",
            portfolios: data
            };
            console.log(model);
            res.render("portfoliosAll.hbs", model);
        }
    });
};

exports.findOne = (req, res) => {
    Portfolio.findById(req.params.portfolioId, (err, data) => {
        if (err) {
            const model = {
              notif: {type: 'warning', message: "Could not find portfolio!"}
            }
            res.render("home.hbs",model)
        } else{
            const model = {
                portfolio: data
            }
            res.render("portfolio.hbs", model)
            return;
        }
    });
};

exports.addInvestor = (req, response) => {
    const portId = req.params.portfolioId;
    const userEmail = req.body.investorEmail;
    console.log(portId, userEmail)
    User.findByEmail(userEmail, (err,user) =>{
        if (err) {
            const model = {
                notif: {type: 'warning', message: "User does not exist!"}
            }
            response.render("home.hbs", model)
        }
        else {
            Portfolio.addInvestor(portId, user.id, req.body.investorValue, (err,givenResult)=>{
                console.log(err,givenResult)
                if (err){
                    if(err.kind == "Error adding user"){
                        const model = {
                            notif: {type: 'warning', message: "Error adding user to portfolio!"},
                            portfolio: err.portfolio
                        }
                        response.render("portfolio.hbs", model)
                    }
                    else if (err.kind == "User already exists in portfolio"){
                        const model = {
                            notif: {type: 'warning', message: "User already exists in portfolio!"},
                            portfolio: err.portfolio
                        }
                        response.render("portfolio.hbs", model)
                    }
                    else if (err.kind == "Investmentvalue can't be 0 or less"){
                        const model = {
                            notif: {type: 'warning', message: "Investment has to be higher than 0"},
                            portfolio: err.portfolio
                            
                        }
                        response.render("portfolio.hbs", model)
                    }
                    else {
                        const model = {
                            notif: {type: 'danger', message: "Error!"},
                            portfolio: err.portfolio
                        }
                        response.render("portfolio.hbs", model)
                    }
                }
                else {
                    const model = {
                        notif: {type: 'success', message: "Successfully added user"},
                        portfolio: givenResult
                    }
                    response.render("portfolio.hbs", model)
                }
            })
        }
    })
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
    res.status(400).send({
        message: "Content can not be empty!"
    });
    }

    Portfolio.updateById(
        req.params.portfolioId,
        new Portfolio(req.body),
        (err, data) => {
            if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                message: `Could not find Portfolio with id ${req.params.portfolioId}.`
                });
            } else {
                res.status(500).send({
                message: "Error updating Portfolio with id " + req.params.portfolioId
                });
            }
            } else res.send(data);
        }
    );
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
  
};

exports.getInvestors = (req,res) => {
    Portfolio.findAllUsers(req.params.portfolioId, (err,users) => {
        if (err && err.kind == "Could not gather users"){
            const model = {
                notif: {type: 'danger', message: "Could not gather users for this portfolio!"}
            }
            res.render("home.hbs", model)
            return;
        }
        else {
            const model = {
                users
            }
            res.render("portfolioInvestors.hbs", model)
            return;
        }
    })
}

exports.updateValue = (req, res) => {
    const newValue = req.body.newPortfolioValue;
    const portfolioId = req.params.portfolioId;
    Portfolio.updateValue(portfolioId,newValue, (err,result)=>{
        if (!err){
            const model = {
                notif: {
                    type: 'success',
                    message: "Successfully updated portfoliovalue!"
                },
                portfolio: result
            }
            res.render("portfolio.hbs", model)
        }
    })
};