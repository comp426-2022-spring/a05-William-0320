// This ensures that things do not fail silently but will throw errors instead.
"use strict";
// Require better-sqlite.
const Database = require('better-sqlite3');

//Connect to a db or create one if not exist yet
const db = new Database('log.db');
const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`)

let row = stmt.get();
if(row === undefined){
    console.log("Database appears to be empty. Initializing now...");

    const sqlInit = `
        CREATE TABLE accesslog(
            id INTEGER PRIMARY KEY,
            remoteaddr TEXT,
            remoteuser TEXT,
            time TEXT,
            method TXT,
            url TEXT,
            protocol TEXT,
            httpversion TEXT,
            status TEXT,
            referrer TEXT,
            useragent TEXT
        );
    `
    
    db.exec(sqlInit);
}else{
    console.log("Log database exists.");
}

module.exports = db;
