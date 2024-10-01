import prisma from "../../db";
import { getFirstAndLastDayOfMonth } from "../helpers/getFirstAndLastDayOfMonth";

function categorizeItems(items) {
    return items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = []; 
        }
        acc[item.category].push(item); 
        return acc;
    }, {});
}

export const getUserSpendings = async (req, res) => {

    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
    });

    if (!user) {
        res.status(404).json({ error: "Internal server error" });
        return;
    }

    if (!req.query.month) {
        res.status(404).json({ error: "Invalid date specified." });
        return;
    }

    const { firstDay, lastDay } = getFirstAndLastDayOfMonth(req.query.month);
    const spendings = await prisma.spend.findMany({
        where: {
            userId: req.user.id, 
            month: {
                gte: firstDay,
                lte: lastDay,
            },
        },
    });

    const sorted = categorizeItems(spendings);

    res.json({ ...sorted });
};

export const createSpend = async (req, res) => {
    try {
        const monthOfSpend = new Date(req.body.month).toISOString();
        const spend = await prisma.spend.create({
            data: {
                userId: req.user.id,
                name: req.body.name,
                amount: req.body.amount,
                category: req.body.category,
                month: monthOfSpend,
            },
        });

        res.json({ data: spend });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

export const removeSpend = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        console.log(req.query.params);

        const spend = await prisma.spend.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!spend) {
            return res.status(404).json({ error: "Spend record not found" });
        }

        if (spend.userId !== req.user.id) {
            return res.status(403).json({
                error: "Forbidden: You can only remove your own spend records",
            });
        }

        await prisma.spend.delete({
            where: {
                id: req.params.id,
            },
        });

        res.json({ message: "Spend record deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
