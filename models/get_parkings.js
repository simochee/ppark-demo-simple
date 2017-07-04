const async = require('async');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('db.sqlite3');

exports.multiple = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const data = [];
            db.each('SELECT * FROM parkings', (err, row) => {
                data.push({
                    id: row.id,
                    name: row.name,
                    isParkable: row.is_parkable,
                    lat: row.lat,
                    lng: row.lng,
                    description: row.description
                });
            }, err => {
                resolve(data);
            });
        });
    });
}

exports.single = (parkingId) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const stmt = db.prepare('SELECT * FROM parkings WHERE id = ?');
            stmt.get(parkingId, (err, row) => {
                resolve({
                    id: row.id,
                    name: row.name,
                    isParkable: row.is_parkable,
                    lat: row.lat,
                    lng: row.lng,
                    description: row.description
                });
            });
            stmt.finalize();
        });
    });
}