import { expect } from "chai";
import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({
  path: resolve(__dirname, "../../.env.development"),
});

import request from "supertest";
import { before, beforeEach, after, describe, it } from 'mocha';

import App from "../app";
import User, { IUser } from "../models/users.model";
import Profile, { IProfile } from "../models/profile.model";
import { Item, IItem } from "../models/item.model";
import { Tag, ITag } from "../models/tag.model";
import Image from "../models/image.model";
import { HydratedDocument, Types } from "mongoose";

function testIDeql(id1: Types.ObjectId) {
  return (id2: Types.ObjectId | string) => {
    return id1.equals(id2);
  };
}

async function beforeEachSuite() {
  await User.deleteMany({});
  await Profile.deleteMany({});
  await Item.deleteMany({});
  await Image.deleteMany({});
}

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

  return await user.save(); // run pre-save hook
}

async function createTestProfile(
  user_id: Types.ObjectId
): Promise<HydratedDocument<IProfile>> {
  // create profile
  return await Profile.create({
    user: user_id,
    avatar: null,
    bio: "testbio",
    displayName: "test",
  });
}

async function loginTestUser(request: request.SuperTest<request.Test>) {
  const response = await request.post("/api/v0/auth/login").send({
    email: "test@example.com", // email is the email
    password: "test",
  });

  return response.headers["authorization"];
}

async function createTestItemWithBody(
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

async function createTestTag(
  name: string = "test"
): Promise<HydratedDocument<ITag>> {
  const testTag = await Tag.create({
    name: name,
  });

  return testTag;
}

describe("test item filters", async function () {
  this.timeout(2000);
  let app_: App;
  let testItem0: HydratedDocument<IItem>;
  let testItem1: HydratedDocument<IItem>;
  let testItem2: HydratedDocument<IItem>;
  let testUser: HydratedDocument<IUser>;
  let testTag0: HydratedDocument<ITag>;
  let testTag1: HydratedDocument<ITag>;

  const searchParams = new URLSearchParams();
  ["first", "second"].forEach(tag => searchParams.append("tags", tag));
  console.log(searchParams.toString());

  const newSearchParams = new URLSearchParams({
    startlt: new Date("2021-01-02").toString(),
  });

  //console.log(new Date("2021-01-02").toString());
  console.log(new Date(parseInt(newSearchParams["startlt"].getTime().toString())));

    await beforeEachSuite();
    app_ = new App();
    testUser = await createTestUser();
    testTag0: await createTestTag();
    testTag1: await createTestTag("different tag");
    await createTestProfile(testUser._id);
    testItem0 = await createTestItemWithBody(testUser._id, {
      title: "test0",
      category: "Backlog",
      description: "itemTest",
      startDate: new Date(),
      endDate: new Date(),
      priority: "LOW",
      tags: [testTag0._id.toString()],
    });
    testItem1 = await createTestItemWithBody(testUser._id, {
      title: "test1",
      category: "Backlog",
      description: "test_keyword",
      startDate: new Date(),
      endDate: new Date(),
      priority: "HIGH",
      tags: [testTag1._id.toString()],
    });
    testItem2 = await createTestItemWithBody(testUser._id, {
      title: "test2",
      category: "Backlog",
      description: "itemTest",
      startDate: new Date("2021-01-02"),
      endDate: new Date("2021-01-02"),
      duration: 20,
      priority: "LOW",
      tags: [testTag0._id.toString()],
    });

  
  it("should return a 200 and search with a keyword", async function () {
    const JWT = await loginTestUser(request.agent(app_.app));
    const newSearchParams = new URLSearchParams({
      search: "test_keyword",
    });
    const response = await request(app_.app)
      .get(`/api/v0/items?itemType=item&${newSearchParams.toString()}`)
      .set("authorization", JWT)
      .send();

    expect(response.status).to.equal(200);
    expect(response.type).to.equal("application/json");
    expect(response.body.items).to.be.an("array");
    expect(response.body.items).to.have.length(1);
    expect(response.body.items[0]._id).to.satisfy(
      testIDeql(testItem1._id)
    );
  });

  it("should return a 200 and filter with a priority", async function () {
    const JWT = await loginTestUser(request.agent(app_.app));
    const newSearchParams = new URLSearchParams({
      priority: "HIGH",
    });
    const response = await request(app_.app)
      .get(`/api/v0/items?${newSearchParams.toString()}`)
      .set("authorization", JWT)
      .send();

    expect(response.status).to.equal(200);
    expect(response.type).to.equal("application/json");
    expect(response.body.items).to.be.an("array");
    expect(response.body.items).to.have.length(1);
    expect(response.body.items[0]._id).to.satisfy(
      testIDeql(testItem1._id)
    );
  });

  it("should return a 200 and filter by less than a certain start date", async function () {
    const JWT = await loginTestUser(request.agent(app_.app));
    const newSearchParams = new URLSearchParams({
      startlt: new Date("2021-01-02").getTime().toString(),
    });
    const response = await request(app_.app)
      .get(`/api/v0/items?${newSearchParams.toString()}`)
      .set("authorization", JWT)
      .send();

    expect(response.status).to.equal(200);
    expect(response.type).to.equal("application/json");
    expect(response.body.items).to.be.an("array");
    expect(response.body.items).to.have.length(1);
    expect(response.body.items[0]._id).to.satisfy(
      testIDeql(testItem2._id)
    );
  });
  it("should return a 200 and filter by greater than a certain start date", async function () {
    const JWT = await loginTestUser(request.agent(app_.app));
    const newSearchParams = new URLSearchParams({
      startgt: new Date("2021-01-02").getTime().toString(),
    });
    const response = await request(app_.app)
      .get(`/api/v0/items?${newSearchParams.toString()}`)
      .set("authorization", JWT)
      .send();

    expect(response.status).to.equal(200);
    expect(response.type).to.equal("application/json");
    expect(response.body.items).to.be.an("array");
    expect(response.body.items).to.have.length(2);
    expect(response.body.items[0]._id).to.satisfy(
      testIDeql(testItem0._id)
    );
  });

  it("should return a 200 and filter by less than a certain end date", async function () {
    const JWT = await loginTestUser(request.agent(app_.app));
    const newSearchParams = new URLSearchParams({
      endlt: new Date("2021-01-02").getTime().toString(),
    });
    const response = await request(app_.app)
      .get(`/api/v0/items?${newSearchParams.toString()}`)
      .set("authorization", JWT)
      .send();

    expect(response.status).to.equal(200);
    expect(response.type).to.equal("application/json");
    expect(response.body.items).to.be.an("array");
    expect(response.body.items).to.have.length(1);
    expect(response.body.items[0]._id).to.satisfy(
      testIDeql(testItem2._id)
    );
  });
  it("should return a 200 and filter by greater than a certain end date", async function () {
    const JWT = await loginTestUser(request.agent(app_.app));
    const newSearchParams = new URLSearchParams({
      endgt: new Date("2021-01-02").getTime().toString(),
    });
    const response = await request(app_.app)
      .get(`/api/v0/items?${newSearchParams.toString()}`)
      .set("authorization", JWT)
      .send();

    expect(response.status).to.equal(200);
    expect(response.type).to.equal("application/json");
    expect(response.body.items).to.be.an("array");
    expect(response.body.items).to.have.length(2);
    expect(response.body.items[0]._id).to.satisfy(
      testIDeql(testItem0._id)
    );
  });
  
  // it("should return a 200 and filter by bounty less than a certain amount", async function () {
  //   const JWT = await loginTestUser(request.agent(app_.app));
  //   const newSearchParams = new URLSearchParams({
  //     bountylt: "15",
  //   });
  //   const response = await request(app_.app)
  //     .get(`/api/v0/items?${newSearchParams.toString()}`)
  //     .set("authorization", JWT)
  //     .send();

  //   expect(response.status).to.equal(200);
  //   expect(response.type).to.equal("application/json");
  //   expect(response.body.items).to.be.an("array");
  //   expect(response.body.items).to.have.length(2);
  //   expect(response.body.items[0]._id).to.satisfy(
  //     testIDeql(testItem0._id)
  //   );
  // });

  // it("should return a 200 and filter by bounty greater than a certain amount", async function () {
  //   const JWT = await loginTestUser(request.agent(app_.app));
  //   const newSearchParams = new URLSearchParams({
  //     bountygt: "15",
  //   });
  //   const response = await request(app_.app)
  //     .get(`/api/v0/items?${newSearchParams.toString()}`)
  //     .set("authorization", JWT)
  //     .send();

  //   expect(response.status).to.equal(200);
  //   expect(response.type).to.equal("application/json");
  //   expect(response.body.items).to.be.an("array");
  //   expect(response.body.items).to.have.length(1);
  //   expect(response.body.items[0]._id).to.satisfy(
  //     testIDeql(testItem2._id)
  //   );
  // });

  it("should return a 200 and filter by multiple parameters", async function () {
    const JWT = await loginTestUser(request.agent(app_.app));
    const newSearchParams = new URLSearchParams({
      search: "test",
      priority: "LOW",
      datelt: new Date("2021-01-02").getTime().toString(),
      durationgt: "15",
    });
    const response = await request(app_.app)
      .get(`/api/v0/items?${newSearchParams.toString()}`)
      .set("authorization", JWT)
      .send();

    expect(response.status).to.equal(200);
    expect(response.type).to.equal("application/json");
    expect(response.body.items).to.be.an("array");
    expect(response.body.items).to.have.length(1);
    expect(response.body.items[0]._id).to.satisfy(
      testIDeql(testItem2._id)
    );
  });

  it("should return a 200 and filter by tags", async function () {
    const JWT = await loginTestUser(request.agent(app_.app));
    const tagsIdArray: Types.ObjectId[] = [testTag0._id];

    const newSearchParams = new URLSearchParams({
      tags: testTag0._id.toString(),
    });
    const response = await request(app_.app)
      .get(`/api/v0/items?${newSearchParams.toString()}`)
      .set("authorization", JWT)
      .send();

    expect(response.status).to.equal(200);
    expect(response.type).to.equal("application/json");
    expect(response.body.items).to.be.an("array");
    expect(response.body.items).to.have.length(2);
    expect(response.body.items[0]._id).to.satisfy(
      testIDeql(testItem0._id)
    );
  });
});