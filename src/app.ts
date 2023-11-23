import express from 'express';
import indexRoute from './routes/router';

export default class App {
    public app: express.Application;
    
    constructor() {
        const cors = require('cors');
        this.app = express();
        this.app.use(cors());
        
        this.useMiddleware().then(() => {
            this.mountRoutes();
        });

        // console.log(
        //     "constructing app"
        // );
    }

    private mountRoutes(): void {
        const indexRoute_ = new indexRoute();
        this.app.use('/', indexRoute_.router); 
    }

    private async useMiddleware(): Promise<void> {
        this.app.use(express.json());
    }
}