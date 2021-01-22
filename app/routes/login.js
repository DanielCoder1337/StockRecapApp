module.exports = app => {
    const login = require("../controllers/loginController");
  
    // Create a new User
    app.post("/login", login.login);
  
    app.get("/login", (req,res) => {
        res.render("login.hbs", {title: "Login!"})
    });

    app.get("/register", (req,res) => {
        res.render("usersCreate.hbs")
    });

    // Retrieve all User
    app.get("/logout", login.logout);
};
