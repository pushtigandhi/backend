import { Request, Response } from 'express';
import userService from '../services/users.service';

export default class UsersController {
    public userService = new userService();

    public getUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getUsers();
            res.status(200).json({users});
        } catch (error) {
            console.error(error);
            res.status(500).json({error});
        }
    }

    public getMe = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.getUserById(req.user!["_id"]); // req.user is set by passport in middleware
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }
            res.status(200).json({
                user: {
                    _id: user._id,
                    email: user.email
                }
            });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
            });
        }
    }

    public getUserByHandle = async (req: Request, res: Response) => {
        const { userHandle } = req.query;
        
        try {
            const user = await this.userService.getUserByHandle(userHandle.toString());
            res.status(200).json({user});
        } catch (error) {
            console.error(error);
            res.status(500).json({error});
        }
    }


    //to delete (all below)
    public createTestUser = async (req: Request, res: Response) => {
        try {
            
            const user = await this.userService.createTestUser();
            if (!user) {
                return res.status(404).json({error: 'User not created'});
            }
            res.status(200).json({
                user: {
                    _id: user._id,
                    email: user.email
                }
            });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
            });
        }
    }
    
    public createTestProfile = async (req: Request, res: Response) => {
        try {
            const email = req.body.id;
            const user = await this.userService.createTestProfile(email); // req.user is set by passport in middleware
            if (!user) {
                return res.status(404).json({error: 'User not created'});
            }
            res.status(200).json({
                user: {
                    _id: user._id,
                    displayName: user.displayName
                }
            });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
            });
        }
    }

    public clearUsers = async (req: Request, res: Response) => {
        try {
            await this.userService.clearUsers();
            const users = await this.userService.getUsers();
            res.status(200).json({users});
        } catch (error) {
            console.error(error);
            res.status(500).json({error});
        }
    }
}