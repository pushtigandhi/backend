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

import { Item, IItem, Task, ITask, Event, IEvent } from "../models/item.model";

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
}

after(async function () {
  //console.log("request disconnect");
  await disconnectDatabase();
  await mongod.stop(); // stop the in-memory database
});

//#endregion

//#region Helper Functions

async function createDefaultItem(): Promise<HydratedDocument<IItem>> {
  let item;
  item = new Item({
     title: "Test Empty Item"
  });
  item.save();
  return item;
}

async function createTaskItem(): Promise<HydratedDocument<ITask>> {
  let task;
  task = new Task({
     title: "Test Empty Task"
  });
  task.save();
  return task;
}

async function createEventItem(): Promise<HydratedDocument<IEvent>> {
  let event;
  event = new Event({
     title: "Test Empty Event"
  });
  event.save();
  return event;
}

//#endregion

//#region Inialization

describe('get default items', function () {
  this.timeout(2000);
  let app_: App;
  let testItem: mongoose.HydratedDocument<IItem>;
  let testTask: mongoose.HydratedDocument<ITask>;
  let testEvent: mongoose.HydratedDocument<IEvent>;

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
    testTask = await createTaskItem();

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
    testEvent = await createEventItem();

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

});

//#endregion

//#region Test Cases

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

describe('add new task item', async function () {
  this.timeout(2000);
  let app_: App;
  let testItem: mongoose.HydratedDocument<ITask>;

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

//#endregion


