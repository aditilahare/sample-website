const Todo = require("../src/todo.js").Todo;
const assert = require("chai").assert;

describe("Todo",() => {
  describe("updateTitle()",() => {
    it("updates the title of the todo",() => {
      const todo = new Todo("buy milk","go to shop");
      assert.equal(todo.title,"buy milk");
      todo.updateTitle("buy milk powder");
      assert.equal(todo.title,"buy milk powder");
      assert.equal(todo.description,"go to shop");
      assert.deepEqual(todo.items,[]);
    });
  });
  describe("addItem()",() => {
    it("adds a new item to items",() => {
      const todo = new Todo("buy milk","go to shop");
      assert.deepEqual(todo.items,[]);
      todo.addItem("give money");
      assert.deepEqual(todo.items,[{_item:"give money",_status:false}]);
    });
  });
  describe("updateDescription()",() => {
    it("updates the description of the todo",() => {
      const todo = new Todo("buy milk","go to shop");
      assert.equal(todo.title,"buy milk");
      todo.updateDescription("go to mall");
      assert.equal(todo.title,"buy milk");
      assert.equal(todo.description,"go to mall");
      assert.deepEqual(todo.items,[]);
    });
  });
  describe("markItemDone()",() => {
    it("sets the item status as done",() => {
      const todo = new Todo("buy milk","go to shop");
      assert.deepEqual(todo.items,[]);
      todo.addItem("give money");
      todo.markItemDone(0);
      assert.deepEqual(todo.getItem(0),{_item:"give money",_status:true});
    });
  });
  describe("markItemUndone()",() => {
    it("sets the item status as done",() => {
      const todo = new Todo("buy milk","go to shop");
      assert.deepEqual(todo.items,[]);
      todo.addItem("give money");
      todo.markItemDone(0);
      assert.deepEqual(todo.getItem(0),{_item:"give money",_status:true});
      todo.markItemUndone(0);
      assert.deepEqual(todo.getItem(0),{_item:"give money",_status:false});
    });
  });
});
