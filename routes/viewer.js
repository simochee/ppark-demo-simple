const async = require('async');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  const logs = [];
  async.waterfall([
    (callback) => {
      require('../models/get_user_log')()
      .then(data => {
        data.forEach(item => {
          logs.push(item);
        });
        callback();
      });
    }
  ], () => {
    // ソート
    logs.sort((a, b) => {
      if(a.timestamp < b.timestamp) return 1;
      if(a.timestamp > b.timestamp) return -1;
      return 0;
    });
    res.render('viewer/table', { title: 'すべてのログ', logs });
  });
});

/* GET users listing. */
router.get('/users', function(req, res, next) {
  const logs = [];
  async.waterfall([
    (callback) => {
      require('../models/get_user_log')()
      .then(data => {
        data.forEach(item => {
          logs.push(item);
        });
        callback();
      });
    }
  ], (err) => {
    // ソート
    logs.sort((a, b) => {
      if(a.timestamp < b.timestamp) return 1;
      if(a.timestamp > b.timestamp) return -1;
      return 0;
    });
    res.render('viewer/table', { title: 'ユーザーログ', logs });
  });
});

module.exports = router;
