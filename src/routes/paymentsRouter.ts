import Router from "express";
import protectRoute from "../middleware/protectRoute";

import {
    createPayment,
    getUserPayments,
    removePayment,
} from "../handlers/payments";

const paymentsRouter = Router();

paymentsRouter.get("/", protectRoute, async (req, res, next) => {
    try {
        await getUserPayments(req, res);
    } catch (e) {
        next(e);
    }
});

paymentsRouter.post("/", protectRoute, async (req, res, next) => {
    try {
        await createPayment(req, res);
    } catch (e) {
        next(e);
    }
});

paymentsRouter.delete("/:id", protectRoute, async (req, res, next) => {
    try {
		await removePayment(req, res);
	} catch(e) {
		next(e);
	}
});

export default paymentsRouter;
