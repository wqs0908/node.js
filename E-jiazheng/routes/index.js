var express = require('express');
var users   = require("../users.json");
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'E家政登录' });
});

router.post('/login', function(req, res, next) {
  	var name = req.body.name ;
    var user = users[name];
    console.log(user);
    console.log("name="+name+"&pwd="+req.body.pwd+"&role="+req.body.role);
    if(user && user.pwd_u == req.body.pwd && "1" == req.body.role){
        console.log('商家登录~');
        res.cookie('name_s',name);
        res.cookie('role',req.body.role);
        res.redirect('/shops'); //转到商家页面

    }else if(user && user.pwd_u == req.body.pwd && "2" == req.body.role){
        console.log('用户登录~');
        res.cookie('name_u',name);
        res.cookie('role',req.body.role);
        res.redirect('/list'); //转到用户页面

    }
    else{
        res.sendStatus(404);
    }
});

router.get('/list', function(req, res, next) {
  res.render('list', { title: 'E家政登录' });
});

router.get('/shops', function(req, res, next) {
  res.render('shops', { title: 'E家政登录' });
});

module.exports = router;
