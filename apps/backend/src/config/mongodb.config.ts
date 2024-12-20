import mongoose from 'mongoose';

const isProduction = process.env.NODE_ENV === 'production';

const localDbUri = process.env.PRO_MONGO_URI || '';
const productionDbUri = process.env.PRO_MONGODB_URI || '';

const dbUrl = isProduction ? productionDbUri : localDbUri;

if (!isProduction) {
    console.log('Running in development mode. Connecting to local MongoDB...');
  } else {
    console.log('Running in production mode. Connecting to cloud MongoDB...');
}

const connectDB = async () => {
    const options = {
        socketTimeoutMS: 30000,
        maxPoolSize: 50,
        autoIndex: false, // Don't build indexes
    };

    try {
        const conn = await mongoose.connect(dbUrl, options);
        console.log(`Database connected with host: ${conn.connection.host}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Database connection error: ${error.message}`);
        } else {
            console.error(`An unexpected error occurred: ${String(error)}`);
        }
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;
