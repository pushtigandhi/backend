// import dotenv from 'dotenv'
// import {resolve} from 'path'

// // !!important: load env variables before importing App
// dotenv.config({ // If $NODE_ENV is production, then .env.production will be loaded, otherwise will load .env.development
//     path: resolve(__dirname, `../.env${process.env.NODE_ENV === 'production' ? '.production' : '.development'}`)
// });

// import App from './app';
// import { connectDatabase } from './db';

// const port = process.env.PORT || 3000; // If $PORT is not set, then 3000 will be used

// connectDatabase(process.env.MONGO_URI as string, process.env.MONGO_DB_NAME as string).then(() => {
//     const app_ = new App();
//     const os = require('os');

//     const interfaces = os.networkInterfaces();
//     const addresses = [];

//     for (const key in interfaces) {
//         for (const iface of interfaces[key]) {
//             if (iface.family === 'IPv4' && !iface.internal) {
//                 addresses.push(iface.address);
//             }
//         }
//     }

//     console.log('Server IP Address:', addresses);
//     app_.app.get('/', (req, res) => {
//       });

//     app_.app.listen(port, () => {
//         console.log(`Express server started on port ${port}`);
//     });
// });
import dotenv from 'dotenv'
import {resolve} from 'path'

// !!important: load env variables before importing App
dotenv.config({ // If $NODE_ENV is production, then .env.production will be loaded, otherwise will load .env.development
    path: resolve(__dirname, `../.env${process.env.NODE_ENV === 'production' ? '.production' : '.development'}`)
});

import App from './app';
import { connectDatabase } from './db';

const port = process.env.PORT || 3000; // If $PORT is not set, then 3000 will be used

connectDatabase(process.env.MONGO_URI as string, process.env.MONGO_DB_NAME as string).then(() => {
    const app_ = new App();

    app_.app.listen(port, () => {
        console.log(`Express server started on port ${port}`);
    });
});