const DefaultHandler = require("./defaultHandler.js");
const appLib = require("./../appLib");

class PostLogoutHandler extends DefaultHandler{
  constructor() {
    super();
  }
  execute(req,res){
    res.setHeader("Set-Cookie", ["sessionid=0"]);
    if (req.user) {delete req.user.sessionid;}
    res.redirect("/login");
    res.end();
  }
}

module.exports = PostLogoutHandler;
