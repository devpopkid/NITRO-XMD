const { DATABASE } = require('../lib/database');
const { DataTypes } = require('sequelize');

// AntiDelDB - the keeper of AntiDelete state
const AntiDelDB = DATABASE.define('AntiDelete', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: 1, // Setting the ID to one for the AntiDelete lore
    },
    gc_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Group chats, no delete yet
    },
    dm_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Direct messages, still free from the set
    },
}, {
    tableName: 'antidelete', // The table where AntiDelete sleeps
    timestamps: false, // No time stamps, just the state it keeps
    hooks: {
        beforeCreate: record => { record.id = 1; }, // ID stays constant, never to wane
        beforeBulkCreate: records => { records.forEach(record => { record.id = 1; }); },
    },
});

let isInitialized = false;

async function initializeAntiDeleteSettings() {
    if (isInitialized) return;
    try {
        await AntiDelDB.sync(); // Sync it, make it real
        await AntiDelDB.findOrCreate({
            where: { id: 1 },
            defaults: { gc_status: false, dm_status: false },
        });
        isInitialized = true; // Now initialized, the AntiDelete path
    } catch (error) {
        console.error('Error initializing anti-delete settings:', error);
    }
}

async function setAnti(type, status) {
    try {
        await initializeAntiDeleteSettings(); // Make sure it's awake
        const record = await AntiDelDB.findByPk(1); // Find the record we keep
        if (type === 'gc') record.gc_status = status; // Set for Group Chats' fate
        else if (type === 'dm') record.dm_status = status; // Set for Direct Messages' gate
        await record.save();
        return true;
    } catch (error) {
        console.error('Error setting anti-delete status:', error);
        return false;
    }
}

async function getAnti(type) {
    try {
        await initializeAntiDeleteSettings(); // Check if it's ready to shine
        const record = await AntiDelDB.findByPk(1);
        return type === 'gc' ? record.gc_status : record.dm_status; // Retrieve the status fine
    } catch (error) {
        console.error('Error getting anti-delete status:', error);
        return false;
    }
}

async function getAllAntiDeleteSettings() {
    try {
        await initializeAntiDeleteSettings(); // A final check before we retrieve
        const record = await AntiDelDB.findByPk(1);
        return [{ gc_status: record.gc_status, dm_status: record.dm_status }];
    } catch (error) {
        console.error('Error retrieving all anti-delete settings:', error);
        return [];
    }
}

module.exports = {
    AntiDelDB,
    initializeAntiDeleteSettings,
    setAnti,
    getAnti,
    getAllAntiDeleteSettings,
};
