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
import { agentRoutes } from "./app/modules/agents/agentRoutes";
import { adminRoutes } from "./app/modules/admin/admin.route";
import { AboutRoutes } from "./app/modules/about/about.route";
import { pricingRoutes } from "./app/modules/pricing/pricing.route";
import { faqRoutes } from "./app/modules/faq/faq.route";


const app = express();

app.set("trust proxy", 1)
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://digital-wallet-api-client.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());


// Helmet security headers with updated CSP and relaxed cross-origin policies
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://digital-wallet-api-client.vercel.app"],
        styleSrc: ["'self'", "https://digital-wallet-api-client.vercel.app", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "https://digital-wallet-api-client.vercel.app"],
      },
    },
  })
);

// Relax these cross-origin policies for your frontend access
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use('/api/v1/users', UserRoutes)
app.use('/api/v1/transactions', transactionRoutes)

app.use('/api/v1/wallet', walletRoutes)

app.use("/api/v1/auth", AuthRoutes); 

app.use("/api/v1/admin/agents", agentRoutes);

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/about", AboutRoutes);
app.use("/api/v1/pricing", pricingRoutes);
app.use("/api/v1/faq", faqRoutes);

app.get("/", (req: Request, res: Response) =>{
    res.status(200).json({
        message: "Welcome to Digital Wallet Api Backend"
    })
})

export default app;