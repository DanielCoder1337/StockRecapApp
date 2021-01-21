module.exports = app => {
    const user = require("../controllers/userController");
  
    // Create a new User
    app.post("/users", user.create);
  
    // Retrieve all User
    app.get("/users", user.findAll);
  
    // Retrieve a single User with userId
    app.get("/users/:userId", user.findOne);
  
    // Update a User with userId
    app.put("/users/:userId", user.update);
};
