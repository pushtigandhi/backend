import { Router } from "express";
import Route from "@interfaces/route.interface";
import apiRoute from "./api/route";

export default class IndexRoute implements Route {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const apiRoute_ = new apiRoute();
    this.router.use("/api", apiRoute_.router); // mount the api router to /api
    this.router.all("*", (req, res) => {
      res.status(404).json({
        error: "Route not found",
      });
    }); 
  }
}