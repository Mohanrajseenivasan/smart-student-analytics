const { sequelize } = require('./config/db');

const reset = async () => {
    try {
        console.log('Force Syncing Database to apply new Schema (including new Roles ENUM)...');
        await sequelize.sync({ force: true });
        console.log('Database synced successfully.');
        process.exit(0);
    } catch (e) {
        console.error('Error syncing:', e);
        process.exit(1);
    }
};

reset();
