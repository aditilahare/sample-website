const fs = require("fs");
const http = require("http");
const express = require("express");

const PORT = 8080;
const app = express();
const server = http.createServer(app);

app.fs = fs;

app.get('/', (req, res) => {
    res.sendFile('./public/home.html', { root: __dirname });
});

server.on("error",(e) => console.error("**error**", e.message));
server.listen(PORT,(e) => console.log(`server is listening at ${PORT}`));
