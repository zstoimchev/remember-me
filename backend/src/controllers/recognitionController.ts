import {Request, Response, NextFunction} from "express";
import {recognizePerson} from "../services/recognitionService";

export async function handleRecognize(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        console.log("1. route entered");

        if (!req.file) {
            console.log("2. no file");
            return res.status(400).json({
                success: false,
                error: "Image is required",
            });
        }

        console.log("3. file exists");
        console.log("4. before recognizePerson");

        const result = await recognizePerson(req.file.buffer);

        console.log("5. after recognizePerson", result);

        return res.json({
            success: true,
            data: result,
        });
    } catch (err) {
        console.log("ERROR in handleRecognize:", err);
        next(err);
    }
}