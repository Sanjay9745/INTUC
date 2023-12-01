// userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber:{
    type:Number,
  },
  whatsappNumber:{
    type:Number,
  },
  age:{
    type:Number,
  },
  date_of_birth:{
    type:String,
  },
  block:String,
  constituency:String,
  union:String,
  addaar:{
    type:String,
    default:""
  },
  pan_card:{
    type:String,
    default:""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verified:{
    type:Boolean,
    default:false
  },
  otp:{
    type:Number,
    default:null,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
