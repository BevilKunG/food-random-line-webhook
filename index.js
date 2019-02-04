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
app.post('/webhook',middleware(config),(req,res) => {
  const event = req.body.events[0];
  if(event.type === 'message'){
    const message = event.message;
    if(message.type === 'text' && message.text === 'กินอะไรดี'){
      Food.find({},(err,foundFoods) => {
        if(err){
          console.log(err);
        }else{
          const shuffled = _.shuffle(foundFoods);
          const randomFood = shuffled[Math.floor(Math.random() * _.size(shuffled))];
          // const delicious = _.shuffle(['ลำขนาดเจ้า','จ๊าดลำ','ลำแต๊แต๊เจ้า']);
          // const randomIndex = Math.floor(Math.random() * _.size(delicious));
          client.replyMessage(event.replyToken,{
            type:'text',
            text:`${randomFood.name} ${randomFood.restaurant} ${randomFood.location}`
          });
        }
      });
    }else if(message.type === 'text' && message.text === 'ครีเอทเมนูสุดเจ๋ง'){
      const ingredient1 = _.shuffle(['ข้าว','สปาเก็ตตี้','สุกี้','เส้นหมี่','เส้นใหญ่','เส้นเล็ก','มักกะโรนี','ข้าวมัน','มาม่า','ข้าวกล้อง']);
      const ingredient2 = _.shuffle(['ผัดพริกแกง','ผัดพริกเผา','ผัดไฟแดง','ผัด','ต้มยำ','ผัดขี้เมา','ผัดซีอิ๊ว','ผัดฉ่า','ผัดพริกสวน','กระเทียม']);
      const ingredient3 = _.shuffle(['หมูชิ้น','หมูสับ','หมูกรอบ','เนื้อ','ปลาทู','ปลาสลิด','หอยลาย','ไก่กรอบ','ขาหมู','หมูยอ']);
      const ingredient4 = _.shuffle(['คะน้า','ผักบุ้ง','หน่อไม้','ผักกาด','ผักรวม','บล็อคโคลี่','เห็ดหูหนู','กะหล่ำ','กวางตุ้ง']);
      const newMenu = `${ingredient1[Math.floor(Math.random() * _.size(ingredient1))]}` + `${ingredient2[Math.floor(Math.random() * _.size(ingredient2))]}` + `${ingredient3[Math.floor(Math.random() * _.size(ingredient3))]}` + `${ingredient4[Math.floor(Math.random() * _.size(ingredient4))]}`;
      client.replyMessage(event.replyToken,{
        type:'text',
        text:newMenu
      });
    }else if(message.type === 'text' && message.text === 'help'){
      const helpMessage = 'กินอะไรดี - สุ่มรายการอาหาร\n' + 'ครีเอทเมนูสุดเจ๋ง - สร้างเมนูใหม่แหวกแนว';
      client.replyMessage(event.replyToken,{
        type:'text',
        text:helpMessage
      });
    }
  }

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
