import express from "express";
import { addFAQ, getFAQs } from "./faq.controller";

const router = express.Router();

router.get("/", getFAQs);
router.post("/", addFAQ);

export const faqRoutes = router;
