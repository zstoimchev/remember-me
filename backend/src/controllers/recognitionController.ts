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

        const result = await recognizePerson(req.file.buffer);

        return res.json({
            success: true,
            data: result,
        });
    } catch (err) {
        console.log("ERROR in handleRecognize:", err);
        next(err);
    }
}