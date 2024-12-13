import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
app.use(cors()); // Добавить поддержку CORS
app.use(express.json());
const port = 3000;

// Подключение к MongoDB
const url = "mongodb://localhost:27017";
const dbName = "gameLogs";

let db;

const client = new MongoClient(url, { useUnifiedTopology: true });

client.connect()
    .then(() => {
        db = client.db(dbName);
        console.log("Connected to MongoDB");
    })
    .catch((error) => console.error("Failed to connect to MongoDB", error));

// Middleware для обработки JSON
app.use(express.json());

// Маршрут для логирования действий
app.post("/log", async (req, res) => {
    try {
        const { game, user, action } = req.body;
        const timestamp = new Date();

        // Сохранение в MongoDB
        await db.collection("logs").insertOne({ game, user, action, timestamp });
        res.status(200).send({ message: "Action logged successfully" });
    } catch (error) {
        console.error("Error logging action:", error);
        res.status(500).send({ error: "Failed to log action" });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
