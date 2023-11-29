//#region Imports

import { expect } from "chai";
import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({
  path: resolve(__dirname, "../../.env.development"),
});

import request from "supertest";

import { connectDatabase, disconnectDatabase } from "../db";
import { MongoMemoryServer } from "mongodb-memory-server";

import App from "../app";
import mongoose, { HydratedDocument, Types } from "mongoose";

import { before, after, describe, it } from 'mocha';

import { Item, IItem, Task, ITask, Event, IEvent,
  Page, IPage, Recipe, IRecipe } from "../models/item.model";

//#endregion

//#region Setup

let mongod: MongoMemoryServer;

before(async function () {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  connectDatabase(uri, "test"); // Connect to the in-memory database
});

async function beforeEachSuite() {
  //console.log("clearing existing data....");
  await Item.deleteMany({});
  await Task.deleteMany({});
  await Event.deleteMany({});
  await Page.deleteMany({});
}

after(async function () {
  //console.log("request disconnect");
  await disconnectDatabase();
  await mongod.stop(); // stop the in-memory database
});

//#endregion

//#region Helper Functions

async function createDefaultItem(): Promise<HydratedDocument<IItem>> {
  const item = new Item({
     title: "Test Empty Item"
  });
  item.save();
  return item;
}

async function createDefaultTask(): Promise<HydratedDocument<ITask>> {
  const task = new Task({
     title: "Test Empty Task"
  });
  task.save();
  return task;
}

async function createDefaultEvent(): Promise<HydratedDocument<IEvent>> {
  const event = new Event({
     title: "Test Empty Event"
  });
  event.save();
  return event;
}

async function createDefaultPage(): Promise<HydratedDocument<IPage>> {
  const page = new Page({
     title: "Test Empty Page"
  });
  page.save();
  return page;
}

async function createDefaultRecipe(): Promise<HydratedDocument<IRecipe>> {
  const recipe = new Recipe({
     title: "Test Empty Recipe"
  });
  recipe.save();
  return recipe;
}
//#endregion

//#region Inialization

describe('get default items', function () {
  this.timeout(2000);
  let app_: App;
  let testItem: mongoose.HydratedDocument<IItem>;
  let testTask: mongoose.HydratedDocument<ITask>;
  let testEvent: mongoose.HydratedDocument<IEvent>;
  let testPage: mongoose.HydratedDocument<IPage>;
  let testRecipe: mongoose.HydratedDocument<IRecipe>;

  before(async function () {
    await beforeEachSuite();
    app_ = new App();
  })

  //items

  it("should return 201 if no existing items", async function () {
    const response = await request(app_.app)
      .get("/api/v0/items/");

    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body.items).to.be.empty;
  });

  it('should return a default empty item', async function () {
    testItem = await createDefaultItem();

    expect(testItem).to.have.property("title", "Test Empty Item");
  })

  it("should return a 201 and list of existing items", async function () {
    const response = await request(app_.app)
      .get("/api/v0/items/");

    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body.items).to.be.an("array"); 
    expect(response.body.items[0]).to.be.an("object");
  });

  //tasks

  it("should return 201 if no existing tasks", async function () {
    const response = await request(app_.app)
      .get("/api/v0/tasks/");

    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body.tasks).to.be.empty;
  });
  
  it('should return an empty task', async function () {
    testTask = await createDefaultTask();

    expect(testTask).to.have.property("title", "Test Empty Task");
  })

  it("should return a 201 and list of existing tasks", async function () {
    const response = await request(app_.app)
      .get("/api/v0/tasks/");
    
    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body.tasks).to.be.an("array"); 
    expect(response.body.tasks[0]).to.be.an("object");
  });

  //events 

  it("should return 201 if no existing events", async function () {
    const response = await request(app_.app)
      .get("/api/v0/events/");

    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body.events).to.be.empty;
  });

  it('should return an empty event', async function () {
    testEvent = await createDefaultEvent();

    expect(testEvent).to.have.property("title", "Test Empty Event");
  })

  it("should return a 201 and list of existing events", async function () {
    const response = await request(app_.app)
      .get("/api/v0/events/");
    
    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body.events).to.be.an("array"); 
    expect(response.body.events[0]).to.be.an("object");
  });

  //pages

  it("should return 201 if no existing events", async function () {
    const response = await request(app_.app)
      .get("/api/v0/pages/");

    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body.pages).to.be.empty;
  });

  it('should return an empty page', async function () {
    testPage = await createDefaultPage();

    expect(testPage).to.have.property("title", "Test Empty Page");
  })

  it("should return a 201 and list of existing pages", async function () {
    const response = await request(app_.app)
      .get("/api/v0/pages/");
    
    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body.pages).to.be.an("array"); 
    expect(response.body.pages[0]).to.be.an("object");
  });

  //recipes

  it("should return 201 if no existing recipes", async function () {
    const response = await request(app_.app)
      .get("/api/v0/recipes/");

    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body.recipes).to.be.empty;
  });

  it('should return an empty page', async function () {
    testRecipe = await createDefaultRecipe();

    expect(testRecipe).to.have.property("title", "Test Empty Recipe");
  })

  it("should return a 201 and list of existing recipes", async function () {
    const response = await request(app_.app)
      .get("/api/v0/recipes/");
    
    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body.recipes).to.be.an("array"); 
    expect(response.body.recipes[0]).to.be.an("object");
  });

});

//#endregion

//#region Item Test Cases

describe('add new default item', async function () {
  this.timeout(2000);
  let app_: App;
  let testItem: mongoose.HydratedDocument<IItem>;

  before(async function () {
    await beforeEachSuite();
    app_ = new App();
  })

  //POSITIVE cases

  it("should return a 201 and the new item object", async function () {
    //console.log("creating new!");
    const response = await request(app_.app)
      .post("/api/v0/items/")
      .send({
        title: "test empty",

      });
    
      expect(response.status).to.equal(201);
      expect(response.type).to.equal("application/json");
      expect(response.body).to.have.property("item");
      expect(response.body.item).to.have.property("title", "test empty");
  });

  it("should return a 200 and the item by ID", async function () {
    testItem = await createDefaultItem();
    const response = await request(app_.app)
      .get(`/api/v0/items/${testItem._id}`)
      .send();
    
      expect(response.status).to.equal(200);
      expect(response.type).to.equal("application/json");
      expect(response.body).to.have.property("item");
      expect(response.body.item).to.have.property("title", "Test Empty Item");
  });

  // NEGATIVE cases 

  it("should return a 400 if title is missing", async function () {
    //console.log("creating new!");
    const response = await request(app_.app)
      .post("/api/v0/items/")
      .send({});
    
      expect(response.status).to.equal(400);
      expect(response.type).to.equal("application/json");
  });
  
});

describe("delete existing item", async function () {
  this.timeout(1000);
  let app_: App;
  let testItem: HydratedDocument<IItem>;

  before(async function () {
    await beforeEachSuite();
    app_ = new App();
    testItem = await createDefaultItem();
  });

  it("should return a 200 and the item object", async function () {
    await request(app_.app)
      .delete(`/api/v0/items/${testItem._id}`)
      .send();
      
    const items = await request(app_.app).get("/api/v0/items/").send();

    expect(items.status).to.equal(201);
    expect(items.type).to.equal("application/json");
    expect(items.body.items).to.be.an("array");
    expect(
      (items.body.items as Array<HydratedDocument<IItem>>).some(
        (item) => item._id === testItem._id
      )
    ).to.be.false;
  });

  it("should not be returned if deleted", async function () {
    const response = await request(app_.app)
      .delete(`/api/v0/items/${testItem._id}`)
      .send();

    expect(response.status).to.equal(500);
    expect(response.type).to.equal("application/json");
    
  });

});

describe('edit existing item', async function () {
  this.timeout(1000);
  let app_: App
  let testItem: HydratedDocument<IItem>;

  before(async function () {
    await beforeEachSuite();
    app_ = new App();
    testItem = await createDefaultItem();
  });

  it("should be able to edit modifiable fields", async function () {
    const response = await request.agent(app_.app)
      .patch(`/api/v0/items/${testItem._id}`)
      .send({
          description: "test item",
          tags: [{
            name: "Default"
          }]
      });

    expect(response.status).to.equal(200);

    const updatedItem = await request(app_.app).get(
      `/api/v0/items/${testItem._id}`
    );
    expect(updatedItem.status).to.equal(200);
    expect(updatedItem.type).to.equal("application/json");
    expect(updatedItem.body.item).to.have.property(
      "description",
      "test item"
    );

  });
  
//   // it("should not be able to edit nonmodifiable fields", async function () {
//     //Add Test
//   // });

//   // it("should only be able to edit modifiable fields", async function () {
//     //Add test
//   // });

});

//#endregion

//#region Task Test Cases

describe('add new task item', async function () {
  this.timeout(2000);
  let app_: App;

  before(async function () {
    await beforeEachSuite();
    app_ = new App();
  })

  //POSITIVE cases

  it("should return a 201 and the new task object", async function () {
    const response = await request(app_.app)
      .post("/api/v0/tasks/")
      .send({
        title: "test empty task",

      });

    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body).to.have.property("task");
    expect(response.body.task).to.have.property("title", "test empty task");
  });

  // NEGATIVE cases 
  
  it("should return a 400 if title is missing", async function () {
    const response = await request(app_.app)
      .post("/api/v0/tasks/")
      .send({});
  
    expect(response.status).to.equal(400);
    expect(response.type).to.equal("application/json");
  });
  
});

describe("delete existing task", async function () {
  this.timeout(1000);
  let app_: App;
  let testTask: HydratedDocument<ITask>;

  before(async function () {
    await beforeEachSuite();
    app_ = new App();
    testTask = await createDefaultTask();
  });

  it("should return a 200 and the task object", async function () {
    await request(app_.app)
      .delete(`/api/v0/tasks/${testTask._id}`)
      .send();
      
    const tasks = await request(app_.app).get("/api/v0/tasks/").send();

    expect(tasks.status).to.equal(201);
    expect(tasks.type).to.equal("application/json");
    expect(tasks.body.tasks).to.be.an("array");
    expect(
      (tasks.body.tasks as Array<HydratedDocument<ITask>>).some(
        (task) => task._id === testTask._id
      )
    ).to.be.false;
  });

  it("should not be returned if deleted", async function () {
    const response = await request(app_.app)
      .delete(`/api/v0/tasks/${testTask._id}`)
      .send();

    expect(response.status).to.equal(500);
    expect(response.type).to.equal("application/json");
    
  });

});


describe('edit existing task', async function () {
  this.timeout(1000);
  let app_: App
  let testItem: HydratedDocument<IItem>;

  before(async function () {
    await beforeEachSuite();
    app_ = new App();
    testItem = await createDefaultTask();
  });

  it("should be able to edit modifiable fields", async function () {
    const response = await request.agent(app_.app)
      .patch(`/api/v0/tasks/${testItem._id}`)
      .send({
          description: "test task",
          tags: [{
            "name" : "Default"
          }]
      });

    expect(response.status).to.equal(200);

    const updatedTask = await request(app_.app).get(
      `/api/v0/tasks/${testItem._id}`
    );
    expect(updatedTask.status).to.equal(200);
    expect(updatedTask.type).to.equal("application/json");
    expect(updatedTask.body.task).to.have.property(
      "description",
      "test task"
    );
  });
  
  // it("should not be able to edit nonmodifiable fields", async function () {
    //Add Test
  // });

  // it("should only be able to edit modifiable fields", async function () {
    //Add test
  // });
  
});

//#endregion

//#region Event Test Cases

describe('add new event item', async function () {
  this.timeout(2000);
  let app_: App;
  let testEvent: mongoose.HydratedDocument<IEvent>;

  before(async function () {
    await beforeEachSuite();
    app_ = new App();
  })

  //POSITIVE cases

  it("should return a 201 and the new event object", async function () {
    const response = await request(app_.app)
      .post("/api/v0/events/")
      .send({
        title: "test empty event",

      });

    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body).to.have.property("event");
    expect(response.body.event).to.have.property("title", "test empty event");
  });

  // NEGATIVE cases 
  
  it("should return a 400 if title is missing", async function () {
    const response = await request(app_.app)
      .post("/api/v0/events/")
      .send({});
  
    expect(response.status).to.equal(400);
    expect(response.type).to.equal("application/json");
  });
  
});

// GET Functions
describe('delete existing event', async function () {
  this.timeout(1000);
  let app_: App;
  let testEvent: HydratedDocument<IEvent>;

  before(async function () {
      await beforeEachSuite();
      app_ = new App();
      testEvent = await createDefaultEvent();
  });

  it("should return a 200 and the event object", async function () {
      await request(app_.app)
          .delete(`/api/v0/events/${testEvent._id}`)
          .send();

      const events = await request(app_.app).get("/api/v0/events/").send();

      expect(events.status).to.equal(201);
      expect(events.type).to.equal("application/json");
      expect(events.body.events).to.be.an("array");
      expect(
          (events.body.events as Array<HydratedDocument<IEvent>>).some(
              (event) => event._id === testEvent._id
          )
      ).to.be.false;
  });

  it("should not be returned if deleted", async function () {
      const response = await request(app_.app)
          .delete(`/api/v0/events/${testEvent._id}`)
          .send();

      expect(response.status).to.equal(500);
      expect(response.type).to.equal("application/json");
  });

});

// PATCH Functions
describe('edit existing event', async function () {
  this.timeout(1000);
  let app_: App;
  let testEvent: HydratedDocument<IEvent>;

  before(async function () {
      await beforeEachSuite();
      app_ = new App();
      testEvent = await createDefaultEvent();
  });

  it("should be able to edit modifiable fields", async function () {
      const response = await request.agent(app_.app)
          .patch(`/api/v0/events/${testEvent._id}`)
          .send({
              description: "test event",
              tags: [{
                  name: "eventChanged"
              }]
          });

      expect(response.status).to.equal(200);

      const updatedEvent = await request(app_.app).get(
          `/api/v0/events/${testEvent._id}`
      );
      expect(updatedEvent.status).to.equal(200);
      expect(updatedEvent.type).to.equal("application/json");
      expect(updatedEvent.body.event).to.have.property(
          "description",
          "test event"
      );
  });

  // Additional tests can be added here for other scenarios.

});

//#endregion

//#region Page Test Cases

describe('add new page item', async function () {
  this.timeout(2000);
  let app_: App;
  let testPage: mongoose.HydratedDocument<IPage>;

  before(async function () {
    await beforeEachSuite();
    app_ = new App();
  })

  //POSITIVE cases

  it("should return a 201 and the new page object", async function () {
    const response = await request(app_.app)
      .post("/api/v0/pages/")
      .send({
        title: "test empty page",

      });

    expect(response.status).to.equal(201);
    expect(response.type).to.equal("application/json");
    expect(response.body).to.have.property("page");
    expect(response.body.page).to.have.property("title", "test empty page");
  });

  // NEGATIVE cases 
  
  it("should return a 400 if title is missing", async function () {
    const response = await request(app_.app)
      .post("/api/v0/pages/")
      .send({});
  
    expect(response.status).to.equal(400);
    expect(response.type).to.equal("application/json");
  });
  
});

describe("delete existing page", async function () {
  this.timeout(1000);
  let app_: App;
  let testPage: HydratedDocument<IPage>;

  before(async function () {
      await beforeEachSuite();
      app_ = new App();
      testPage = await createDefaultPage();
  });

  it("should return a 200 and the page object", async function () {
      await request(app_.app)
          .delete(`/api/v0/pages/${testPage._id}`)
          .send();
          
      const pages = await request(app_.app).get("/api/v0/pages/").send();

      expect(pages.status).to.equal(201);
      expect(pages.type).to.equal("application/json");
      expect(pages.body.pages).to.be.an("array");
      expect(
          (pages.body.pages as Array<HydratedDocument<IPage>>).some(
              (page) => page._id === testPage._id
          )
      ).to.be.false;
  });

  it("should not be returned if deleted", async function () {
      const response = await request(app_.app)
          .delete(`/api/v0/pages/${testPage._id}`)
          .send();

      expect(response.status).to.equal(500);
      expect(response.type).to.equal("application/json");
  });
});

describe('edit existing page', async function () {
  this.timeout(1000);
  let app_: App;
  let testPage: HydratedDocument<IPage>;

  before(async function () {
      await beforeEachSuite();
      app_ = new App();
      testPage = await createDefaultPage();
  });

  it("should be able to edit modifiable fields", async function () {
      const response = await request.agent(app_.app)
          .patch(`/api/v0/pages/${testPage._id}`)
          .send({
              description: "test page",
              tags: [{
                  name: "Default"
              }]
          });

      expect(response.status).to.equal(200);

      const updatedPage = await request(app_.app).get(
          `/api/v0/pages/${testPage._id}`
      );
      expect(updatedPage.status).to.equal(200);
      expect(updatedPage.type).to.equal("application/json");
      expect(updatedPage.body.page).to.have.property(
          "description",
          "test page"
      );
  });
});

//#endregion

// //#region Recipe Test Cases

// describe('add new recipe item', async function () {
//   this.timeout(2000);
//   let app_: App;
//   let testRecipe: mongoose.HydratedDocument<IPage>;

//   before(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//   })

//   //POSITIVE cases

//   it("should return a 201 and the new recipe object", async function () {
//     const response = await request(app_.app)
//       .post("/api/v0/recipes/")
//       .send({
//         title: "test empty recipe",

//       });

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body).to.have.property("recipe");
//     expect(response.body.recipe).to.have.property("title", "test empty recipe");
//   });

//   // NEGATIVE cases 
  
//   it("should return a 400 if title is missing", async function () {
//     const response = await request(app_.app)
//       .post("/api/v0/recipes/")
//       .send({});
  
//     expect(response.status).to.equal(400);
//     expect(response.type).to.equal("application/json");
//   });
  
// });

// function beforeEach(arg0: () => Promise<void>) {
//   throw new Error("Function not implemented.");
// }
// //#endregion


