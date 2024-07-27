const { User,Category,Admin,Product,Order }  = require('../model/model');
const { authenticateAdmin, authorizeAdminRole } = require('../auth/auth');
const jwt = require('jsonwebtoken');
const secretkey = process.env.SESSION_SECRET;
const bcrypt = require('bcryptjs');

const session = {}
const generateToken = (admin) =>{
  return jwt.sign({user: admin}, secretkey, {expiresIn: '1h'});
}

exports.signup = async (req,res)=>{
  try {
    const {fname, lname, mobilenumber, email} = req.body;
    console.log(fname, lname, mobilenumber, email);

    if(!fname || !lname || !mobilenumber || !email){
      return res.status(400).json({message: "Please Provide Above Data"});
    }

    const user = new User({
      fname,
      lname,
      mobilenumber,
      email
    })

    await user.save();
 
    req.session.user = {
      id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email
    };

    console.log("User Validated Succesfully & Loggedin");
    return  res.status(200).json({message:"User Validated Successfully & Logging you In",user});
    
  } catch (error) {
    console.log({"Error while Signup":error});
    return res.status(500).json({"Error while Signup":error})
  }
}

exports.login = async (req,res)=>{
  try {
    let {email} = req.body;

    email = email.toLowerCase();
 
    if(!email) return res.status(400).json({message : "Email is required!"});
 
    const user = await User.findOne({email:email});
 
    if(user){
      req.session.user = {
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email
      };
      
      console.log("Session Created");
      return res.status(200).json({message:"OTP Verified! Login Successful",user:user})
    }else{
     console.log('User Not Found');
     return res.status(401).json({message : 'User not found'});
    }
   
  } catch (error) {
    console.log({error:"Error while Login",error});
    return res.status(500).json({error:"Server Error"}) 
  }
}


//update profile
exports.updateProfile = async (req,res)=>{
  try {

    const { fname, lname, email, mobilenumber, image, id } = req.body;

    if (!fname || !lname || !email || !mobilenumber || !id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findById(id);

    if(!user){
      return res.status(404).json({error: 'User not found'})
    }

    user.fname = fname;
    user.lname = lname;
    user.email = email;
    user.mobilenumber = mobilenumber;
    if(image) {
      user.image = image;
    }

    user.save()

    return res.status(200).json({message:"User Updated Successfully",user:user})

  } catch (error) {
    console.log("Error while updating profile",error);
    return res.status(500).json({error:"Server Error"})
  }
}

//add address
exports.addAddress = async (req, res) => {
  try {
    const { street, city, state, postalCode, country, userid, id } = req.body;

    if (!street || !city || !state || !postalCode || !country || !userid || !id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAddress = { id, street, city, state, postalCode, country };

    if (!user.addresses) {
      user.addresses = [];
    }
    
    user.addresses.push(newAddress);
    await user.save();

    return res.status(200).json({ message: 'Address added successfully', user });
  } catch (error) {
    console.log('Error while adding address-->', error);
    return res.status(500).json({ error: 'Server Error' });
  }
};

//Category
exports.createCategory = [ authenticateAdmin,
  authorizeAdminRole(['all','write']),
  async (req, res) => {
  try {
    const { unId, formData } = req.body;
    console.log("data--->", unId, formData);

    const category = new Category({
      id: unId,
      name: formData.name,
    })

    await category.save();

    return res.status(200).json({ message: 'Category created successfully' });
  } catch (error) {
    console.log("Error while Creating Categories-->", error);
    return res.status(500).json({ error: "Server Error" });
  }
 }
];

exports.updateCategory = [
  authenticateAdmin,
  authorizeAdminRole(['all','write']),
  async (req, res) => {
   try {
    const { cate,formData } = req.body;
    if(!formData){
      return res.status(400).json({message:"Invalid Data"})
    }

    const editCate = await Category.findOne({id:cate.id});
    
    if(!editCate){
      return res.status(400).json({message:"Category Not Found"})
      }
     
     editCate.name = formData.name;
     await editCate.save();

     const products = await Product.find({ category: cate.name });
      
      for (let product of products) {
        product.category = formData.name;
        await product.save();
      }
      
      return res.status(200).json({ message: "Category Updated Successfully" });
    
   } catch (error) {
     console.log("Error while Updating category--->",error);
     return res.status(500).json({error:"Server Error"})
   }
  }
]

//delete category
exports.deleteCategory = [
  authenticateAdmin,
  authorizeAdminRole(['all','write']),
  async (req, res) => {
    try {

      const { cate } = req.body;
      console.log("Cate-->",cate);

      if(!cate){
       return res.status(400).json({message:"Please Provide Category to be Deleted!!"})
      }

     const deleteCate = await Category.findOneAndDelete({_id:cate._id});
     if(!deleteCate){
     return res.status(401).json({message:"Category Not Found!!"})
     }

     const products = await Product.find({ category:cate.name});
     for (let product of products) {
      product.category = "No Category";
      await product.save();
      }

     return res.status(200).send({message:"Category Deleted Successfully"});
      
    } catch (error) {
      console.log("Error while Deleting Category-->",error);
      return res.status(500).json({error:"Server Error"})
    }
  }
]

//create product
exports.createProduct = [
  authenticateAdmin,
  authorizeAdminRole(['all', 'write']),
  async (req, res) => {
    try {
      const { unId, formData } = req.body;
      console.log("Form Data-->", formData);

      if (!unId || !formData) {
        return res.status(400).json({ message: "Please Provide Product Details!!" });
      }

      const newProduct = new Product({
        id: unId,
        ...formData
      });

      await newProduct.save();

      const category = await Category.findOne({ name: formData.category });

      if (!category) {
        return res.status(404).json({ message: "Category Not Found!!" });
      }

      category.products.push(newProduct._id);
      await category.save();

      return res.status(200).send({ message: "Product Created Successfully!!", newProduct });
    } catch (error) {
      console.log("Error while creating Product--->", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
];

//upload photos
exports.uploadPhotos = [
  authenticateAdmin,
  authorizeAdminRole(['all', 'write']),
  async (req, res) => {
    try {
      const { seeProduct, images } = req.body;

      if (!seeProduct || !images || !Array.isArray(images)) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const product = await Product.findById(seeProduct._id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.images = product.images.concat(images); 
    await product.save();

    return res.status(200).json({ message: "Photos uploaded successfully", product });
      
    } catch (error) {
      console.log("Error while Uploading Photos",error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
]

//update product
exports.updateProduct = [
  authenticateAdmin,
  authorizeAdminRole(['all', 'write']),
  async (req, res) => {
    try {
      const { unId, formData } = req.body;

      if (!unId || !formData) {
        return res.status(400).json({ message: "Invalid data" });
      }

      const product = await Product.findOne({ _id: unId });
      if (!product) {
        return res.status(401).json({ message: "Product not found" });
      }

      // Check if the category is changing
      const prevCategory = product.category;

      // Update product fields
      product.productName = formData.productName;
      product.description = formData.description;
      product.price = formData.price;
      product.category = formData.category;
      product.brand = formData.brand;
      product.availability = formData.availability;

      await product.save();

      if (prevCategory !== formData.category) {
        const prevCategoryDoc = await Category.findOne({ name: prevCategory });
        if (prevCategoryDoc) {
          prevCategoryDoc.products = prevCategoryDoc.products.filter(productId => !productId.equals(product._id));
          await prevCategoryDoc.save();
        }

        const newCategoryDoc = await Category.findOne({ name: formData.category });
        if (!newCategoryDoc) {
          return res.status(401).json({ message: "New category not found" });
        }
        newCategoryDoc.products.push(product._id);
        await newCategoryDoc.save();
      }

      return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.log("Error while updating product", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
];

//delete product
exports.deleteProduct = [
  authenticateAdmin,
  authorizeAdminRole(['all', 'write']),
  async (req, res) => {
    try {
      const {productId, productCategory} = req.body;

      if(!productId){
        return res.status(400).json({message:"Invalid data"});
      }

      const deletedProduct = await Product.findOneAndDelete({_id:productId})

      if(!deletedProduct){
        return res.status(401).json({message:"Product not found"});
      }

      await Category.updateOne(
        { name: productCategory },
        { $pull: { products: productId } }
      );

      return res.status(200).json({message:"Product Deleted Successfully"});
      
    } catch (error) {
      console.log("Error while Deleting Product-->",error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
]

//order
exports.postOrder = async (req, res) => {
  try {
    const { products, userid } = req.body;

    console.log("Received products:", products);


    if (!Array.isArray(products) || !userid) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

 
    const order = new Order({
      products: products.map(item => ({
        product: item.product,
        quantity: item.quantity
      })),
      totalQuantity: totalQuantity,
      totalprice: totalPrice
    });

    await order.save();


    user.orders.push(order._id);
    await user.save();

    res.status(201).json({ message: 'Order placed successfully!',user:user });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};



//admin
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const email_lower = email.toLowerCase();
    console.log("Admin Info-->", email_lower, password);

    const admin = await Admin.findOne({ email: email_lower });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = generateToken(admin._id);
    res.status(200).send({ message: "Logged In Successfully!!", admin: admin, token: token });
    
  } catch (error) {
    console.log("Error while login as admin-->", error);
    return res.status(500).json({ error: "Server Error" });
  }
};



exports.createAdmin = [
  authenticateAdmin,
  authorizeAdminRole(['all']),
  async (req, res) => {
    try {
      const {unId, name, email, password, confirmPassword, role } = req.body;

      if (!unId || !name || !email || !password) {
        return res.status(400).json({ message: "Please provide all required data" });
      }

      const alreadyPresent = await Admin.findOne({email:email});

     if(alreadyPresent){
      return res.status(401).json({message:"Email already present!!"});
     }

     if(password === confirmPassword){
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
        id:unId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role
      });

      await newAdmin.save();
      return res.status(200).json({ message: 'Admin created successfully',newAdmin:newAdmin });
    }else{
      return res.status(401).json({message:"Password and Confirm Password does not match!!"})
    }

    } catch (error) {
      console.log("Error while Creating Admin--->", error);
      return res.status(500).json({ error: "Server Error" });
    }
  }
];


exports.updateAdmin = [
  authenticateAdmin,
  authorizeAdminRole(['all','write']),
  async (req, res) => {
    try {
      const {uid,name, email, role } = req.body;
      console.log(uid,name, email, role );
      if (!uid || !name || !email || !role) {
        return res.status(400).json({ message: "Please provide all required data" });
        }
        const admin = await Admin.findOne({id:uid});
        if(!admin){
          return res.status(401).json({message:"Admin not found!!"});
          }

          admin.name = name;
          admin.email = email.toLowerCase();
          admin.role = role;

          await admin.save();
          return res.status(200).json({ message: "Admin updated successfully", admin });

      }catch(error){
        console.log("Error while updating Admin",error);
        return res.status(500).json({ error: "Server Error" });
      }
    }
]


exports.deleteAdmin = [
  authenticateAdmin,
  authorizeAdminRole(['all']),
  async (req, res) => {
    try {
      const { adm } = req.body; 
      console.log("adm-->",adm);

      if (!adm) {
        return res.status(400).json({ message: "Admin identifier is required" });
      }

      const deletedAdmin = await Admin.findOneAndDelete({ _id: adm._id });

      if (!deletedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json({ message: "Admin deleted successfully", admin: deletedAdmin });
    } catch (error) {
      console.log("Error while deleting Admin", error);
      return res.status(500).json({ error: "Server Error" });
    }
  }
];
