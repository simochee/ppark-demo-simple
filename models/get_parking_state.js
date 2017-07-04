const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('db.sqlite3');

module.exports = (parkingId) => {
    return new Promise((resolve, reject) => {
        if(!parkingId) {
            reject({ code: 'missing_argument' });
        }
        else {
            db.serialize(() => {
                const stmt = db.prepare('SELECT is_parkable FROM parkings WHERE id = ?');
                stmt.get(parkingId, (err, row) => {
                    resolve(row.is_parkable === 'true' ? true : false);
                });
                stmt.finalize();
            });
        }
    });
}