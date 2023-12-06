import User, { IUser } from "../models/users.model";
import { HydratedDocument } from "mongoose";

export default class UserService {
  public users_model = User;

  public async getUsers(): Promise<Array<HydratedDocument<IUser>>> {
    const users = await this.users_model.find({}, { _id: 1, email: 1 });
    return users;
  }

  // public async getUserById(
  //   user: HydratedDocument<IUser>,
  // ): Promise<HydratedDocument<IUser> | null> {
  //   console.log("id: " + id);
  //   const user = await this.users_model.findById(id);
  //   console.log("getByiD: " + user);
  //   return user as HydratedDocument<IUser> | null;
  // }

  public async createTestUser(
    email: string = "pushti@example.com"
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

  public async clearUsers() {
    await User.deleteMany({});
  }

}