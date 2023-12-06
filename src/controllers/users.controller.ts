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
            const user = req.user; //await this.userService.getUserById(req.user); // req.user is set by passport in middleware
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }
            res.status(200).json({
                user: req.authInfo
            });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                message: "Server error",
            });
        }
    }

    public createTestUser = async (req: Request, res: Response) => {
        try {
            
            const user = await this.userService.createTestUser(); // req.user is set by passport in middleware
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