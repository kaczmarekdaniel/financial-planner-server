import Router from "express";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.get("/login/google", (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("User already authenticated, redirecting...");
        res.redirect("/");
    } else {
        // Redirect to Google's OAuth 2.0 server
        res.redirect("/api/auth/callback/google");
    }
});



sessionRouter.get(
    "/callback/google",
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/login?err=true" }),
    (req, res) => {
        res.status(200)
            .cookie("loggedin", "true", { maxAge: 86400000, httpOnly: false })
            .redirect("http://localhost:5173/");
    }
);

export default sessionRouter;
