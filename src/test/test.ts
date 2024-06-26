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

import { before, beforeEach, after, describe, it } from 'mocha';

import { Item, IItem, Task, ITask, Event, IEvent,
  Page, IPage, Recipe, IRecipe } from "../models/item.model";

import User, { IUser } from "../models/users.model";
import Profile, { IProfile } from "../models/profile.model";
import Contact, { IContact } from "../models/contacts.model";

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
  await User.deleteMany({});
}

after(async function () {
  //console.log("request disconnect");
  await disconnectDatabase();
  await mongod.stop(); // stop the in-memory database
});

//#endregion

//#region Helper Functions

async function createTestUser(
  email: string = "test@example.com"
): Promise<HydratedDocument<IUser>> {
  const user = new User({
    email: email,
    password: "test",
    emailVerification: {
      isVerified: true,
      token: {
        value: "test",
        expiresAt: new Date(),
      },
    },
  });
  return await user.save();
}

async function createTestProfile(
  user_id: Types.ObjectId
): Promise<HydratedDocument<IProfile>> {
  // create profile
  const user = await User.findOne({ _id: user_id })
  return await Profile.create({
    user: user_id,
    avatarImage: null,
    bio: "testbio",
    displayName: "test",
    emailInfo: {
      isVerified: true,
      email: user!.email, // should not be null user
    }
  });
}

async function loginTestUser(request: request.SuperTest<request.Test>) {
  const response = await request.post("/api/v0/auth/login").send({
    email: "test@example.com",
    password: "test",
  });
  return response.headers["authorization"];
}

async function createItem(
  user_id: Types.ObjectId,
  item: any
): Promise<HydratedDocument<IItem>> {
  const testProfile = await Profile.findOne({ user: user_id });
  expect(testProfile).to.not.be.null;
  const testItem = await Item.create({
    ...item,
    poster: testProfile!._id,
  });

  return testItem;
}
async function createTask(): Promise<HydratedDocument<ITask>> {
  const task = new Task({
     title: "Test Empty Task"
  });
  task.save();
  return task;
}

async function createEvent(): Promise<HydratedDocument<IEvent>> {
  const event = new Event({
     title: "Test Empty Event"
  });
  event.save();
  return event;
}

async function createPage(): Promise<HydratedDocument<IPage>> {
  const page = new Page({
     title: "Test Empty Page"
  });
  page.save();
  return page;
}

async function createRecipe(): Promise<HydratedDocument<IRecipe>> {
  const recipe = new Recipe({
     title: "Test Empty Recipe"
  });
  recipe.save();
  return recipe;
}

async function createContact(): Promise<HydratedDocument<IContact>> {
  const contact = new Contact({
     name: "Test"
  });
  contact.save();
  return contact;
}
//#endregion

// //#region User Test Cases

// describe("get all users", async function () {
//   this.timeout(1000);
//   let app_: App;
//   let testUser: mongoose.HydratedDocument<IUser>;

//   before(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//     testUser = await createTestUser();
//   });

//   it("should return a 200 and a list of existing users", async function () {
//     const users = await request(app_.app).get("/api/v0/users");

//     expect(users.status).to.equal(200);
//     expect(users.type).to.equal("application/json");
//     expect(users.body.users).to.be.an("array");
//     expect(users.body.users[0]).to.be.an("object");
//     expect(users.body.users[0].email).to.equal("testuser@example.com");
//   });

//   it("should not return the password", async function () {
//     const users = await request(app_.app).get("/api/v0/users");
//     expect(users.status).to.equal(200);
//     expect(users.type).to.equal("application/json");
//     expect(users.body.users).to.be.an("array");
//     expect(users.body.users[0]).to.be.an("object");
//     expect(users.body.users[0]).to.not.have.property("password");
//   });

//   it("should not return the email token", async function () {
//     const all_users = await request(app_.app).get("/api/v0/users");
//     expect(all_users.status).to.equal(200);
//     expect(all_users.type).to.equal("application/json");
//     expect(all_users.body.users).to.be.an("array");
//     expect(all_users.body.users[0]).to.be.an("object");
//     expect(all_users.body.users[0]).to.not.have.property(
//       "emailVerification"
//     );
//   });
// });

// describe("get logged in user", async function () {
//   this.timeout(2000);
//   let app_: App;
//   let testUser: mongoose.HydratedDocument<IUser>;

//   before(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//     testUser = await createTestUser();
//   });

//   it("login route should be ok on success", async function () {
//     const response = await request(app_.app).post("/api/v0/auth/login").send({
//       email: "testuser@example.com",
//       password: "test",
//     });

//     expect(response.status).to.equal(200);
//   });

//   it("login route success should return JWT in header", async function () {
//     const response = await request(app_.app).post("/api/v0/auth/login").send({
//       email: "testuser@example.com",
//       password: "test",
//     });

//     expect(response.status).to.equal(200);
//     expect(response.headers["authorization"]).to.be.a("string");
//     expect(response.headers["authorization"]).to.include("JWT"); // JWT is the token type
//   });

//   it("login route should 401 on failure", async function () {
//     const response = await request(app_.app).post("/api/v0/auth/login").send({
//       email: "testuser@example.com",
//       password: "WRONGPASSWORD",
//     });

//     expect(response.status).to.equal(401); // unauthorized
//   });

//   it("login route failure should NOT return JWT in header", async function () {
//     const response = await request(app_.app).post("/api/v0/auth/login").send({
//       email: "testuser@example.com",
//       password: "WRONGPASSWORD",
//     });

//     expect(response.headers).to.not.have.property("authorization"); // no JWT header
//   });

//   it("login route should failure on wrong credentials", async function () {
//     const response = await request(app_.app).post("/api/v0/auth/login").send({
//       email: "testuser@example.com",
//       password: "WRONGPASSWORD",
//     });

//     expect(response.status).to.not.be.equal(200); // failure
//   });

//   it("should return a 200 for a logged-in user", async function () {
//     const JWT = await loginTestUser(request(app_.app));
//     console.log("JWT ==> "+ JWT);

//     const user = await request(app_.app)
//       .get("/api/v0/users/me")
//       .set("authorization", JWT);

//     expect(user.status).to.equal(200);
//     expect(user.type).to.equal("application/json");
//     expect(user.body.user).to.be.an("object");
//     expect(user.body.user).to.have.property("email", "testuser@example.com");
//   });

//   it("should not return the password field", async function () {
//     const JWT = await loginTestUser(request(app_.app));

//     const users = await request(app_.app)
//       .get("/api/v0/users/me")
//       .set("authorization", JWT);

//     expect(users.status).to.equal(200);
//     expect(users.type).to.equal("application/json");
//     expect(users.body.user).to.be.an("object");
//     expect(users.body.user).to.not.have.property("password");
//   });

//   it("should not return 200 for a user that wasn't logged-in", async function () {
//     const users = await request(app_.app).get("/api/v0/users/me");

//     expect(users.status).to.equal(401); // unauthorized
//   });

//   it("should not return 200 for a user that didn't pass JWT", async function () {
//     const JWT = await loginTestUser(request(app_.app));

//     // don't send the JWT
//     const users = await request(app_.app)
//       .get("/api/v0/users/me")
//     //.set("authorization", `JWT ${JWT}`);

//     expect(users.status).to.equal(401); // unauthorized
//   });
// });

// describe("create user", function () {
//   this.timeout(2000);
//   let app_: App;

//   beforeEach(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//   });

//   it("should return a 201 and the created user", async function () {
//     const user = await request(app_.app).post("/api/v0/auth").send({
//       email: "testuser@example.com",
//       password: "test",
//     });

//     expect(user.status).to.equal(201);
//     expect(user.type).to.equal("application/json");
//     expect(user.body.user).to.be.an("object");
//     expect(user.body.user).to.have.property("email", "testuser@example.com");
//     expect(user.body.user).to.not.have.property("password");

//     // should have meesage about email verification
//     expect(user.body.message).to.be.a("string");
//     expect(user.body.message).to.include("verify").and.include("email");
//   });

//   it("should return a 409 for a user with an existing email", async function () {
//     const user = await request(app_.app).post("/api/v0/auth").send({
//       email: "testuser@example.com", // same email as above
//       password: "test",
//     });

//     expect(user.status).to.equal(201);

//     const duplicateEmailUser = await request(app_.app)
//       .post("/api/v0/auth")
//       .send({
//         email: "testuser@example.com", // same email as above
//         password: "test",
//       });

//     expect(duplicateEmailUser.status).to.equal(409); // user already exists
//     expect(duplicateEmailUser.type).to.equal("application/json");
//     expect(duplicateEmailUser.body.message).to.be.a("string");
//     expect(duplicateEmailUser.body.message)
//       .to.include("email")
//       .and.include("already");
//   });

//   it("should return a 400 if email is missing", async function () {
//     const response = await request(app_.app).post("/api/v0/auth").send({
//       password: "test",
//     });

//     expect(response.status).to.equal(400);
//     expect(response.type).to.equal("application/json");
//     expect(response.body).to.have.property("message");
//     expect(response.body.message).to.include("email");
//   });

//   it("should return a 400 if password is missing", async function () {
//     const response = await request(app_.app).post("/api/v0/auth").send({
//       email: "testuser@example.com",
//     });

//     expect(response.status).to.equal(400);
//     expect(response.type).to.equal("application/json");
//     expect(response.body).to.have.property("message");
//     expect(response.body.message).to.include("password");
//   });

//   it("should not login before email is verified", async function () {
//     const user = await request(app_.app).post("/api/v0/auth").send({
//       email: "testuser@example.com", 
//       password: "test",
//     });

//     expect(user.status).to.equal(201);

//     const login = await request(app_.app).post("/api/v0/auth/login").send({
//       email: "testuser@example.com",
//       password: "test",
//     });

//     expect(login.status).to.equal(401); // unauthorized
//   });

//   it("should be able to login after email is verified", async function () {
//     const user = await request(app_.app).post("/api/v0/auth").send({
//       email: "testuser@example.com",
//       password: "test",
//     });

//     expect(user.status).to.equal(201);

//     // verify email with token
//     const verify = await request(app_.app).get(
//       "/api/v0/auth/verify?email=testuser@example.com&token=faketokendoesntmatter"
//     ); // all tokens are valid for testing
//     expect(verify.status).to.equal(204); // success

//     const login = await request(app_.app).post("/api/v0/auth/login").send({
//       email: "testuser@example.com",
//       password: "test",
//     });

//     expect(login.status).to.equal(200); // success
//     // expect JWT in header
//     expect(login.headers["authorization"]).to.be.a("string");
//     expect(login.headers["authorization"]).to.include("JWT"); // JWT is the token type
//   });
// });
// //#endregion

// //#region Item Inialization

// describe('get default items', function () {
//   this.timeout(2000);
//   let app_: App;
//   let testItem: mongoose.HydratedDocument<IItem>;
//   let testTask: mongoose.HydratedDocument<ITask>;
//   let testEvent: mongoose.HydratedDocument<IEvent>;
//   let testPage: mongoose.HydratedDocument<IPage>;
//   let testRecipe: mongoose.HydratedDocument<IRecipe>;

//   before(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//   })

//   //items

//   it("should return 201 if no existing items", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/items/?itemType=item");

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.items).to.be.empty;
//   });

//   it('should return a default empty item', async function () {
//     testItem = await createItem();

//     expect(testItem).to.have.property("title", "Test Empty Item");
//   })

//   it("should return a 201 and list of existing items", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/items/?itemType=item");

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.items).to.be.an("array"); 
//     expect(response.body.items[0]).to.be.an("object");
//   });

//   //tasks

//   it("should return 201 if no existing tasks", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/items/?itemType=task");

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.items).to.be.empty;
//   });
  
//   it('should return an empty task', async function () {
//     testTask = await createTask();

//     expect(testTask).to.have.property("title", "Test Empty Task");
//   })

//   it("should return a 201 and list of existing tasks", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/items/?itemType=task");
    
//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.items).to.be.an("array"); 
//     expect(response.body.items[0]).to.be.an("object");
//   });

//   // //events 

//   it("should return 201 if no existing events", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/items/?itemType=event");

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.items).to.be.empty;
//   });

//   it('should return an empty event', async function () {
//     testEvent = await createEvent();

//     expect(testEvent).to.have.property("title", "Test Empty Event");
//   })

//   it("should return a 201 and list of existing events", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/items/?itemType=event");
    
//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.items).to.be.an("array"); 
//     expect(response.body.items[0]).to.be.an("object");
//   });

//   // //pages

//   it("should return 201 if no existing pages", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/items/?itemType=page");

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.items).to.be.empty;
//   });

//   it('should return an empty page', async function () {
//     testPage = await createPage();

//     expect(testPage).to.have.property("title", "Test Empty Page");
//   })

//   it("should return a 201 and list of existing pages", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/items/?itemType=page");
    
//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.items).to.be.an("array"); 
//     expect(response.body.items[0]).to.be.an("object");
//   });

//   // //recipes

//   it("should return 201 if no existing recipes", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/items/?itemType=recipe");

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.items).to.be.empty;
//   });

//   it('should return an empty page', async function () {
//     testRecipe = await createRecipe();

//     expect(testRecipe).to.have.property("title", "Test Empty Recipe");
//   })

//   it("should return a 201 and list of existing recipes", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/items/?itemType=recipe");
    
//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.items).to.be.an("array"); 
//     expect(response.body.items[0]).to.be.an("object");
//   });

// });

// //#endregion

//#region Item Test Cases

describe('add new default item', async function () {
  this.timeout(2000);
  let app_: App;
  let testUser: HydratedDocument<IUser>;
  let testItem: mongoose.HydratedDocument<IItem>;

  beforeEach(async function () {
    await beforeEachSuite();
    testUser = await createTestUser();
    await createTestProfile(testUser._id);
    // testItem = await createItem(testUser._id, {
    //   title: "test0",
    //   category: "Backlog",
    //   description: "itemTest",
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   priority: "LOW",
    // });
    app_ = new App();
  })

  //POSITIVE cases

  it("should return a 201 and the new item object", async function () {
    const JWT = await loginTestUser(request.agent(app_.app));
    const response = await request(app_.app)
      .post("/api/v0/items/?itemType=item")
      .set("authorization", JWT)
      .send({
        title: "test empty",
        poster: testUser._id,
      });
    
      expect(response.status).to.equal(201);
      expect(response.type).to.equal("application/json");
      expect(response.body).to.have.property("item");
      expect(response.body.item).to.have.property("title", "test empty");
  });

  // it("should return a 200 and the item by ID", async function () {
  //   testItem = await createItem(testUser._id, {
  //     title: "Test Empty Item",
  //     category: "Backlog",
  //   });
  //   const response = await request(app_.app)
  //     .get(`/api/v0/items/${testItem._id}?itemType=item`)
  //     .send();
    
  //     expect(response.status).to.equal(200);
  //     expect(response.type).to.equal("application/json");
  //     expect(response.body).to.have.property("item");
  //     expect(response.body.item).to.have.property("title", "Test Empty Item");
  // });

  // NEGATIVE cases 

  // it("should return a 400 if title is missing", async function () {
  //   //console.log("creating new!");
  //   const response = await request(app_.app)
  //     .post("/api/v0/items/?itemType=item")
  //     .send({});
    
  //     expect(response.status).to.equal(400);
  //     expect(response.type).to.equal("application/json");
  // });
  
});

// describe("delete existing item", async function () {
//   this.timeout(1000);
//   let app_: App;
//   let testItem: HydratedDocument<IItem>;

//   before(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//     testItem = await createItem();
//   });

//   it("should return a 200 and the item object", async function () {
//     await request(app_.app)
//       .delete(`/api/v0/items/${testItem._id}?itemType=item`)
//       .send();
      
//     const items = await request(app_.app).get("/api/v0/items/?itemType=item").send();

//     expect(items.status).to.equal(201);
//     expect(items.type).to.equal("application/json");
//     expect(items.body.items).to.be.an("array");
//     expect(
//       (items.body.items as Array<HydratedDocument<IItem>>).some(
//         (item) => item._id === testItem._id
//       )
//     ).to.be.false;
//   });

//   it("should not be returned if deleted", async function () {
//     const response = await request(app_.app)
//       .delete(`/api/v0/items/${testItem._id}?itemType=item`)
//       .send();

//     expect(response.status).to.equal(500);
//     expect(response.type).to.equal("application/json");
    
//   });

// });

// describe('edit existing item', async function () {
//   this.timeout(1000);
//   let app_: App
//   let testItem: HydratedDocument<IItem>;

//   before(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//     testItem = await createItem();
//   });

//   it("should be able to edit modifiable fields", async function () {
//     const response = await request.agent(app_.app)
//       .patch(`/api/v0/items/${testItem._id}?itemType=item`)
//       .send({
//           description: "test item",
//           tags: [{
//             name: "Default"
//           }]
//       });

//     expect(response.status).to.equal(200);

//     const updatedItem = await request(app_.app).get(
//       `/api/v0/items/${testItem._id}?itemType=item`
//     );
//     expect(updatedItem.status).to.equal(200);
//     expect(updatedItem.type).to.equal("application/json");
//     expect(updatedItem.body.item).to.have.property(
//       "description",
//       "test item"
//     );

//   });
  
// //   // it("should not be able to edit nonmodifiable fields", async function () {
// //     //Add Test
// //   // });

// //   // it("should only be able to edit modifiable fields", async function () {
// //     //Add test
// //   // });

// });

//#endregion

// //#region Task Test Cases

// describe('add new task item', async function () {
//   this.timeout(2000);
//   let app_: App;

//   before(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//   })

//   //POSITIVE cases

//   it("should return a 201 and the new task object", async function () {
//     const response = await request(app_.app)
//       .post("/api/v0/items/?itemType=task")
//       .send({
//         title: "test empty task",

//       });

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body).to.have.property("item");
//     expect(response.body.item).to.have.property("title", "test empty task");
//   });

//   // NEGATIVE cases 
  
//   it("should return a 400 if title is missing", async function () {
//     const response = await request(app_.app)
//       .post("/api/v0/items/?itemType=task")
//       .send({});
  
//     expect(response.status).to.equal(400);
//     expect(response.type).to.equal("application/json");
//   });
  
// });

// describe("delete existing task", async function () {
//   this.timeout(1000);
//   let app_: App;
//   let testTask: HydratedDocument<ITask>;

//   before(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//     testTask = await createTask();
//   });

//   it("should return a 200 and the task object", async function () {
//     await request(app_.app)
//       .delete(`/api/v0/items/${testTask._id}?itemType=task`)
//       .send();
      
//     const tasks = await request(app_.app).get("/api/v0/items/?itemType=task").send();

//     expect(tasks.status).to.equal(201);
//     expect(tasks.type).to.equal("application/json");
//     expect(tasks.body.items).to.be.an("array");
//     expect(
//       (tasks.body.items as Array<HydratedDocument<ITask>>).some(
//         (item) => item._id === testTask._id
//       )
//     ).to.be.false;
//   });

//   it("should not be returned if deleted", async function () {
//     const response = await request(app_.app)
//       .delete(`/api/v0/items/${testTask._id}?itemType=task`)
//       .send();

//     expect(response.status).to.equal(500);
//     expect(response.type).to.equal("application/json");
    
//   });

// });

// describe('edit existing task', async function () {
//   this.timeout(1000);
//   let app_: App
//   let testTask: HydratedDocument<ITask>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//       testTask = await createTask();
//   });

//   it("should be able to edit modifiable fields", async function () {
//       const response = await request.agent(app_.app)
//           .patch(`/api/v0/items/${testTask._id}?itemType=task`)
//           .send({
//               description: "test task",
//               tags: [{
//                   name: "Default"
//               }]
//           });

//       expect(response.status).to.equal(200);

//       const updatedEvent = await request(app_.app).get(
//           `/api/v0/items/${testTask._id}?itemType=task`
//       );
//       expect(updatedEvent.status).to.equal(200);
//       expect(updatedEvent.type).to.equal("application/json");
//       expect(updatedEvent.body.item).to.have.property(
//           "description",
//           "test task"
//       );
//   });
// });

// //#endregion

// //#region Event Test Cases

// describe('add new default event', async function () {
//   this.timeout(2000);
//   let app_: App;
//   let testEvent: mongoose.HydratedDocument<IEvent>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//   })

//   //POSITIVE cases

//   it("should return a 201 and the new event object", async function () {
//       const response = await request(app_.app)
//           .post("/api/v0/items/?itemType=event")
//           .send({
//               title: "test empty",
//           });

//       expect(response.status).to.equal(201);
//       expect(response.type).to.equal("application/json");
//       expect(response.body).to.have.property("item");
//       expect(response.body.item).to.have.property("title", "test empty");
//   });

//   it("should return a 200 and the event by ID", async function () {
//       testEvent = await createEvent();
//       const response = await request(app_.app)
//           .get(`/api/v0/items/${testEvent._id}?itemType=event`)
//           .send();

//       expect(response.status).to.equal(200);
//       expect(response.type).to.equal("application/json");
//       expect(response.body).to.have.property("item");
//       expect(response.body.item).to.have.property("title", "Test Empty Event");
//   });

//   // NEGATIVE cases

//   it("should return a 400 if title is missing", async function () {
//       const response = await request(app_.app)
//           .post("/api/v0/items/?itemType=event")
//           .send({});

//       expect(response.status).to.equal(400);
//       expect(response.type).to.equal("application/json");
//   });
// });

// describe("delete existing event", async function () {
//   this.timeout(1000);
//   let app_: App;
//   let testEvent: HydratedDocument<IEvent>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//       testEvent = await createEvent();
//   });

//   it("should return a 200 and the event object", async function () {
//       await request(app_.app)
//           .delete(`/api/v0/items/${testEvent._id}?itemType=event`)
//           .send();

//       const events = await request(app_.app).get("/api/v0/items/?itemType=event").send();

//       expect(events.status).to.equal(201);
//       expect(events.type).to.equal("application/json");
//       expect(events.body.items).to.be.an("array");
//       expect(
//           (events.body.items as Array<HydratedDocument<IEvent>>).some(
//               (item) => item._id === testEvent._id
//           )
//       ).to.be.false;
//   });

//   it("should not be returned if deleted", async function () {
//       const response = await request(app_.app)
//           .delete(`/api/v0/items/${testEvent._id}?itemType=event"`)
//           .send();

//       expect(response.status).to.equal(500);
//       expect(response.type).to.equal("application/json");
//   });
// });

// describe('edit existing event', async function () {
//   this.timeout(1000);
//   let app_: App
//   let testEvent: HydratedDocument<IEvent>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//       testEvent = await createEvent();
//   });

//   it("should be able to edit modifiable fields", async function () {
//       const response = await request.agent(app_.app)
//           .patch(`/api/v0/items/${testEvent._id}?itemType=event`)
//           .send({
//               description: "test event",
//               tags: [{
//                   name: "Default"
//               }]
//           });

//       expect(response.status).to.equal(200);

//       const updatedEvent = await request(app_.app).get(
//           `/api/v0/items/${testEvent._id}?itemType=event`
//       );
//       expect(updatedEvent.status).to.equal(200);
//       expect(updatedEvent.type).to.equal("application/json");
//       expect(updatedEvent.body.item).to.have.property(
//           "description",
//           "test event"
//       );
//   });
// });

// //#endregion

// //#region Page Test Cases

// describe('add new page item', async function () {
//   this.timeout(2000);
//   let app_: App;
//   let testPage: mongoose.HydratedDocument<IPage>;

//   before(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//   })

//   //POSITIVE cases

//   it("should return a 201 and the new page object", async function () {
//     const response = await request(app_.app)
//       .post("/api/v0/items/?itemType=page")
//       .send({
//         title: "test empty page",

//       });

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body).to.have.property("item");
//     expect(response.body.item).to.have.property("title", "test empty page");
//   });

//   // NEGATIVE cases 
  
//   it("should return a 400 if title is missing", async function () {
//     const response = await request(app_.app)
//       .post("/api/v0/items/?itemType=page")
//       .send({});
  
//     expect(response.status).to.equal(400);
//     expect(response.type).to.equal("application/json");
//   });
  
// });

// describe("delete existing page", async function () {
//   this.timeout(1000);
//   let app_: App;
//   let testPage: HydratedDocument<IPage>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//       testPage = await createPage();
//   });

//   it("should return a 200 and the page object", async function () {
//       await request(app_.app)
//           .delete(`/api/v0/items/${testPage._id}?itemType=page`)
//           .send();
          
//       const pages = await request(app_.app).get("/api/v0/items/?itemType=page").send();

//       expect(pages.status).to.equal(201);
//       expect(pages.type).to.equal("application/json");
//       expect(pages.body.items).to.be.an("array");
//       expect(
//           (pages.body.items as Array<HydratedDocument<IPage>>).some(
//               (item) => item._id === testPage._id
//           )
//       ).to.be.false;
//   });

//   it("should not be returned if deleted", async function () {
//       const response = await request(app_.app)
//           .delete(`/api/v0/items/${testPage._id}?itemType=page`)
//           .send();

//       expect(response.status).to.equal(500);
//       expect(response.type).to.equal("application/json");
//   });
// });

// describe('edit existing page', async function () {
//   this.timeout(1000);
//   let app_: App;
//   let testPage: HydratedDocument<IPage>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//       testPage = await createPage();
//   });

//   it("should be able to edit modifiable fields", async function () {
//       const response = await request.agent(app_.app)
//           .patch(`/api/v0/items/${testPage._id}?itemType=page`)
//           .send({
//               description: "test page",
//               tags: [{
//                   name: "Default"
//               }]
//           });

//       expect(response.status).to.equal(200);

//       const updatedPage = await request(app_.app).get(
//           `/api/v0/items/${testPage._id}?itemType=page`
//       );
//       expect(updatedPage.status).to.equal(200);
//       expect(updatedPage.type).to.equal("application/json");
//       expect(updatedPage.body.item).to.have.property(
//           "description",
//           "test page"
//       );
//   });
// });

// //#endregion

// //#region Recipe Test Cases

// describe('add new default recipe', async function () {
//   this.timeout(2000);
//   let app_: App;
//   let testRecipe: mongoose.HydratedDocument<IRecipe>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//   })

//   // POSITIVE cases

//   it("should return a 201 and the new recipe object", async function () {
//       const response = await request(app_.app)
//           .post("/api/v0/items/?itemType=recipe")
//           .send({
//               title: "test empty",
//           });

//       expect(response.status).to.equal(201);
//       expect(response.type).to.equal("application/json");
//       expect(response.body).to.have.property("item");
//       expect(response.body.item).to.have.property("title", "test empty");
//   });

//   it("should return a 200 and the recipe by ID", async function () {
//       testRecipe = await createRecipe();
//       const response = await request(app_.app)
//           .get(`/api/v0/items/${testRecipe._id}?itemType=recipe`)
//           .send();

//       expect(response.status).to.equal(200);
//       expect(response.type).to.equal("application/json");
//       expect(response.body).to.have.property("item");
//       expect(response.body.item).to.have.property("title", "Test Empty Recipe");
//   });

//   // NEGATIVE cases

//   it("should return a 400 if title is missing", async function () {
//       const response = await request(app_.app)
//           .post("/api/v0/items/?itemType=recipe")
//           .send({});

//       expect(response.status).to.equal(400);
//       expect(response.type).to.equal("application/json");
//   });
// });

// describe("delete existing recipe", async function () {
//   this.timeout(1000);
//   let app_: App;
//   let testRecipe: HydratedDocument<IRecipe>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//       testRecipe = await createRecipe();
//   });

//   it("should return a 200 and the recipe object", async function () {
//       await request(app_.app)
//           .delete(`/api/v0/items/${testRecipe._id}?itemType=recipe`)
//           .send();

//       const recipes = await request(app_.app).get("/api/v0/items/?itemType=recipe").send();

//       expect(recipes.status).to.equal(201);
//       expect(recipes.type).to.equal("application/json");
//       expect(recipes.body.items).to.be.an("array");
//       expect(
//           (recipes.body.items as Array<HydratedDocument<IRecipe>>).some(
//               (item) => item._id === testRecipe._id
//           )
//       ).to.be.false;
//   });

//   it("should not be returned if deleted", async function () {
//       const response = await request(app_.app)
//           .delete(`/api/v0/items/${testRecipe._id}?itemType=recipe`)
//           .send();

//       expect(response.status).to.equal(500);
//       expect(response.type).to.equal("application/json");
//   });
// });

// describe('edit existing recipe', async function () {
//   this.timeout(1000);
//   let app_: App
//   let testRecipe: HydratedDocument<IRecipe>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//       testRecipe = await createRecipe();
//   });

//   it("should be able to edit modifiable fields", async function () {
//       const response = await request.agent(app_.app)
//           .patch(`/api/v0/items/${testRecipe._id}?itemType=recipe`)
//           .send({
//               description: "test recipe",
//               tags: [{
//                   name: "Default"
//               }]
//           });

//       expect(response.status).to.equal(200);

//       const updatedRecipe = await request(app_.app).get(
//           `/api/v0/items/${testRecipe._id}?itemType=recipe`
//       );
//       expect(updatedRecipe.status).to.equal(200);
//       expect(updatedRecipe.type).to.equal("application/json");
//       expect(updatedRecipe.body.item).to.have.property(
//           "description",
//           "test recipe"
//       );
//   });
// });

// //#endregion

// //#region Contactcard Test Cases

// describe('get default contact', function () {
//   this.timeout(2000);
//   let app_: App;
//   let testContact: mongoose.HydratedDocument<IContact>;

//   before(async function () {
//     await beforeEachSuite();
//     app_ = new App();
//   })

//   it("should return 201 if no existing contacts", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/contacts/");

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.contacts).to.be.empty;
//   });

//   it('should return a default empty contact', async function () {
//     testContact = await createContact();

//     expect(testContact).to.have.property("name", "Test");
//   })

//   it("should return a 201 and list of existing contacts", async function () {
//     const response = await request(app_.app)
//       .get("/api/v0/contacts/");

//     expect(response.status).to.equal(201);
//     expect(response.type).to.equal("application/json");
//     expect(response.body.contacts).to.be.an("array"); 
//     expect(response.body.contacts[0]).to.be.an("object");
//   });
// });

// describe('add new default contact', async function () {
//   this.timeout(2000);
//   let app_: App;
//   let testContact: mongoose.HydratedDocument<IContact>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//   })

//   // POSITIVE cases

//   it("should return a 201 and the new contact object", async function () {
//       const response = await request(app_.app)
//           .post("/api/v0/contacts/")
//           .send({
//               name: "Test",
//           });

//       expect(response.status).to.equal(201);
//       expect(response.type).to.equal("application/json");
//       expect(response.body).to.have.property("contact");
//       expect(response.body.contact).to.have.property("name", "Test");
//   });

//   it("should return a 200 and the contact by ID", async function () {
//       testContact = await createContact();
//       const response = await request(app_.app)
//           .get(`/api/v0/contacts/${testContact._id}`)
//           .send();

//       expect(response.status).to.equal(200);
//       expect(response.type).to.equal("application/json");
//       expect(response.body).to.have.property("contact");
//       expect(response.body.contact).to.have.property("name", "Test");
//   });

//   // NEGATIVE cases

//   it("should return a 400 if name is missing", async function () {
//       const response = await request(app_.app)
//           .post("/api/v0/contacts/")
//           .send({});

//       expect(response.status).to.equal(400);
//       expect(response.type).to.equal("application/json");
//   });
// });

// describe("delete existing contact", async function () {
//   this.timeout(1000);
//   let app_: App;
//   let testContact: HydratedDocument<IContact>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//       testContact = await createContact();
//   });

//   it("should return a 200 and the contact object", async function () {
//       await request(app_.app)
//           .delete(`/api/v0/contacts/${testContact._id}`)
//           .send();

//       const contacts = await request(app_.app).get("/api/v0/contacts/").send();

//       expect(contacts.status).to.equal(201);
//       expect(contacts.type).to.equal("application/json");
//       expect(contacts.body.contacts).to.be.an("array");
//       expect(
//           (contacts.body.contacts as Array<HydratedDocument<IContact>>).some(
//               (contact) => contact._id === testContact._id
//           )
//       ).to.be.false;
//   });

//   it("should not be returned if deleted", async function () {
//       const response = await request(app_.app)
//           .delete(`/api/v0/contacts/${testContact._id}`)
//           .send();

//       expect(response.status).to.equal(500);
//       expect(response.type).to.equal("application/json");
//   });
// });

// describe('edit existing contact', async function () {
//   this.timeout(1000);
//   let app_: App
//   let testContact: HydratedDocument<IContact>;

//   before(async function () {
//       await beforeEachSuite();
//       app_ = new App();
//       testContact = await createContact();
//   });

//   it("should be able to edit modifiable fields", async function () {
//       const response = await request.agent(app_.app)
//           .patch(`/api/v0/contacts/${testContact._id}`)
//           .send({
//               notes: "test contact"
//           });

//       expect(response.status).to.equal(200);

//       const updatedContact = await request(app_.app).get(
//           `/api/v0/contacts/${testContact._id}`
//       );
//       expect(updatedContact.status).to.equal(200);
//       expect(updatedContact.type).to.equal("application/json");
//       expect(updatedContact.body.contact).to.have.property(
//           "notes",
//           "test contact"
//       );
//   });
// });

// //#endregion

