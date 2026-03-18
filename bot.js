const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("tareas.db");

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    materia TEXT,
    tarea TEXT,
    fecha TEXT,
    fecha_entrega TEXT
)`);

// obtener tareas
app.get("/tareas", (req,res)=>{

db.all("SELECT * FROM tareas ORDER BY fecha_entrega ASC", [], (err,rows)=>{

res.json(rows);

});

});

// eliminar tarea
app.delete("/tareas/:id",(req,res)=>{

let id = req.params.id;

db.run("DELETE FROM tareas WHERE id=?", [id], ()=>{

res.json({ok:true});

});

});
app.get("/", (req,res)=>{
res.send("Bot de tareas funcionando");
});
app.listen(PORT, () => {
console.log("Servidor web corriendo en http://localhost:3000");
});

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
authStrategy: new LocalAuth({
dataPath: "./session"
}),
puppeteer: {
headless: true,
args: [
"--no-sandbox",
"--disable-setuid-sandbox",
"--disable-dev-shm-usage",
"--disable-accelerated-2d-canvas",
"--no-first-run",
"--no-zygote",
"--single-process"
]
}
});

client.on('qr', qr => {
qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
console.log('Bot conectado a WhatsApp');
});

client.on('message_create', message => {

let texto = message.body;

console.log("Mensaje recibido:", texto);

if(texto.startsWith("Tarea:")){

let partes = texto.split(":",4);

if(partes.length < 4){
client.sendMessage(message.from,"Formato incorrecto.\nUsa:\nTarea:Materia:Tarea:Fecha");
return;
}

let materia = partes[1].trim();
let tarea = partes[2].trim();
let fecha_entrega = partes[3].trim();

let fecha = new Date().toLocaleString();

db.run(
"INSERT INTO tareas (materia, tarea, fecha, fecha_entrega) VALUES (?, ?, ?, ?)",
[materia, tarea, fecha, fecha_entrega]
);

client.sendMessage(
message.from,
`✅ Tarea guardada

📚 Materia: ${materia}
📝 Tarea: ${tarea}
📅 Entrega: ${fecha_entrega}`
);

}

});

client.initialize();