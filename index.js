require("dotenv").config();
require("./db")();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const TelegramBot = require("node-telegram-bot-api");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const noteRoute = require("./routes/noteRoute");
const { errorHandler } = require("./middlewares/errorMiddleware");
const Conterollers = require("./controllers/botController");
const { notFound } = require("./middlewares/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "/client/build")));

// paths
app.use("/api/user", userRoute);
app.use("/api/note", noteRoute);
app.get("/", (req, res) => {
    res.send("API running...");
    // res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

async function main() {
    const bot = await (() =>
        new TelegramBot(process.env.BOT, { polling: true }))();
    await bot.on("text", (msg) => Conterollers.MessageController(bot, msg));
}

main();
