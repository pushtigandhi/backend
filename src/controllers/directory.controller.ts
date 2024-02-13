import { Request, Response } from "express";
import ProfileService from "../services/profile.service";

export default class DirectoryController {
    public profileService = new ProfileService();

    public getCategories = async (req: Request, res: Response) => {
        const profile =  await this.profileService.getProfileById(req.params.id);

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.status(201).json(profile.directory);
    }
    
    public addCategory = async (req: Request, res: Response) => {
        let newCategory = req.body;

        const profile =  await this.profileService.getProfileById(req.params.id);
        
        if (!profile) {
            return res.status(500).json({
              error: 'Profile not found',
            });
        }

        profile.directory.push(newCategory);
        await profile.save();
        
        res.status(201).json(profile.directory);
    }

    public deleteCategory = async (req: Request, res: Response) => {
        const { deletedId } = req.body;

        const profile =  await this.profileService.getProfileById(req.params.id);
        
        if (!profile) {
            return res.status(500).json({
              error: 'Profile not found',
            });
        }

        const index = profile.directory.findIndex(cat => cat["_id"].toString() === deletedId);
        if (index === -1) {
            return res.status(500).json({ 
                error: 'Category not found in directory'
            });
        }

        profile.directory.splice(index, 1);
        await profile.save();

        res.status(201).json(profile.directory);
    }

    public editCategory = async (req: Request, res: Response) => {
        const { updatedId } = req.body;

        const profile =  await this.profileService.getProfileById(req.params.id);
        
        if (!profile) {
            return res.status(500).json({
              error: 'Profile not found',
            });
        }

        try {

            const index = profile.directory.findIndex(cat => cat["_id"].toString() === updatedId);
            if (index === -1) {
                return res.status(500).json({ 
                    error: 'Category not found in directory.'
                });
            }

            if(!!req.body.title) {
                profile.directory[index].title = req.body.title;
                await profile.save();
            }

            if(!!req.body.sections) {
                profile.directory[index].sections = req.body.sections;
                await profile.save();
            }

            res.status(201).json({
                message: "Successfully updated",
                directory: profile.directory,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error",
            });
        }
    }
}