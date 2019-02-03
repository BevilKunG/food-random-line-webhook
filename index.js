const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Food = require('./models/food');

mongoose.connect('mongodb://localhost/food-random',{ useNewUrlParser: true });

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
