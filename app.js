const express = require('express');
const appLib = require('./appLib.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const registered_users = [{'userName':'Aditi','password':'1'},{'userName':'Nitesh','password':'2'}];
const CompositeHandler = require('./handlers/compositeHandler.js');
const StaticFileHandler = require('./handlers/staticFileHandler.js');
const PostLogoutHandler = require('./handlers/postLogoutHandler.js');

let compositeHandler = new CompositeHandler();
let staticFileHandler = new StaticFileHandler('public');
let postLogoutHandler = new PostLogoutHandler();

compositeHandler.addHandler(staticFileHandler);

const redirectLoggedInUserToHome = (req,res,next)=>{
  if(['/','/login'].includes(req.url) && req.user) res.redirect('/home');
  next();
}
const redirectLoggedOutUserToLogin = (req,res,next)=>{
  if(['/','/home','/logout'].includes(req.url) && !req.user) res.redirect('/login');
  next();
}
const loadUser = (req,res,next)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
  next();
};

const postLoginAction = function(req,res,next){
  let validUser = registered_users.find((u)=>u.userName==req.body.name);
  let validPassword = validUser['password']==req.body.password;
  if(!validUser || !validPassword){
    res.clearCookie('sessionid');
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.cookie('sessionid',sessionid);
  validUser.sessionid = sessionid;
  res.redirect('/home');
}

const getUserName = function(req){
  let sessionid = req.cookies.sessionid;
  console.log('reqcookies = '+JSON.stringify(req.cookies));
  console.log('registered_users = '+JSON.stringify(registered_users));
  let user = registered_users.find(u=>u.sessionid==sessionid);
  let userName = user['userName'];
  return userName;
}

const onDataRequest = function(req,res,next){
  let userName = getUserName(req);
  let todo = req.body;
  console.log(req.body);
  console.log('req.body = '+todo.title!='');
  let todos = appLib.users[userName].todos;
  if(todo.title!='' && todo.description!=''){
    appLib.users[userName].addTodo(todo.title,todo.description);
    todos = appLib.users[userName].todos;
    res.send(todos);
    writeToFile();
    return;
  }
  res.send(todos);
}

const onDelete = function(req,res,next){
  let todoIndex = req.body.id;
  let userName = getUserName(req);
  appLib.users[userName].deleteTodo(todoIndex);
  let todos = appLib.users[userName].todos;
  writeToFile();
  res.send(todos);
}

const deleteItem = function(req,res,next){
  let todoIndex = req.body.todoIndex;
  let itemIndex = req.body.itemIndex;
  let userName = getUserName(req);
  appLib.users[userName].deleteItem(todoIndex,itemIndex);
  let items = appLib.users[userName].getItems(todoIndex);
  res.send(items);
  writeToFile();
}


const addItem = function(req,res,next){
  let item = req.body.item;
  let index = req.body.index;
  let userName = getUserName(req);
  let items = appLib.users[userName].getItems(index);
  if(item!=""){
    appLib.users[userName].addItem(index,item);
    items = appLib.users[userName].getItems(index);
    writeToFile();
    res.send(items);
    return;
  }
  res.send(items);
}

let app = express();
let loadFileData = appLib.loadFileData.bind(app);
let writeToFile = appLib.writeToFile.bind(app);
let logRequest = appLib.logRequest.bind(app);
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

app.post('/onDataRequest',onDataRequest);
app.post('/login',postLoginAction);
app.post('/onDelete',onDelete);
app.post('/deleteItem',deleteItem);
app.post('/addItem',addItem);
app.post('/logout',postLogoutHandler.getRequestHandler());
module.exports = app;
