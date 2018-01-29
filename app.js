const express = require("express");
const appLib = require("./appLib.js");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const registered_users = [{"userName":"Aditi","password":"1"},{"userName":"Nitesh","password":"2"}];
const CompositeHandler = require("./handlers/compositeHandler.js");
const StaticFileHandler = require("./handlers/staticFileHandler.js");
const PostLogoutHandler = require("./handlers/postLogoutHandler.js");

const compositeHandler = new CompositeHandler();
const staticFileHandler = new StaticFileHandler("public");
const postLogoutHandler = new PostLogoutHandler();

compositeHandler.addHandler(staticFileHandler);

const redirectLoggedInUserToHome = (req,res,next) => {
  if(["/","/login"].includes(req.url) && req.user) {res.redirect("/home");}
  next();
};
const redirectLoggedOutUserToLogin = (req,res,next) => {
  if(["/","/home","/logout"].includes(req.url) && !req.user) {res.redirect("/login");}
  next();
};
const loadUser = (req,res,next) => {
  const sessionid = req.cookies.sessionid;
  const user = registered_users.find((u) => u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
  next();
};

const postLoginAction = function(req,res,next){
  const validUser = registered_users.find((u) => u.userName==req.body.name);
  const validPassword = validUser["password"]==req.body.password;
  if(!validUser || !validPassword){
    res.clearCookie("sessionid");
    res.redirect("/login");
    return;
  }
  const sessionid = new Date().getTime();
  res.cookie("sessionid",sessionid);
  validUser.sessionid = sessionid;
  res.redirect("/home");
};

const getUserName = function(req){
  const sessionid = req.cookies.sessionid;
  const user = registered_users.find((u) => u.sessionid==sessionid);
  const userName = user["userName"];
  return userName;
};

const onDataRequest = function(req,res,next){
  const userName = getUserName(req);
  const todo = req.body;
  let todos = appLib.users[userName].todos;
  if(todo.title!="" && todo.description!=""){
    appLib.users[userName].addTodo(todo.title,todo.description);
    todos = appLib.users[userName].todos;
    // res.send(todos);
    res.write(todos);
    res.end();
    writeToFile();
    return;
  }
  res.send(todos);
};

const onDelete = function(req,res,next){
  const todoIndex = req.body.id;
  const userName = getUserName(req);
  appLib.users[userName].deleteTodo(todoIndex);
  const todos = appLib.users[userName].todos;
  writeToFile();
  res.send(todos);
};

const deleteItem = function(req,res,next){
  const todoIndex = req.body.todoIndex;
  const itemIndex = req.body.itemIndex;
  const userName = getUserName(req);
  appLib.users[userName].deleteItem(todoIndex,itemIndex);
  const items = appLib.users[userName].getItems(todoIndex);
  res.send(items);
  writeToFile();
};


const addItem = function(req,res,next){
  const item = req.body.item;
  const index = req.body.index;
  const userName = getUserName(req);
  let items = appLib.users[userName].getItems(index);
  if(item!=""){
    appLib.users[userName].addItem(index,item);
    items = appLib.users[userName].getItems(index);
    writeToFile();
    res.send(items);
    return;
  }
  res.send(items);
};

const app = express();
const loadFileData = appLib.loadFileData.bind(app);
const writeToFile = appLib.writeToFile.bind(app);
const logRequest = appLib.logRequest.bind(app);
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(logRequest);
app.use(loadUser);
app.use(loadFileData);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);
app.use(compositeHandler.getRequestHandler());

app.post("/onDataRequest",onDataRequest);
app.post("/login",postLoginAction);
app.post("/onDelete",onDelete);
app.post("/deleteItem",deleteItem);
app.post("/addItem",addItem);
app.post("/logout",postLogoutHandler.getRequestHandler());
module.exports = app;
