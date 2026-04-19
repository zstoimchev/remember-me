import { Request, Response, NextFunction } from "express";
import { summarizeText } from "../services/summarizeService";

export async function handleSummarize(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { text } = req.body;

        if (!text || typeof text !== "string" || text.trim() === "") {
            res.status(400).json({ error: "Missing or empty 'text' field in request body." });
            return;
        }

        const summary = await summarizeText(text);

        res.json({ summary });
    } catch (err) {
        console.error("ERROR in handleSummarize:", err);
        next(err);
    }
}
