const async = require('async');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('db.sqlite3');

module.exports = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const logs = [];
            async.waterfall([
                // ユーザーの登録履歴を取得
                callback => {
                    db.each('SELECT * FROM users', (err, row) => {
                        logs.push({
                            type: 'user',
                            action: '新規登録',
                            id: row.id,
                            userId: row.user_id,
                            timestamp: row.created_at
                        });
                        if(row.canceled_at) {
                            logs.push({
                                type: 'user',
                                action: '解約',
                                id: row.id,
                                userId: row.user_id,
                                timestamp: row.canceled_at,
                            });
                        }
                    }, callback);
                },
            ], () => {
                resolve(logs);
            });
        });
    });
}