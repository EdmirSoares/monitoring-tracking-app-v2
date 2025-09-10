import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

async function getDb() {
    if (!db) {
        db = await SQLite.openDatabaseAsync("locations.db");
    }
    return db;
}

export async function initLocationDatabase() {
    try {
        const dbConnected = await getDb();
        await dbConnected.execAsync(`
        PRAGMA journal_mode = WAL;
      
        CREATE TABLE IF NOT EXISTS location_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            timestamp INTEGER NOT NULL,
            is_sent INTEGER DEFAULT 0 CHECK(is_sent IN (0, 1, 2)),
            created_at INTEGER DEFAULT (strftime('%s', 'now')),
            accuracy REAL,
            altitude REAL,
            speed REAL
        );
      
        CREATE INDEX IF NOT EXISTS idx_location_sent ON location_data(is_sent);
        CREATE INDEX IF NOT EXISTS idx_location_timestamp ON location_data(timestamp);
    `);
        console.log("Location database initialized successfully");
    } catch (error) {
        console.error("Error initializing location database:", error);
        throw error;
    }
}

export async function insertLocation(location: {
    latitude: number;
    longitude: number;
    timestamp: number;
    accuracy?: number;
    altitude?: number;
    speed?: number;
}) {
    try {
        const dbConnected = await getDb();
        const result = await dbConnected.runAsync(
            `INSERT INTO location_data 
       (latitude, longitude, timestamp, accuracy, altitude, speed) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                location.latitude,
                location.longitude,
                location.timestamp,
                location.accuracy || null,
                location.altitude || null,
                location.speed || null,
            ]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Error inserting location:", error);
        throw error;
    }
}

export async function getUnsentLocations(limit: number = 100) {
    try {
        const dbConnected = await getDb();
        return dbConnected.getAllAsync(
            `SELECT id, latitude, longitude, timestamp, accuracy, altitude, speed
     FROM location_data
     WHERE is_sent = 0
     ORDER BY timestamp ASC
     LIMIT ?`,
            [limit]
        );
    } catch (error) {
        console.error("Error fetching unsent locations:", error);
        throw error;
    }
}

export async function getAllLocations(limit: number = 100) {
    const dbConnected = await getDb();
    return dbConnected.getAllAsync(
        `SELECT latitude, longitude FROM location_data ORDER BY timestamp ASC LIMIT ?`,
        [limit]
    );
}

export async function markLocationsAsPending(ids: number[]) {
    if (ids.length === 0) return;
    const dbConnected = await getDb();
    const placeholders = ids.map(() => "?").join(",");
    await dbConnected.runAsync(
        `UPDATE location_data SET is_sent = 1 WHERE id IN (${placeholders})`,
        ids
    );
    console.log(`Marked ${ids.length} locations as pending`);
}

export async function markLocationsAsSent(ids: number[]) {
    if (ids.length === 0) return;

    try {
        const dbConnected = await getDb();
        const placeholders = ids.map(() => "?").join(",");
        await dbConnected.runAsync(
            `UPDATE location_data SET is_sent = 2 WHERE id IN (${placeholders})`,
            ids
        );
        console.log(`Marked ${ids.length} locations as sent`);
    } catch (error) {
        console.error("Error marking locations as sent:", error);
        throw error;
    }
}

export async function deleteAllSentLocations() {
    try {
        const dbConnected = await getDb();
        const result = await dbConnected.runAsync(
            `DELETE FROM location_data WHERE is_sent = 2`
        );
        console.log(`Deleted ${result.changes} sent locations`);
        return result.changes;
    } catch (error) {
        console.error("Error deleting sent locations:", error);
        throw error;
    }
}

export async function revertPendingToUnsent(ids: number[]) {
    if (ids.length === 0) return;
    const dbConnected = await getDb();
    const placeholders = ids.map(() => "?").join(",");
    await dbConnected.runAsync(
        `UPDATE location_data SET is_sent = 0 WHERE id IN (${placeholders})`,
        ids
    );
    console.log(`Reverted ${ids.length} pending locations back to unsent`);
}

export async function cleanupOldLocations(daysToKeep: number = 30) {
    try {
        const dbConnected = await getDb();
        const cutoffTime =
            Math.floor(Date.now() / 1000) - daysToKeep * 24 * 60 * 60;
        const result = await dbConnected.runAsync(
            "DELETE FROM location_data WHERE timestamp < ? AND is_sent = 1",
            [cutoffTime]
        );
        console.log(`Cleaned up ${result.changes} old location records`);
        return result.changes;
    } catch (error) {
        console.error("Error cleaning up old locations:", error);
        throw error;
    }
}

export async function resetLocationDatabase() {
    try {
        if (db) {
            await db.closeAsync();
            db = null;
        }

        await SQLite.deleteDatabaseAsync("locations.db");
        console.log("Location database deleted successfully");
        await initLocationDatabase();
    } catch (error) {
        console.error("Error deleting database:", error);
        throw error;
    }
}

export async function countUnsentLocations() {
    try {
        const dbConnected = await getDb();
        const result = await dbConnected.getAllAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM location_data WHERE is_sent = 0`
        );
        console.log("Unsent locations count:", result);
        return result;
    } catch (error) {
        console.error("Error counting unsent locations:", error);
        throw error;
    }
}
