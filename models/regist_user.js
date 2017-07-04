const async = require('async');
const passwordHash = require('password-hash');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('db.sqlite3');

module.exports = (userId, password, passwordConfirm) => {
    return new Promise((resolve, reject) => {
        // 入力不足
        if(!userId, !password) {
            reject({ code: 'missing_inputted' });
        }
        // 確認パスワードの不一致
        else if(password !== passwordConfirm) {
            reject({ code: 'not_same_password' });
        }
        // IDに不正な文字列が含まれていないか
        else if(!userId.match(/^[a-zA-Z0-9]+$/)) {
            reject({ code: 'invalid_userid' });
        }
        else {
            db.serialize(() => {
                async.waterfall([
                    // ユーザが存在しないか調べる
                    (callback) => {
                        const stmt = db.prepare('SELECT COUNT(*) FROM users WHERE user_id=?');
                        stmt.get(userId, (err, row) => {
                            if(row['COUNT(*)'] == 0) {
                                callback(null);
                            } else {
                                callback({ code: 'exist_user' });
                            }
                        });
                    },
                    // 登録する
                    (callback) => {
                        const stmt = db.prepare(`
                            INSERT INTO users (user_id, password, created_at, updated_at)
                            VALUES (?, ?, DATETIME('now', 'localtime'), DATETIME('now', 'localtime'))
                        `);
                        stmt.run(userId.replace(/[A-Z]/g, ch => String.fromCharCode(ch.charCodeAt(0) | 32)), passwordHash.generate(password), (err) => {
                            callback(null);
                        });
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