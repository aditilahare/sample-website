const User = require("./src/user.js").User;
const timeStamp = require("./time").timeStamp;

const toJsonString = function(data){
  return JSON.stringify(data,null,2);
};

const lib = {
  users : {},
  getAllFileData(){
    try{
      return this.fs.readFileSync("./data/data.json","utf8");
    }catch(e){
      console.log(e);
    }
  },
  loadFileData(req,res,next){
    const fileData = lib.getAllFileData.call(this);
    const users = JSON.parse(fileData);
    const usernames = Object.keys(users);
    usernames.map((username) => {
      users[username].__proto__ = new User().__proto__;
    });
    lib.users = users;
    next();
  },
  writeToFile(){
    const users = JSON.stringify(lib.users,null,2);
    this.fs.writeFileSync("./data/data.json",users);
  },
  logRequest(req,res,next){
    const text = ["------------------------------",
      `${timeStamp()}`,
      `${req.method} ${req.url}`,
      `HEADERS=> ${toJsonString(req.headers)}`,
      `COOKIES=> ${toJsonString(req.cookies)}`,
      `BODY=> ${toJsonString(req.body)}`,""].join("\n");
    this.fs.appendFile("request.log",text,() => {});
    console.log(`${req.method} ${req.url}`);
    next();
  }
};

module.exports = lib;
