// this file contains the index for the /api/v0 routes
// you can import routers here and mount them to this router
// the base path is /api/v0
import { Router } from "express";

import itemsRoute from "./items.route";
import usersRoute from "./users.route";
import profileRoute from "./profile.route";
import authRoute from "./auth.route";
import contactsRoute from "./contacts.route";
import tagsRoute from "./tags.route";

export default class v0Route {
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const itemsRouter_ = new itemsRoute();
    const usersRouter_ = new usersRoute();
    const profileRouter_ = new profileRoute();
    const authRouter_ = new authRoute();
    const contactsRoute_ = new contactsRoute();
    const tagsRoute_ = new tagsRoute();
    this.router.use("/items", itemsRouter_.router);
    this.router.use("/users", usersRouter_.router);
    this.router.use("/profile", profileRouter_.router);
    this.router.use("/auth", authRouter_.router);
    this.router.use("/contacts", contactsRoute_.router);
    this.router.use("/tags", tagsRoute_.router);
  }
}