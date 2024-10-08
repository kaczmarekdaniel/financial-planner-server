// isAuthenticated.js

function protectRoute(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

export default protectRoute;
