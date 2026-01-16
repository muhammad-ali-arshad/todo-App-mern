import { connectDB } from "./config/db.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import taskRouter from "./routes/task.routes.js";



dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());


app.get("/",(req ,res)=>{
    res.send("API is running...");
})

app.use("/api/auth" , authRouter);
app.use("/api/task" , taskRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})