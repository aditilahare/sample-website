let DefaultHandler = require('./defaultHandler.js');
let fs = require('fs');

class StaticFileHandler extends DefaultHandler {
  constructor(root) {
    super();
    this.root = root;
  }
  getFilePath(url) {
    return `./${this.root}${url}`;
  }
  getContentType(filePath) {
    let contentTypes = {
      '.js': 'text/javascript',
      '.html': 'text/html',
      '.css': 'text/css',
      '.jpeg': 'image/jpeg',
      '.txt': 'text/plain',
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.ico': 'image/ico'
    }
    let fileExtension = filePath.slice(filePath.lastIndexOf('.'));
    return contentTypes[fileExtension];
  }
  execute(req,res) {
    let data;
    let htmlFiles = ['/login', '/home', '/login.html', '/home.html'];
    if (!res.finished && req.method=='GET') {
      if(htmlFiles.includes(req.url))
        req.url += '.html';
      try {
        data = fs.readFileSync(this.getFilePath(req.url), 'utf8');
      } catch (e) {
        return;
      }
      // res.setHeader('Content-Type', this.getContentType(req.url));
      res.send(data);
    }
  }
}

module.exports = StaticFileHandler;
