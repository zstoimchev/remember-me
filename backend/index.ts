import express from "express";
import cors from "cors";
import recognitionRouter from "./src/routes/recognitionRoute";

const app = express();

// enable CORS
app.use(cors());

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", recognitionRouter);

// test routes
app.get("/", (_, res) => {
    res.send("Hello from TypeScript Express 🚀");
});

app.get("/health", (_, res) => {
    res.json({ status: "ok" });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});