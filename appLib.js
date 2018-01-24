const User = require('./src/user.js').User;
const timeStamp = require('./time').timeStamp;

const toJsonString = function(data){
  return JSON.stringify(data,null,2);
}

let lib = {
  users : {},
  getAllFileData : function(filePath){
    try{
      return this.fs.readFileSync('./data/data.json','utf8');
    }catch(e){
      console.log(e);
    }
  },
  loadFileData : function(req,res,next){
    let fileData = lib.getAllFileData.call(this);
    let users = JSON.parse(fileData);
    let usernames = Object.keys(users);
    usernames.map((username)=>{
      users[username].__proto__ = new User().__proto__;
    });
    lib.users = users;
    next();
  },
  writeToFile : function(){
    let users = JSON.stringify(lib.users,null,2);
    this.fs.writeFileSync('./data/data.json',users);
  },
  logRequest : function(req,res,next){
    let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toJsonString(req.headers)}`,
    `COOKIES=> ${toJsonString(req.cookies)}`,
    `BODY=> ${toJsonString(req.body)}`,''].join('\n');
    this.fs.appendFile('request.log',text,()=>{});
    console.log(`${req.method} ${req.url}`);
    next();
  }
}

module.exports = lib;
