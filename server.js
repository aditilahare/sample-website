const fs = require("fs");
const app = require("./app.js");
const http = require("http");
const PORT = 8080;
app.fs = fs;
const server = http.createServer(app);
server.on("error",(e) => console.error("**error**",e.message));
server.listen(PORT,(e) => console.log(`server is listening at ${PORT}`));
