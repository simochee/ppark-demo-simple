const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('db.sqlite3');

db.serialize(() => {
    if(process.env.ID <= 0) {
        console.log('Invalid argument `ID`')
        return false;
    }
    const stmt = db.prepare('UPDATE users SET canceled_at = DATETIME("now", "localtime") WHERE id = ?');
    stmt.run(process.env.ID, () => {
        console.log('Compelete');
    });
    stmt.finalize();
});
db.close();