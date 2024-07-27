const mongoose = require('mongoose');


const addressSchema = mongoose.Schema({
    id:{
     type: Number,
     required: true
    },
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    }
});

const userSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true
    },
    mobilenumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    image:{
        type:String,
    },
    addresses: [addressSchema], 
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
});



const productSchema = mongoose.Schema({
    id:{
      type: Number,
      required: true
    },
    productName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required:true,
    },
    availability:{
        type: Number,
        required: true,
    },
    brand:{
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
    sold:{
        type: Number,
    },
    images: {
        type: [String],
        default: []
      }
})

const orderProductSchema = mongoose.Schema({
    product: productSchema, 
    quantity: {
        type: Number,
        required: true
    }
});

const orderSchema = mongoose.Schema({
    products: [orderProductSchema], 
    orderDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    totalprice: {
        type: Number,
        required: true
    },
    totalQuantity:{
        type: Number,
        required: true
    }
});


const categorySchema = new mongoose.Schema({
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  });

const adminSchema = mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
});






const User = mongoose.model("User",userSchema);
const Category = mongoose.model("Category",categorySchema)
const Admin =  mongoose.model("Admin",adminSchema);
const Product = mongoose.model('Product',productSchema);
const Order = mongoose.model('Order',orderSchema);


module.exports = {User,Category,Admin,Product,Order};