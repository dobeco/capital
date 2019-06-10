const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const assert = require('http-assert')
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
          return res.status(422).send({
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

    const isValid = require('bcrypt').compareSync(password, user.password);
    //assert(isValid, 422, '密码错误');

    if (!isValid) {
      return res.status(422).send({
        message: '密码错误'
      })
    }
    // 3.返回token
    const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: 3600 })
    res.send({ token }) 
    // 密码匹配
   /*  bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const rule = {
          id: user.id,
          name: user.name,
        };
        // token验证
        // jwt.sing(规则, 加密名字, 过期时间, func)
        jwt.sign(rule, 'secret', { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token: 'Bearer ' + token
          });
        });
        // res.json({msg:"success"});
      } else {
        return res.status(422).json('密码错误!');
      }
    }); */
  });
});

module.exports = router;
