import express from "express";
import { getAllFAQs } from "./faq.controller";

const router = express.Router();

router.get("/", getAllFAQs);

export const faqRoutes = router;
