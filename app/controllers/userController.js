const User = require("../models/users");
const Login = require("../models/login");
const loginController = require("./loginController");
// Create and Save a new Customer
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Customer
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });

  // Save Customer in the database
  User.create(user, (err, data) => {
    if (err)
      if (err.kind === "Email used!"){
        const model = {
          title: "Create!", notif: {type: "Email used!", message: "This email is already used!"}
        }
        res.render("usersCreate.hbs", model)
      }else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      }
    else {
      loginController.login();
    }
  });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
      if (err)
          res.status(500).send({
          message:
              err.message || "Some error occurred while retrieving users."
          });
      else {
        const model = {
          title: "All users!",
          users: data
        };
        console.log(model);
        res.render("usersAll.hbs", model);
      }
  });


};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
  User.findById(req.params.customerId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
            res.status(404).send({
                message: `Not found User with id ${req.params.customerId}.`
            });
            } else {
            res.status(500).send({
                message: "Error retrieving User with id " + req.params.customerId
            });
            }
        } else res.send(data);
    });
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  User.updateById(
    req.params.customerId,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.customerId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id " + req.params.customerId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
  
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
  
};