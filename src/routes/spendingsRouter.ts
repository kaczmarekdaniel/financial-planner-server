import Router from "express";
import passport from "passport";
import protectRoute from "../middleware/protectRoute";
import {
    getUserSpendings,
    createSpend,
    removeSpend,
} from "../handlers/spendings";
import { asyncHandler } from "../helpers/asyncHandler";

const spendingsRouter = Router();

spendingsRouter.get("/", protectRoute, async (req, res, next) => {
    try {
        await getUserSpendings(req, res);
    } catch (e) {
        next(e);
    }
});

spendingsRouter.post("/", protectRoute, async (req, res, next) => {
    try {
        await createSpend(req, res);
    } catch (e) {
        next(e);
    }
});

spendingsRouter.delete("/:id", protectRoute, async (req, res, next) => {
    try {
        await removeSpend(req, res);
    } catch (e) {
        next(e);
    }
});

// spendingsRouter.get(
//     "/api/auth/callback/google",
//     passport.authenticate("google", { failureRedirect: "/error" }),
//     (req, res) => {
//         console.log("user authenticated");
//         res.redirect("/");
//     }
// );

export default spendingsRouter;
