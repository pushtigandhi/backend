import User, { IUser } from "../models/users.model";
import Profile, { IProfile } from "../models/profile.model";
import mongoose, { HydratedDocument, Types } from "mongoose";

interface ICondition {
  handle: {$regex: string, $options: mongoose.RegexOptions};
}

export default class UserService {
  public users_model = User;
  
  public async getUsers(): Promise<Array<HydratedDocument<IUser>>> {
    const users = await this.users_model.find({}, { _id: 1, email: 1 });
    return users;
  }

  public async getUserById(
    id: string
  ): Promise<HydratedDocument<IUser> | null> {
    const user = await this.users_model.findById(id); // find user by id
    return user as HydratedDocument<IUser> | null;
  }
  
  public async getUserByHandle(
    userHandle: string
  ): Promise<HydratedDocument<IUser> | null> {
    let condition: ICondition = {
      handle: {
        $regex: userHandle,
        $options: "i"
      }
    };
    const user = await this.users_model.find(condition); // find user by id
    return user as unknown as HydratedDocument<IUser> | null;
  }

  /// delete all the below later
  public async createTestUser(
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
  
  public async createTestProfile(
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

  public async clearUsers() {
    await User.deleteMany({});
  }

}