import express from "express";
import cors from "cors";
import helmet from "helmet"
import { Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.route";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./app/config/passport";
import { transactionRoutes } from "./app/modules/transaction/transaction.route";
import { walletRoutes } from "./app/modules/wallet/wallet.route";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());


app.use('/api/users', UserRoutes)
app.use('/api/transactions', transactionRoutes)

app.use('/api/wallets', walletRoutes)

app.use("/api/auth", AuthRoutes);

app.get("/", (req: Request, res: Response) =>{
    res.status(200).json({
        message: "Welcome to Digital Wallet Api Backend"
    })
})

export default app;