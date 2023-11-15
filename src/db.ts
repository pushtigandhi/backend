import * as mongoose from 'mongoose';
export async function connectDatabase(mongo_uri: string, db_name: string): Promise<void> {

    try {
        await mongoose.connect(mongo_uri, {
            dbName: db_name,
        });
        console.log('Connected to database');
    } catch (err) {
        console.log('Connection error');
        console.log(err);
        process.exit(1);
    }
}

export async function disconnectDatabase(): Promise<void> {
    console.log(
        "Disconnected database!"
    );
    await mongoose.disconnect();
    
}