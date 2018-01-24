const deleteTodo = function(event){
  let method = 'POST';
  let url = '/onDelete';
  let data = `id=${event.target.className}`;
  sendRequest(method,url,displayTodo,data);
}
const deleteItem = function(){
  let itemIndex = event.target.className;
  let todoIndex = document.getElementsByTagName('button')[1].id;
  let method = 'POST';
  let url = '/deleteItem';
  let data = `itemIndex=${itemIndex}&todoIndex=${todoIndex}`;
  sendRequest(method,url,displayItems,data);
}
const displayItems = function(){
  document.getElementById('displayItem').innerHTML = "";
  let data = this.responseText;
  items = JSON.parse(data);
  let buttonId = 0;
  items.forEach((item)=>{
    let todoItem = document.createElement('p');
    let br = document.createElement('br');
    let button = document.createElement('BUTTON');
    button.className=buttonId;
    button.innerText = 'Delete';
    button.onclick = deleteItem;
    todoItem.innerText = item;
    buttonId++;
    document.getElementById('displayItem').appendChild(todoItem);
    document.getElementById('displayItem').appendChild(button);
    document.getElementById('displayItem').appendChild(br);
  })
}

const addItem = function(){
  let input = document.querySelector('#item').value;
  let method = 'POST';
  let url = '/addItem';
  let data = `item=${input}&index=${event.target.className}`;
  sendRequest(method,url,displayItems,data);
}

const createAddItemButton = function(){
  let className = event.target.className;
  document.getElementById('div').innerHTML = "";
  let input = document.createElement('INPUT');
  let button = document.createElement('BUTTON');
  button.className = className;
  button.id = className;
  input.placeholder = 'Input Item';
  input.id = 'item';
  button.innerText = 'Add';
  button.onclick = addItem;
  document.getElementById('div').appendChild(input);
  document.getElementById('div').appendChild(button);
  let method = 'POST';
  let url = '/addItem';
  let data = `item=${""}&index=${className}`;
  sendRequest(method,url,displayItems,data);
}

const displayTodo = function(){
  document.getElementById('div').innerHTML = "";
  let text = this.responseText;
  console.log(text[0]);
  text = JSON.parse(text);
  let buttonId = 0;
  text.forEach((todo)=>{
    let title = document.createElement('p');
    let description = document.createElement('p');
    let br = document.createElement('br');
    let button = document.createElement('BUTTON');
    button.className=buttonId;
    button.innerText = 'Delete';
    button.onclick = deleteTodo;
    title.className=buttonId;
    title.onclick = createAddItemButton;
    title.innerText = todo._title;
    description.innerText = todo._description;
    buttonId++;
    document.getElementById('div').appendChild(title);
    document.getElementById('div').appendChild(description);
    document.getElementById('div').appendChild(button);
    document.getElementById('div').appendChild(br);
  })
}

const loadData = function(){
  let method = 'POST';
  let url = '/onDataRequest';
  let title = document.querySelector('#title').value;
  let description = document.querySelector('#description').value;
  let emptyArray = [];
  let data = `title=${title}&description=${description}`;
  sendRequest(method,url,displayTodo,data);
}

const sendRequest = function(method,url,callback,data){
  let req = new XMLHttpRequest();
  req.open(method,url);
  req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  req.addEventListener('load',callback);
  req.send(data);
}

window.onload = loadData;
