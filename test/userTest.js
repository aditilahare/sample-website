const User = require("../src/user.js").User;
const assert = require("chai").assert;

describe("User",() => {
  describe("addTodo()",() => {
    it("adds a todo having title,description",() => {
      const user = new User("alok");
      const userTodo = user.addTodo("buy","milk");
      const expectedTodos = [{_title:"buy",_description:"milk",_items:[]}];
      assert.deepEqual(userTodo,expectedTodos);
    });
  });
  describe("todos",() => {
    it("gives all the todos",() => {
      const user = new User("alok");
      const userTodo = user.addTodo("buy","milk");
      const expectedTodos = [{_title:"buy",_description:"milk",_items:[]}];
      assert.equal(user.todos,"[{\"_title\":\"buy\",\"_description\":\"milk\",\"_items\":[]}]");
    });
  });
  describe("addItem()",() => {
    it("adds a item given index of todo",() => {
      const user = new User("alok");
      const userTodo = user.addTodo("buy","milk");
      user.addItem(0,"go to shop");
      const expectedTodos = "[{\"_title\":\"buy\",\"_description\":\"milk\",\"_items\":[\"go to shop\"]}]";
      assert.equal(user.todos,expectedTodos);
    });
  });
  describe("getItems()",() => {
    it("gives items of a particular todo given its index",() => {
      const user = new User("alok");
      const userTodo = user.addTodo("buy","milk");
      user.addItem(0,"go to shop");
      const expectedItems = "[\"go to shop\"]";
      assert.equal(user.getItems(0),expectedItems);
    });
  });
  describe("deleteTodo()",() => {
    it("deletes a todo given its index",() => {
      const user = new User("alok");
      const userTodo = user.addTodo("buy","milk");
      const expectedTodos = [{_title:"buy",_description:"milk",_items:[]}];
      assert.deepEqual(userTodo,expectedTodos);
      user.deleteTodo(0);
      assert.equal(user.todos,"[]");
    });
  });
  describe("deleteItem()",() => {
    it("deletes an item given index of item and todo",() => {
      const user = new User("alok");
      const userTodo = user.addTodo("buy","milk");
      user.addItem(0,"go to shop");
      const expectedItems = "[\"go to shop\"]";
      assert.equal(user.getItems(0),expectedItems);
      user.deleteItem(0,0);
      assert.equal(user.todos,"[{\"_title\":\"buy\",\"_description\":\"milk\",\"_items\":[]}]");
    });
  });
});
