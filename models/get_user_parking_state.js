const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('db.sqlite3');

module.exports = (userId) => {
    return new Promise((resolve, reject) => {
        if(!userId) {

        } else {
            db.serialize(() => {
                const stmt = db.prepare('SELECT * FROM parking_logs WHERE user_id = ?');
                stmt.get(userId, (err, row) => {
                    console.log(err, row);
                    if(err) {
                        reject({
                            code: ''
                        });
                    } else {
                        const count = row['COUNT(*)'];
                        if(count % 2) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                });
                stmt.finalize();
            });
        }
    });
}