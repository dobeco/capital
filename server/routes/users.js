const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const passport = require('passport');

router.post('/register', (req, res) => {
  // 查询数据库中是否拥有邮箱
  User.findOne({ name: req.body.name }).then(user => {
    if (user) {
      return res.status(422).send({
        message: '注册成功'
      })
      
      //return res.status(400).json('用户名已存在!');
    } else {
      const newUser = new User({
        name: req.body.name,
        password: req.body.password,
      });

      bcrypt.genSalt(10,  (err, salt) =>{
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
          return res.status(200).send({
            message: '注册成功'
          })
        });
      });
    }
  });
});

router.post('/login', (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  // 查询数据库
  User.findOne({ name }).then(user => {
    if (!user) {
       return res.status(422).send({
        message: '用户不存在'
      })
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const rule = {
          id: user.id,
          name: user.name,
        };
        // token验证
        // jwt.sing(规则, 加密名字, 过期时间, func)
        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token
          });
        });
    
      } else {
        return res.status(422).send({
          message: '密码错误'
        })
      }
    }); 
  });
});

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
  
    });
  }
);

module.exports = router;
