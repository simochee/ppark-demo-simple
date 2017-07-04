
const log = require('debug')('ppark-demo-simple:DB');

// ユーザを登録する
exports.registUser = require('./regist_user');

// ログインする
exports.login = require('./login');

// 駐車場一覧を取得
const getParking =  require('./get_parkings');
exports.getParkings = getParking.multiple;
exports.getParking = getParking.single;
exports.parkin = require('./parkin');

// ユーザーの駐車状況を取得する
exports.getUserParkingState = require('./get_user_parking_state');