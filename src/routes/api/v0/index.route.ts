// this file contains the index for the /api/v0 routes
// you can import routers here and mount them to this router
// the base path is /api/v0
import { Router } from "express";

import itemsRoute from "./items.route";
import tasksRoute from "./tasks.route";
import eventsRoute from "./events.route";
import pagesRoute from "./pages.route";
import recipesRoute from "./recipes.route";

export default class v0Route {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const itemsRouter_ = new itemsRoute();
    const tasksRouter_ = new tasksRoute();
    const eventsRouter_ = new eventsRoute();
    const pagesRouter_ = new pagesRoute();
    const recipesRouter_ = new recipesRoute();
    this.router.use("/items", itemsRouter_.router);
    this.router.use("/tasks", tasksRouter_.router);
    this.router.use("/events", eventsRouter_.router);
    this.router.use("/pages", pagesRouter_.router);
    this.router.use("/recipes", recipesRouter_.router);
  }
}