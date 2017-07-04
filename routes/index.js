const express = require('express');
const router = express.Router();

const model = require('models');

// const u = require('./utils');

router.use((req, res, next) => {
  req.session.user = 'simochee';
  if(req.session.user) {
    model.getUserParkingState(req.session.user)
    .then((isParking) => {
      console.log(isParking);
      res.args = {
        isParking
      };
      next();
    })
    .catch((e) => {

    });
  } else {
    next();
  }
});

router.get('/', (req, res, next) => {
  res.render('index', {
    id: req.session.user
  });
});

router.get('/login', (req, res, next) => {
  if(req.session.user) {
    res.redirect('/');
  }
  res.render('login', { inputId: req.query.id, redirect: req.query.redirect });
});

router.post('/login', (req, res, next) => {
  model.login(req.body.id, req.body.password)
  .then(() => {
    console.log('happen')
    req.session.user = req.body.id;
    res.redirect(req.body.redirect || '/');
  })
  .catch(err => {
    console.log('error')
    // IDまたはパスワードが不足している
    if(err.code === 'missing_inputted') {
      res.redirect(`/login?error=missing_inputted&id=${req.body.id}&redirect=${req.body.redirect}`)
    }
    // 不正な入力内容
    if(err.code === 'invalid_inputted') {
      res.redirect(`/login?error=invalid_inputted&id=${req.body.id}&redirect=${req.body.redirect}`);
    }
  });
});

router.get('/logout', (req, res, next) => {
  req.session.user = null;
  res.redirect('/');
});

router.get('/joinus', (req, res, next) => {
  if(req.session.user) {
    res.redirect('/');
  }
  res.render('joinus', { inputId: req.query.id });
});

router.post('/joinus', (req, res, next) => {
  // 実験参加に同意していない
  if(!req.body.agreement) {
      res.redirect(`/joinus?error=not_agreed&id=${req.body.id}`);
  }
  model.registUser(req.body.id, req.body.password, req.body.passwordConfirm)
  .then(() => {
    res.redirect(`/joinus/complete/${req.body.id}`);
  })
  .catch((err) => {
    // IDまたはパスワードが不足している
    if(err.code === 'missing_inputted') {
      res.redirect(`/joinus?error=missing_inputted&id=${req.body.id}`)
    }
    // 確認パスワードが一致しない
    if(err.code === 'not_same_password') {
      res.redirect(`/joinus?error=not_same_password&id=${req.body.id}`);
    }
    // ユーザが既に登録されている
    if(err.code === 'exist_user') {
      res.redirect(`/joinus?error=exist_user&id=${req.body.id}`);
    }
    // 不正なユーザーID
    if(err.code === 'invalid_userid') {
      res.redirect(`/joinus?error=invalid_userid&id=${req.body.id}`);
    }
  });
});

router.get('/joinus/complete/:id', (req, res, next) => {
  res.send(req.params.id);
});

// 認証
router.use((req, res, next) => {
  if(!req.session.user) {
    res.redirect(`/login?redirect=${req.url}`);
  }
  res.args.id = req.session.user
  next();
});

router.get('/parkin', (req, res, next) => {
  model.getParkings()
  .then((parkings) => {
    res.args.parkings = parkings;
    res.render('parkin', res.args);
  })
});

router.get('/parkin/:id', (req, res, next) => {
  model.getParking(req.params.id)
  .then((parking) => {
    res.args.parking = parking;
    res.render('parkin_confirm', res.args);
  });
});

router.post('/parkin/:id', (req, res, next) => {
  model.parkin(req.params.id, req.session.user)
    .then(() => {
      res.redirect(`/parkin/complete/${req.params.id}`);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/parkin/complete/:id', (req, res, next) => {
  res.args.pid = req.params.id;
  res.render('parkin_complete', res.args);
});

router.get('/parkout', (req, res, next) => {
  res.render('parkout');
});

router.get('/parkout/complete', (req, res, next) => {
  res.render('parkout_complete', { pid: req.params.pid });
});

router.get('/point', (req, res, next) => {
  res.render('point');
});

module.exports = router;
