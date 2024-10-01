import prisma from "../../db";
import { getFirstAndLastDayOfMonth } from "../helpers/getFirstAndLastDayOfMonth";
import { categorizeItems } from "./helpers/paymentsHelpers";


export const getUserPayments = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
    });
 
    if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
    }

    if (!req.query.month) {
        res.status(404).json({ error: "Invalid date specified." });
        return;
    }


    const { firstDay, lastDay } = getFirstAndLastDayOfMonth(req.query.month);
    const payments = await prisma.payment.findMany({
        where: {
            userId: req.user.id, 
            dueDate: {
                // Assuming `date` is the field in 'spendings' that stores the spending date
                gte: firstDay,
                lte: lastDay,
            },
        },
    });

    const sorted = categorizeItems(payments);
    res.json({ ...sorted });
};

type CreatePaymentPayload = {   
    userId: string;
    paymentId: string;
    name: string;
    amount: number;
    category: string;
    dueDate: Date;
};

export const calculateMonthsBetweenTimestamps = (
    startDate: Date,
    endDate: Date
): number => {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth(); // getMonth() returns month index (0-11)
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth(); // getMonth() returns month index (0-11)

    let months = (endYear - startYear) * 12 + (endMonth - startMonth);

    return Math.abs(months);
};

const stripTimeFromDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() is zero-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const generateRandomId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

export const createPayment = async (req, res) => {
    try {

        const payload: CreatePaymentPayload = {
            userId: req.user.id,
            paymentId: generateRandomId(),
            name: req.body.name,
            amount: req.body.amount,
            category: req.body.category,
            dueDate: null,
        };

        const createManyPayload = [];

        if (req.body.startDate) {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);
            const monthDifference = calculateMonthsBetweenTimestamps(
                new Date(startDate),
                new Date(endDate)
            );

            const year = startDate.getFullYear();
            const month = startDate.getMonth();
            const day = startDate.getDate();

            for (let i = 0; i < monthDifference; i++) {
                const newDate = new Date(year, month + i, day);
                createManyPayload.push({...payload, dueDate: newDate.toISOString()});
            }
        }

        console.log(createManyPayload);
 
        const payment = await prisma.payment.createMany({
            data: createManyPayload,
        });
        res.json({ data: payment });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error });
    }
};

export const removePayment = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        console.log(req.query.params);

        const payment = await prisma.payment.findUnique({
            where: {
                id: req.params.id,
            },
        });

        if (!payment) {
            return res.status(404).json({ error: "Spend record not found" });
        }

        if (payment.userId !== req.user.id) {
            return res.status(403).json({
                error: "Forbidden: You can only remove your own spend records",
            });
        }

        await prisma.payment.delete({
            where: {
                id: req.params.id,
            },
        });

        res.json({ message: "Spend record deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
