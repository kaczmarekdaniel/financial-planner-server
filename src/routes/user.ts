import { Router } from "express";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user as { id: string; name: string };
        res.json({ name: user.name });
    } else {
        res.json({ message: "Unauthorized" });
    }
});

export default userRouter;