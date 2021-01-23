const Login = require("../models/login");

exports.login = (req,res) => {
    if (!req.body) {
        const model = {
            title: "Login!",
            notif: {type: 'warning', message:"Fields can't be empty!"}
        }
        res.render("login.hbs", model);
    }
    const credentials = new Login({
        email: req.body.email,
        password: req.body.password
    });
    
    
    Login.login(credentials, (err, data) => {
        if (err) {
            const model = {
                title: "Login!",
                notif: {type: 'warning', message:err.kind}
            }
            res.render("login.hbs", model);
        }
        else {
            const model = {title:"Home!",notif:{type: "success", message:"Successfully logged in!"}, user: data}
            req.session.loggedIn = true;
            req.session.user = data;
            if (req.session.user.email === "admin@admin.com"){
                req.session.admin = true;
            }
            res.render("home.hbs", model);
        }
    });
}

exports.logout = (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;
    req.session.admin = false;
    res.redirect("/");
}


