import React, { useEffect, useState } from 'react';
import Navigation from '../navigation/Navigation';
import { useAdminContext } from '../../../../context/AdminContext';
import { useLocalProvider } from '../../../../context/LocalContext';
import CreateProduct from './CreateProduct';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const SeeProduct = () => {
  const [showForm, setShowCreateForm] = useState(false);
  const { setSeeProduct,adminData } = useAdminContext();
  const { productList, setProductList } = useLocalProvider();
  const [refresh, setRefresh] = useState('');

  const navigate = useNavigate();

  const handleNavigation = (prod) => {
    setSeeProduct(prod);
    navigate('/admin/editProduct');
  }


  useEffect(() => {
    handleGetProducts();
  }, [refresh]);

  // Fetch products
  const handleGetProducts = async () => {
    try {
      const response = await axios.get('/getProducts');
      if (response.status === 200) {
        setProductList(response.data.product);
        setRefresh('');
      }
    } catch (error) {
      console.log("Error while Getting Products", error);
      toast.error("Error while Getting Products");
    }
  }

  // Handle form visibility
  const handleForm = (value) => {
    setShowCreateForm(value);
  }

  // Delete product
  const handleDeleteProduct = async (productId,productCategory) => {
    try {
      if(adminData.admin.role === 'all' || adminData.admin.role === 'write'){
      
        let token;
        try {
          token = adminData.token ? adminData.token : {};
        } catch (error) {
          console.error("Invalid token format:", error);
          toast.error("Invalid token format");
          return;
        }

        await axios.post('/api/deleteProduct',{productId,productCategory},{
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
           }
        });
        toast.success("Product deleted successfully!");
        setRefresh('Deleted');
      }else{
        toast.error("You don't have permission to delete products");
      }
    } catch (error) {
      console.log("Error while deleting product", error);
      toast.error("Error while deleting product");
    }
  }

  return (
    <div className='seeproduct'>
      <div className="seeproducttop add-btn-div">
        <button className="add-btn" onClick={() => handleForm(true)}>Add Product</button>
        <Navigation />
      </div>
      <div className="seeCategoryBottom">
        {showForm && <CreateProduct showForm={showForm} setShowCreateForm={setShowCreateForm} setRefresh={setRefresh} />}
        <div className="main-table">
          <table>
            <thead>
              <tr>
                <th>Unique ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList && productList.length > 0 ? (
                productList.map((prod) => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td>{prod.productName}</td>
                    <td>{prod.price}</td>
                    <td>{prod.category}</td>
                    <td className='tableBtnMain'>
                      <button className='tableBtn' onClick={() => handleNavigation(prod)}>See Product & Edit</button>
                      <button className='tableBtn' onClick={() => handleDeleteProduct(prod._id,prod.category)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SeeProduct;
