// this file contains the index for the /api/v0 routes
// you can import routers here and mount them to this router
// the base path is /api/v0
import { Router } from "express";

import itemsRoute from "./items.route";


export default class v0Route {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log("mounting items...!");

    const itemsRouter_ = new itemsRoute();
    this.router.use("/items", itemsRouter_.router);
  }
}