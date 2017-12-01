const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const models = require('./models/models.js');

let localIP = '';

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/app', { config: { autoIndex: false } }, (err) => {
  if (err) {
    console.log('连接失败：' + err);
    process.exit(1);
  }
  console.log('mongo连接成功...');
});
const Users = mongoose.model('Users',models.users,'Users');

app.post('/signup', function (req, res) {
  const option = { upsert: true, multi: true };
  const obj = {
    username: req.body.userName,
    password: req.body.password,
    idcode: req.body.IDcode,
  }
  if (req.body.repassword !== req.body.password) {
    res.json({message: '注册失败',reason: '两次密码输入不一致'});
    return;
  }
  Users.find({'userName': obj.username},(err,resp) => {
    if (err) {
      console.log(err);
    } else {
      if (resp.length > 0) {
        res.json({message: '注册失败',reason: '用户名已存在'});
      } else {
        Users.update({userName: obj.username},obj,option,(err,raw) => {
          if (err) {
            console.log(err);
            return;
          } else {
            res.json({message: '注册成功'});
          }
        })
      }
    }
  })
})

app.post('/signin',(req,res) => {
  Users.find({userName: req.body.username,password: req.body.password},(err,resp) => {
    if (err) {
      console.log(err);
      return;
    } else {
      if (resp.length == 1) {
        res.json({message: '登陆成功'});
      } else {
        res.json({message: '登陆失败'});
      }
    }
  })
})

//从板子获取IP
app.post('/IPaddress', (req, res) => {
  console.log(req.body.IPaddress);
  localIP = req.body.IPaddress;
  res.end('hello');
})

//发送IP给前端
app.get('/ip',(req,res) => {
  res.json({ip: localIP});
})

app.listen(8084, () => {
  console.log('Server running,listening port: 8084');
})