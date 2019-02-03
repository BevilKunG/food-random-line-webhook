const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const Food = require('./models/food');
const middleware = require('@line/bot-sdk').middleware;
const Client = require('@line/bot-sdk').Client;

const config = {
  channelAccessToken:'XgMqQKgVD/B3V1UFAYX3AHCeHcBoskjU2o8dcVIkDCxBfOzUIHqVrbB5Y3ZQpU6CYuCruTbxMyYwpRLJZr1MKKrsaTntYCVEorG8W8f0hTdnRZEE6c2GLcHM0fao4SvmB96dnhxZ9zZGGxwtJTbyAAdB04t89/1O/w1cDnyilFU=',
  channelSecret:'8eab0edbef136a0b061f278d790c90fc'
};

const client = new Client(config);

mongoose.connect(keys.mongoURI,{ useNewUrlParser: true });

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ entended:true }));

app.get('/',(req,res) => {
  res.redirect('/foods/new');
});

//Add new food
app.get('/foods/new',(req,res) => {
  Food.find({},(err,foundFoods) => {
    if(err){
      console.log(err);
    }else{
      res.render('new',{foods:foundFoods});
    }
  });

});

app.post('/foods',(req,res) => {
  const newFood = new Food({
    name:req.body.name,
    restaurant:req.body.restaurant,
    location:req.body.location
  });
  newFood.save();
  res.redirect('/foods/new');
});

//Line Webhook
app.post('/webhook',(req,res) => {
  const event = req.body.event[0];
  // if(event === 'message'){
  //   const message = event.message;
  //   if(message.type === 'text' && message.text === 'กินอะไรดี'){
  //     Food.find({},(err,foundFoods) => {
  //       if(err){
  //         console.log(err);
  //       }else{
  //         const shuffled = _.shuffle(foundFoods);
  //         const randomFood = shuffled[Math.floor(Math.random() * _.size(shuffled))];
  //         client.replyMessage(event.replyToken,{
  //           type:'text',
  //           text:`${randomFood.name} ${randomFood.restaurant} ${randomFood.location} ลำขนาดเจ้า`
  //         });
  //       }
  //     });
  //   }
  // }

  res.send('webhook success!!');
});

//Food menu api
app.get('/api/foods',(req,res) => {
  Food.find({},(err,foundFoods) => {
    if(err){
      console.log(err);
    }else{
      res.send(foundFoods);
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port);
