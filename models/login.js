const async = require('async');
const passwordHash = require('password-hash');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('db.sqlite3');

module.exports = (userId, password) => {
    return new Promise((resolve, reject) => {
        // 入力不足
        if(!userId || !password) {
            reject({ code: 'missing_inputted' });
        }
        else {
            db.serialize(() => {
                const stmt = db.prepare('SELECT * FROM users WHERE user_id = ?');
                stmt.get(userId.replace(/[A-Z]/g, ch => String.fromCharCode(ch.charCodeAt(0) | 32)), (err, row) => {
                    if(row && passwordHash.verify(password, row.password)) {
                        resolve();
                    } else {
                        reject({ code: 'invalid_inputted' });
                    }
                });
                stmt.finalize();
            });
        }
    });
}