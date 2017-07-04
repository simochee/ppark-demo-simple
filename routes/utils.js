const models = require('./models');

exports.auth = (key) => {
    if(!key) {
        return false;
    }
    return await models.auth(key);
}