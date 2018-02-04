const DefaultHandler = require("./defaultHandler.js");
const fs = require("fs");

class StaticFileHandler extends DefaultHandler {
  constructor(root) {
    super();
    this.root = root;
  }
  getFilePath(url) {
    return `./${this.root}${url}`;
  }
  getContentType(filePath) {
    const contentTypes = {
      ".js": "text/javascript",
      ".html": "text/html",
      ".css": "text/css",
      ".jpeg": "image/jpeg",
      ".txt": "text/plain",
      ".pdf": "application/pdf",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".ico": "image/ico"
    };
    const fileExtension = filePath.slice(filePath.lastIndexOf("."));
    return contentTypes[fileExtension];
  }
  execute(req,res) {
    let data;
    let filePath;
    const htmlFiles = ["/login", "/home", "/login.html", "/home.html"];
    if (!res.finished && req.method=="GET") {
      if(htmlFiles.includes(req.url))
        req.url += ".html";
      try {
        console.log("======>"+req.url);
        filePath = this.getFilePath(req.url);
        data = fs.readFileSync(filePath, "utf8");
      } catch (e) {
        return;
      }
      res.set('Content-Type',this.getContentType(filePath));
      res.send(data);
    }
  }
}

module.exports = StaticFileHandler;
