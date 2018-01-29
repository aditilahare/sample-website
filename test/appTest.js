const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const app = require('../app.js');
const Fs = require('./fs.js');
let contents = require('./contents.js').dummyData();

const getSessionId = function(res){
  return res['headers']['set-cookie'][0].split("=")[1].split(";")[0];
}

describe('app',()=>{
  beforeEach(function(){
    let fs = new Fs(contents);
    app.fs = fs;
  })
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app)
        .get('/bad')
        .expect(404)
        .end(done)
    })
  })
  describe('GET /',()=>{
    it('redirects to login',done=>{
      request(app)
        .get('/')
        .expect(302)
        .end(done)
    })
  })
  describe('POST /login',()=>{
    it('redirects to home for valid user',done=>{
      request(app)
        .post('/login')
        .send({name:"Aditi",password:"1"})
        .expect(302)
        .expect('Location','/home')
        .end(done);
    })
    it('redirects to login for invalid user',done=>{
      request(app)
        .post('/login')
        .send({name:"Aditi",password:"2"})
        .expect(302)
        .expect('Location','/login')
        .end(done);
    })
  })

  describe('GET /login',()=>{
    it('it should show the login page',done=>{
      request(app)
        .get('/login')
        .expect(200,done)
    })
  })
  describe('GET /home',()=>{
    it('if not logged in, should redirect to login page',done=>{
      request(app)
        .get('/home')
        .expect(302)
        .expect('Location','/login')
        .end(done);
    })
  })
})


describe('app',()=>{
  let sessionid;
  beforeEach(function(done){
    let fs = new Fs(contents);
    app.fs = fs;
    request(app)
      .post('/login')
      .send({name:"Aditi",password:"1"})
      .expect(res=>{
        sessionid=getSessionId(res);
      })
      .end(done)
  })
  describe('GET /',()=>{
    it('if logged in,redirects to home',done=>{
      request(app)
        .get('/')
        .set('Cookie',`sessionid=${sessionid}`)
        .expect(302)
        .expect('location','/home')
        .end(done);
    })
  })
  describe('GET /login',()=>{
    it('if logged in,redirects to home',done=>{
      request(app)
        .get('/login')
        .set('Cookie',`sessionid=${sessionid}`)
        .expect(302)
        .expect('location','/home')
        .end(done);
    })
  })
  describe('POST /logout',()=>{
    it('redirects to login page',done=>{
      request(app)
        .post('/logout')
        .set('Cookie',`sessionid=${sessionid}`)
        .expect(302)
        .expect('Location','/login')
        .end(done);
    })
  })
  describe('POST /onDataRequest if logged in and',()=>{
    it('title and description are empty should return user todos in response body',done=>{
      request(app)
        .post('/onDataRequest')
        .send({title:'',description:''})
        .set('Cookie',`sessionid=${sessionid}`)
        .expect((res)=>{
          assert.deepEqual(JSON.parse(res.text),contents['Aditi']['_todos']);
        })
        .end(done);
    })
    it('title and description are not empty should return user todos including new todo in response body',done=>{
      request(app)
        .post('/onDataRequest')
        .send({title:'buy',description:'milk'})
        .set('Cookie',`sessionid=${sessionid}`)
        .expect((res)=>{
          contents['Aditi']['_todos'].push({_title:'buy',_description:'milk',_items:[]});
          assert.deepEqual(JSON.parse(res.text),contents['Aditi']['_todos']);
          contents['Aditi']['_todos'].pop();
        })
        .end(done);
    })
  })
  describe('POST /onDelete if logged in',()=>{
    it('deletes the todo given its index',done=>{
      contents['Aditi']['_todos'].push({_title:'buy',_description:'milk',_items:[]});
      let fs = new Fs(contents);
      app.fs = fs;
      request(app)
        .post('/onDelete')
        .send({id:1})
        .set('Cookie',`sessionid=${sessionid}`)
        .expect((res)=>{
          contents['Aditi']['_todos'].pop();
          assert.deepEqual(JSON.parse(res.text),contents['Aditi']['_todos']);
        })
        .end(done);
    })
  })
  describe('POST /deleteItem if logged in',()=>{
    it('deletes the item given todo index and item index',done=>{
      contents['Aditi']['_todos'][0]['_items'].push({_item:'go',_status:false});
      let fs = new Fs(contents);
      app.fs = fs;
      request(app)
        .post('/deleteItem')
        .send({todoIndex:0,itemIndex:2})
        .set('Cookie',`sessionid=${sessionid}`)
        .expect((res)=>{
          contents['Aditi']['_todos'][0]['_items'].pop();
          assert.deepEqual(JSON.parse(res.text),contents['Aditi']['_todos'][0]['_items']);
        })
        .end(done);
    })
  })
  describe('POST /addItem if logged in',()=>{
    it('adds item given todo index and item',done=>{
      request(app)
        .post('/addItem')
        .send({item:'hey',index:0})
        .set('Cookie',`sessionid=${sessionid}`)
        .expect((res)=>{
          contents['Aditi']['_todos'][0]['_items'].push('hey');
          assert.deepEqual(JSON.parse(res.text),contents['Aditi']['_todos'][0]['_items']);
          contents['Aditi']['_todos'][0]['_items'].pop();
        })
        .end(done);
    })
    it('does not add item if item is empty',done=>{
      request(app)
        .post('/addItem')
        .send({item:'',index:0})
        .set('Cookie',`sessionid=${sessionid}`)
        .expect((res)=>{
          assert.deepEqual(JSON.parse(res.text),contents['Aditi']['_todos'][0]['_items']);
        })
        .end(done);
    })
  })
})
