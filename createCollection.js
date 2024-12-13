import { MongoClient } from "mongodb";

// URL для подключения к MongoDB
const url = "mongodb://localhost:27017";
const dbName = "gameLogs";

async function createCollection() {
    const client = new MongoClient(url);

    try {
        // Подключение к MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);

        // Создание коллекции с валидацией
        await db.createCollection("logs", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["game", "user", "action", "timestamp"],
                    properties: {
                        game: {
                            bsonType: "string",
                            description: "Название игры, обязательное поле",
                        },
                        user: {
                            bsonType: "string",
                            description: "Идентификатор пользователя, обязательное поле",
                        },
                        action: {
                            bsonType: "string",
                            description: "Описание действия, обязательное поле",
                        },
                        timestamp: {
                            bsonType: "date",
                            description: "Время действия, обязательное поле",
                        },
                    },
                },
            },
        });

        console.log("Collection 'logs' created successfully");
    } catch (error) {
        console.error("Error creating collection:", error);
    } finally {
        await client.close();
    }
}

createCollection();
