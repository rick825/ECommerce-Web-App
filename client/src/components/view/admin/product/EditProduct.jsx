import React,{useState} from 'react'
import { toast } from 'react-toastify';
import { useAdminContext } from '../../../../context/AdminContext';
import axios from 'axios';


const EditProduct = ({onUploadComplete,setEditFormShow }) => {

    const { categories, adminData, seeProduct } = useAdminContext();

  const [formData, setFormData] = useState({
    productName: seeProduct.productName,
    description: seeProduct.description,
    price: seeProduct.price,
    category: seeProduct.category,
    availability: seeProduct.availability,
    brand: seeProduct.brand
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (adminData.admin.role === 'all' || adminData.admin.role === 'write') {
        let unId = seeProduct._id;
        console.log(unId);
        let token;
        try {
          token = adminData.token ? adminData.token : {};
        } catch (error) {
          console.error("Invalid token format:", error);
          toast.error("Invalid token format");
          return;
        }

        const response = await axios.post('/api/updateProduct', { unId, formData }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          toast.success('Product Updated successfully');
          onUploadComplete();
          setEditFormShow(false);
        }
      } else {
        toast.error("You are not authorized to perform this action");
      }
    } catch (error) {
      console.log("Error while Updating product", error);
      toast.error("Error while Updating Product");
    }
  };
  return (
    <div className="CreateProduct">
    <div className="formClass">
      <form className="form" onSubmit={handleSubmit}>
        <div className="formHead">
          <h2>Create Product:</h2>
          <h3 onClick={()=>setEditFormShow(false)} >X</h3>
        </div>
        <div className="form-group">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            className="form-control"
            id="productName"
            name='productName'
            placeholder="Enter Product Name"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            className="form-control"
            id="description"
            name='description'
            placeholder="Enter Short Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            className="form-control"
            id="price"
            name='price'
            placeholder="Enter Product Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="availability">Availability:</label>
          <input
            type="number"
            className="form-control"
            id="availability"
            name='availability'
            placeholder="Enter Product Availability"
            value={formData.availability}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="brand">Brand:</label>
          <input
            type="text"
            className="form-control"
            id="brand"
            name='brand'
            placeholder="Enter Product Brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Choose Category:</label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
             <option value="" disabled>Select a category</option>
            {categories.map((cate) => (
              cate.name !== 'All' && (
                <option key={cate.id} value={cate.name}>{cate.name}</option>
              )
            ))}
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
  )
}

export default EditProduct