const deleteTodo = function(event){
  const method = "POST";
  const url = "/onDelete";
  const data = `id=${event.target.className}`;
  sendRequest(method,url,displayTodo,data);
};
const deleteItem = function(){
  const itemIndex = event.target.className;
  const todoIndex = document.getElementsByTagName("button")[1].id;
  const method = "POST";
  const url = "/deleteItem";
  const data = `itemIndex=${itemIndex}&todoIndex=${todoIndex}`;
  sendRequest(method,url,displayItems,data);
};
const displayItems = function(){
  document.getElementById("displayItem").innerHTML = "";
  const data = this.responseText;
  items = JSON.parse(data);
  let buttonId = 0;
  items.forEach((item) => {
    const todoItem = document.createElement("p");
    const br = document.createElement("br");
    const button = document.createElement("BUTTON");
    button.className=buttonId;
    button.innerText = "Delete";
    button.onclick = deleteItem;
    todoItem.innerText = item;
    buttonId++;
    document.getElementById("displayItem").appendChild(todoItem);
    document.getElementById("displayItem").appendChild(button);
    document.getElementById("displayItem").appendChild(br);
  });
};

const addItem = function(){
  const input = document.querySelector("#item").value;
  const method = "POST";
  const url = "/addItem";
  const data = `item=${input}&index=${event.target.className}`;
  sendRequest(method,url,displayItems,data);
};

const createAddItemButton = function(){
  const className = event.target.className;
  document.getElementById("div").innerHTML = "";
  const input = document.createElement("INPUT");
  const button = document.createElement("BUTTON");
  button.className = className;
  button.id = className;
  input.placeholder = "Input Item";
  input.id = "item";
  button.innerText = "Add";
  button.onclick = addItem;
  document.getElementById("div").appendChild(input);
  document.getElementById("div").appendChild(button);
  const method = "POST";
  const url = "/addItem";
  const data = `item=${""}&index=${className}`;
  sendRequest(method,url,displayItems,data);
};

const displayTodo = function(){
  document.getElementById("div").innerHTML = "";
  let text = this.responseText;
  text = JSON.parse(text);
  let buttonId = 0;
  text.forEach((todo) => {
    const title = document.createElement("p");
    const description = document.createElement("p");
    const br = document.createElement("br");
    const button = document.createElement("BUTTON");
    button.className=buttonId;
    button.innerText = "Delete";
    button.onclick = deleteTodo;
    title.className=buttonId;
    title.onclick = createAddItemButton;
    title.innerText = todo._title;
    description.innerText = todo._description;
    buttonId++;
    document.getElementById("div").appendChild(title);
    document.getElementById("div").appendChild(description);
    document.getElementById("div").appendChild(button);
    document.getElementById("div").appendChild(br);
  });
};

const loadData = function(){
  const method = "POST";
  const url = "/onDataRequest";
  const title = document.querySelector("#title").value;
  const description = document.querySelector("#description").value;
  const emptyArray = [];
  const data = `title=${title}&description=${description}`;
  sendRequest(method,url,displayTodo,data);
};

const sendRequest = function(method,url,callback,data){
  const req = new XMLHttpRequest();
  req.open(method,url);
  req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  req.addEventListener("load",callback);
  req.send(data);
};

window.onload = loadData;
