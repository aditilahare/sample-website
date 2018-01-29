const Item = require("./item.js").Item;

class Todo{
  constructor(title,description){
    this._title = title;
    this._description = description;
    this._items = [];
  }
  get title(){
    return this._title;
  }
  get description(){
    return this._description;
  }
  getItem(index){
    return this._items[index];
  }
  get items(){
    return this._items;
  }
  addItem(item){
    const newItem = new Item(item);
    this._items.push(newItem);
  }
  updateTitle(newTitle){
    this._title = newTitle;
  }
  updateDescription(newDescription){
    this._description = newDescription;
  }
  markItemDone(index){
    this._items[index].__proto__=new Item().__proto__;
    this._items[index].markDone();
  }
  markItemUndone(index){
    this._items[index].__proto__=new Item().__proto__;
    this._items[index].markUndone();
  }
}
exports.Todo = Todo;
