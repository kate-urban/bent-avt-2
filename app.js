const http = require('http');
const os = require("os");
const { MongoClient } = require("mongodb");

const userInfo = os.userInfo();
const uid = userInfo.uid;
const name = userInfo.username;
const hostname = '0.0.0.0';
const port = 3030;
const url = "mongodb://127.0.0.1:27017/";

const mongoClient = new MongoClient(url);
let count = 0;

async function run() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("test1");
    
    // Проверка подключения
    const pingResult = await db.command({ ping: 1 });
    console.log("Подключение к MongoDB успешно установлено");
    
    // Работа с коллекцией users
    const collection = db.collection("users");
    count = await collection.countDocuments();
    console.log(`В коллекции users ${count} документа/ов`);
    
  } catch(err) {
    console.error("Ошибка подключения к MongoDB:", err);
  } finally {
    await mongoClient.close();
    console.log("Подключение закрыто");
  }
}

run().catch(console.error);

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Hello ${name}, в коллекции users ${count} документов`);
});

server.listen(port, hostname, () => {
  console.log(`Сервер запущен на http://${hostname}:${port}/`);
});