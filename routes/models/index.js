const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite3');

exports.auth = (key) => {
    return Promise((resolve, reject) => {
        
    });
}