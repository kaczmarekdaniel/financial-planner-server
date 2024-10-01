import express from "express";
import session from "express-session";

import PrismaSessionStore from "./src/handlers/session";
import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import sessionRouter from "./src/routes/sessionRouter";
import spendingsRouter from "./src/routes/spendingsRouter";
import paymentsRouter from "./src/routes/paymentsRouter";
import { asyncHandler } from "./src/helpers/asyncHandler";
import passport from "./src/routes/passport";
import userRouter from "./src/routes/user";

const app = express();
const prisma = new PrismaClient();
const sessionStore = new PrismaSessionStore(prisma);

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
    })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    res.setHeader("Access-Control-Allow-Credentials", "true");

    next();
});

app.use(
    session({
        secret: "your_secret_key",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 86400000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", asyncHandler(sessionRouter));
app.use("/spendings", asyncHandler(spendingsRouter));
app.use("/payments", asyncHandler(paymentsRouter));
app.use("/user", asyncHandler(userRouter))



app.use((err, req, res, next) => {
    console.error("Global error handler caught:", err);
    res.status(500).json({ message: "Something went wrong!" });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
