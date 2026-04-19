import { Router } from "express";
import { handleSummarize } from "../controllers/summarizeController";

const router = Router();

router.post("/summarize", handleSummarize);

export default router;
