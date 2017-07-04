const async = require('async');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('db.sqlite3');

module.exports = (parkingId, userId) => {
    return new Promise((resolve, reject) => {
        if(!parkingId || !userId) {
            reject({ code: 'missing_argument' });
        }
        else {
            db.serialize(() => {
                async.waterfall([
                    // 入庫可能かどうか調べる
                    (callback) => {
                        require('./get_parking_state')(parkingId)
                            .then((isParkable) => {
                                if(isParkable) {
                                    callback(null);
                                } else {
                                    callback({ code: 'parking_used' });
                                }
                            })
                            .catch(() => {
                                callback({ code: 'parking_used' });
                            });
                    },
                    (callback) => {
                        const stmt = db.prepare('UPDATE parkings SET is_parkable = "false" WHERE id = ?')
                        stmt.run(parkingId, (err) => {
                            callback(null);
                        });
                        stmt.finalize();
                    },
                    (callback) => {
                        const stmt = db.prepare(`
                            INSERT INTO parking_logs (action, parking_id, user_id, created_at)
                            VALUES ('entry', ?, ?, DATETIME('now', 'localtime'))
                        `);
                        stmt.run(parkingId, userId, (err) => {
                            callback(null);
                        })
                        stmt.finalize();
                    },
                ], (err) => {
                    if(!err) {
                        resolve();
                    }
                    else {
                        reject({ code: err.code });
                    }
                });
            });
        }
    });
}