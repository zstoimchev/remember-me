import {Request, Response, NextFunction} from "express";
import {recognizePerson} from "../services/recognitionService";

export async function handleRecognize(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Image is required",
            });
        }

        console.log("📸 Image received:", req.file.originalname);
        console.log("📦 Size:", req.file.buffer.length, "bytes");

        const result = await recognizePerson(req.file.buffer);

        return res.json({
            success: true,
            data: result,
        });
    } catch (err) {
        next(err);
    }
}