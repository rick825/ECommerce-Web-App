const express = require('express');
const route  = express.Router();
const nodemailer = require('nodemailer');
const { check,validationResult } = require('express-validator');
const controller = require('../controller/controller');
const {User,Admin,Category,Product,Order} = require('../model/model');

// Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
   user: process.env.EMAIL,
   pass: process.env.APP_PASS,
  },
});

// Generate OTP
function generateOTP() {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  return otp;
}


//send OTP
route.post('/api/sendOtp', (req, res) => {
  const email = req.body.value;

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  if(!email) return res.status(400).json({error:"Email is required"});
  console.log("Email-->", email);
  const otp = generateOTP();
    
  const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP for Verification',
      text: `Your OTP is: ${otp}. This OTP is valid for 5 minutes.`
  };

    //transporter
    transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
          console.log('Error sending OTP:', error);
          return res.status(500).json({ error: 'Failed to send OTP' });
       } else {
          console.log('OTP sent:', info.response);
          return res.status(200).json({ otp: otp, message: "OTP has been sent successfully." });
       }
    });


});

//verify user
route.post('/api/verifyuser',async (req,res)=>{
  try {
 
    const value = req.body.value;
    console.log(value);
    
    const email = value.toLowerCase();
 
    if(!email) {
      console.log("Email is Required",email);
      return res.status(400).json({message : "Email is required!"});
  }
    const user = await User.findOne({email:email});
 
    if(user){
     console.log("User Found");
     return res.status(200).json({message:"Email Verified User Found!!"});
    }else{
     console.log('User Not Found');
     return res.status(204).json({message : 'User not found'});
    }
   
  } catch (error) {
    console.log({error:"Error while Login"});
    return res.status(500).json({error:"Server Error"})
  }
 });

 //get Admins
 route.get('/getadmins',async (req,res)=>{
  try {
    const adminList = await Admin.find();

    return res.status(200).send({message:"Admin List Fetched",admins:adminList});
   
  }catch (error) {
    console.log({error:"Error while Login"});
    return res.status(500).json({error:"Server Error"})
    }
});

//get Users
route.get('/getUsers',async (req,res)=>{
  try {
    const users = await User.find();
    return res.status(200).send({message:"Users Fetched",users:users});
  } catch (error) {
    console.log("Error while getting users-->",error);
    return res.status(500).json({error:"Server Error"})
  }
})

//get product
route.get('/getProducts', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ product: products });
  } catch (error) {
    console.error('Error while getting products', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get users orders
route.get('/getUsersOrders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orders = await Order.find({ _id: { $in: user.orders } });
    
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error while getting orders:", error);
    return res.status(500).json({ error: "Server Error" });
  }
});

//get updated product
route.get('/api/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id->",id);
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.log("Error while getting updated products", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//get products in category
route.get('/api/getProductInCategory/:category',async (req,res)=>{
  try {
    const {category} = req.params;
    const categoryData = await Category.findOne({ name: category });
    
    if (!categoryData) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await Promise.all(
      categoryData.products.map(async (productId) => {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return product;
      })
    );

    return res.status(200).json({ products });

    
  } catch (error) {
    console.log("Error while getting products in Category",error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
})

//delete photo
route.put('/api/product/:id', async (req, res) => {
  try {
    const { images } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { images }, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

//get categories
route.get('/getcategories',async(req,res)=>{
  try {
    const cateList = await Category.find();

    return res.status(200).send({message:"Categories Fetched",categories:cateList});
  } catch (error) {
    console.log("Error while getting Categories",error);
    return res.status(500).json({error:"Server Error"})
  }
})


//logout
route.get('/api/logout', (req,res)=>{
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Failed to logout' });
    }
    console.log('Session destroyed');
    return res.status(200).json({ message: 'Logout successful' });
  });
})



route.post('/api/signup',controller.signup);
route.post('/api/login', controller.login);
route.post('/api/updateProfile',controller.updateProfile);
route.post('/api/addAddress',controller.addAddress);
route.post('/api/createCategory',controller.createCategory);
route.post('/api/updateCategory',controller.updateCategory);
route.post('/api/deleteCategory',controller.deleteCategory);
route.post('/api/createProduct',controller.createProduct);
route.post('/api/product/uploadPhotos',controller.uploadPhotos);
route.post('/api/updateProduct',controller.updateProduct);
route.post('/api/deleteProduct',controller.deleteProduct);
route.post('/api/postOrders',controller.postOrder)
route.post('/api/adminLogin',controller.adminLogin);
route.post('/api/createAdmin',controller.createAdmin);
route.post('/api/updateAdmin',controller.updateAdmin);
route.post('/api/deleteAdmin',controller.deleteAdmin);

module.exports = route;