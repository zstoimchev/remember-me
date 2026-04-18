import express, {Request, Response} from "express";
import recognitionRouter from "./src/routes/recognitionRoute";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
app.use('/api', recognitionRouter);

// test routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello from TypeScript Express 🚀");
});

app.get("/health", (req: Request, res: Response) => {
    res.json({status: "ok"});
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});