import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useAdminContext } from '../../../../context/AdminContext';
import './EditProduct.css';
import AddPhotoForm from './AddPhotoForm';
import axios from 'axios';
import EditProduct from './EditProduct';
import { toast } from 'react-toastify';

const EditSeeProduct = () => {
  const { seeProduct, setSeeProduct } = useAdminContext();
  const [formShow, setFormShow] = useState(false);
  const [editFormShow, setEditFormShow] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const refetchProductData = async () => {
    try {
      const response = await axios.get(`/api/product/${seeProduct._id}`);
      if (response.status === 200) {
        setSeeProduct(response.data.product);
      }
    } catch (error) {
      console.error('Error fetching product data', error);
    }
  };

  const handleDeletePhoto = async () => {
    const updatedImages = seeProduct.images.filter((_, index) => index !== selectedPhotoIndex);
    try {
      const response = await axios.put(`/api/product/${seeProduct._id}`, { images: updatedImages });
      if (response.status === 200) {
        setSeeProduct(response.data.product);
        toast.success("Image Deleted Successfully!!");
      }
    } catch (error) {
      console.error('Error deleting photo', error);
    }
  };

  return (
    <div className="product editProduct">
      <div className="product-left prod-cont product-left-mid">
        {formShow && <AddPhotoForm onUploadComplete={refetchProductData} setFormShow={setFormShow} />}
        {editFormShow && <EditProduct onUploadComplete={refetchProductData} setEditFormShow={setEditFormShow} />}
        <div className="product-top-img">
          <Carousel showThumbs={true} dynamicHeight={true} selectedItem={selectedPhotoIndex} onChange={setSelectedPhotoIndex}>
            {seeProduct && seeProduct.images ? (
              seeProduct.images.map((img, index) => (
                <div key={index}>
                  <img src={img} alt={`Product ${index + 1}`} />
                </div>
              ))
            ) : (
              <p>No Photos Available</p>
            )}
          </Carousel>
          <div className="add-photo-btn" style={{display:"flex", gap:"2rem"}}>
            <button onClick={() => setFormShow(true)}>Add Photo</button>
            {seeProduct.images && seeProduct.images.length > 0 && (
              <button onClick={handleDeletePhoto}>Delete Selected Photo</button>
            )}
          </div>
        </div>
      </div>
      <div className="product-right prod-cont">
        <div className="product-right-top">
          <h2>{seeProduct.productName ? seeProduct.productName : ""}</h2>
          <p>{seeProduct.description}</p>
          <p>5⭐ (Reviews)</p>
          <h1>₹{seeProduct.price}.00 <span>(Inc. Tax)</span></h1>
        </div>
        <div className="product-right-mid">
          <div className="prodrmid-top">
            <button className='addtobag btn' style={{ cursor: 'pointer' }} onClick={() => setEditFormShow(true)}>Edit</button>
          </div>
        </div>
        <div className="product-right-bot">
          <div className="prodrbot-top">
            <h2>Availability <span>In Stock</span></h2>
          </div>
          <div className="prodrbot-mid">
            <h2>Categories:</h2>
            <p>{seeProduct.category}</p>
          </div>
          <div className="prodrbot-bot">
            <h2>Brand:</h2>
            <p>{seeProduct.brand}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSeeProduct;
