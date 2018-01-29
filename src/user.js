const Todo = require("./todo.js").Todo;

class User {
  constructor(name) {
    this._name = name;
    this._todos = [];
  }
  addTodo(title,description){
    const todo = new Todo(title,description);
    this._todos.push(todo);
    return this._todos;
  }
  get todos(){
    return JSON.stringify(this._todos);
  }
  addItem(index,item){
    this._todos[index]["_items"].push(item);
  }
  getItems(index){
    return JSON.stringify(this._todos[index]._items);
  }
  deleteTodo(index){
    this._todos.splice(index,1);
  }
  deleteItem(index,itemIndex){
    this._todos[index]["_items"].splice(itemIndex,1);
  }
}

exports.User = User;
