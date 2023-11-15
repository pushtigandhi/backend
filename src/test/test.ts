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

import Item, { IItem } from "../models/item.model";



let mongod: MongoMemoryServer;

before(async function () {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  connectDatabase(uri, "test"); // Connect to the in-memory database
});

async function beforeEachSuite() {
  console.log("clearing existing data....");
  await Item.deleteMany({});
}


/*

START Helper Functions

*/

async function createTestItem(): Promise<HydratedDocument<IItem>> {
  let item;
  try {
    item = new Item({
      title: "Test Empty Item"
    });
  }catch (error) {
    console.log("something went wrong....");
    console.log(error);
  }
  
  console.log("saving item....");
  item.save()
    .then(() => {
        console.log('Generic Item saved successfully');
    })
    .catch((error) => {
        console.error(error);
    });
  
  console.log("new item title: ");
  console.log(item.title);
  return item;
}


/*

  END Helper Functions
 
*/

/*
  
  START Test Cases

*/

describe('Create Test Data', function () {
  this.timeout(2000);
  let app_: App;
  let testItem: mongoose.HydratedDocument<IItem>;

    it('should return a default empty item', async function () {
      //const response = await request(app_.app)

      testItem = await createTestItem();
      
      console.log("new item title: ");
      console.log(testItem.title);

      // console.log("Item title: ");
      // console.log(testItem.title);
      expect(testItem).to.have.property("title", "Test Empty Item");

      // expect(testItem).to.have.property("title", "createdAt");
      // expect(testItem.title).to.equal("Test Empty Item");
    })

});

// describe('add new item', async function () {
//   this.timeout(5000);
//   let app_: App;
//   let testItem: mongoose.HydratedDocument<IItem>;

//   before(async function () {
//     //await beforeEachSuite();
//     app_ = new App();
//   })

//   it("should return a 201 and the new item object", async function () {
//     console.log("creating new!");
//     const response = await request(app_.app)
//       .post("/api/v0/items/")
//       .send({
//         title: "test empty",

//       });
    
//       expect(response.status).to.equal(201);
//       expect(response.type).to.equal("application/json");
//       expect(response.body).to.have.property("item");
//       expect(response.body.item).to.have.property("title", "test empty");
//   });
  
// });

/*
  
  END Test Cases

*/


after(async function () {
  console.log("request disconnect");
  await disconnectDatabase();
  await mongod.stop(); // stop the in-memory database
});