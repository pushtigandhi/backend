import User, {IUser} from "../models/users.model";
import Profile from "../models/profile.model";
import { HydratedDocument } from "mongoose";
import crypto from "crypto";
import EmailService from "./email.service";
import jwt from "jsonwebtoken";


interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
}
export default class AuthService {
    public users_model = User;
    public profile_model = Profile;

    private generateJWT(user: HydratedDocument<IUser>): string {
        // generate a new JWT
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: process.env.JWT_MAX_AGE || "30d" }
        );
        return token;
    }

    public async login(email: string, password: string): Promise<LoginResponse> {
        const user: HydratedDocument<IUser> | null = await User.findOne({
            email: email,
        });
        if (!user) {
            return { success: false, message: "User not found" };
        } else {
            const isValid = await user.validatePassword(password);
            if (isValid) {
                if (!user.emailVerification.isVerified) {
                    return { message: "Email is not yet verified.", success: false };
                }
                
                return { 
                    success: true,
                    token: this.generateJWT(user),
                };
            }
            return { success: false, message: "Incorrect email or password." }; 
        }
    }

    private async generateNewToken(): Promise<string> {
        // generate a new token for email verification
        const token = crypto.randomBytes(32).toString("hex"); // generate 32 random bytes
        return token;
    }

    public async signup(email: string, password: string, handle: string): Promise<HydratedDocument<IUser>> {
        const newUser = new this.users_model({
            email,
            password,
            emailVerification: {
                isVerified: false,
                token: {
                    value: await this.generateNewToken(),
                    expiresAt: new Date(Date.now() + parseInt(process.env.EMAIL_TOKEN_AGE || "2160000")), // 6 hours default
                },
            },
            handle,
        });
        let user;
        try{
            user = await newUser.save();

        }
        catch (err) {
            console.log(err);
        }
        return user;
    }

    public async requestNewEmailToken(email: string, emailService: EmailService): Promise<boolean | null> {
        // requests a new email token for a user
        // returns true if the token was updated, false if there was an error, and null if the user doesn't exist or is already verified

        const user = await this.users_model.findOne({ email: email });
        if (!user) {
            return null;
        } else {
            if (user.emailVerification.isVerified) {
                return null;
            } else {
                user.emailVerification.token.value = await this.generateNewToken();
                user.emailVerification.token.expiresAt = new Date(Date.now() + parseInt(process.env.EMAIL_TOKEN_AGE || "2160000")); // extend the token age
                await user.save();

                const sentEmail = await emailService.sendVerificationEmail(user.email, user.emailVerification.token.value);

                return sentEmail;
            }
        }
        
    }
}
