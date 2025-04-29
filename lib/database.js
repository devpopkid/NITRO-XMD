const Sequelize = require('sequelize');

// The Database Manager, always so grand
// Ensures the DB connections are firmly planned
class DatabaseManager {
    static instance = null;

    // Get the instance, so we never lose track
    static getInstance() {
        if (!DatabaseManager.instance) {
            const DATABASE_URL = process.env.DATABASE_URL || './database.db';

            // If it's SQLite, we'll keep it light
            DatabaseManager.instance =
                DATABASE_URL === './database.db'
                    ? new Sequelize({
                            dialect: 'sqlite',
                            storage: DATABASE_URL,
                            logging: false, // No logs to see, just let it be
                      })
                    : new Sequelize(DATABASE_URL, {
                            dialect: 'postgres',
                            ssl: true,
                            protocol: 'postgres',
                            dialectOptions: {
                                native: true,
                                ssl: { require: true, rejectUnauthorized: false },
                            },
                            logging: false, // Keep the logs low, let the database grow
                      });
        }
        return DatabaseManager.instance; // Return the one true connection line
    }
}

// The connection's alive, the database thrives
const DATABASE = DatabaseManager.getInstance();

// Sync the DB, let it be
DATABASE.sync()
    .then(() => {
        console.log('Database synchronized, it’s working just fine!');
    })
    .catch((error) => {
        console.error('Oh no, syncing failed, what a sign:', error);
    });

module.exports = { DATABASE }; // The database we cherish, from start to finish
