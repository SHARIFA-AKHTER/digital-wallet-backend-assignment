import express from "express";
import { getAbout, upsertAbout } from "./about.controller";

const router = express.Router();

router.get("/", getAbout);
router.post("/", upsertAbout); 

export const AboutRoutes = router;
