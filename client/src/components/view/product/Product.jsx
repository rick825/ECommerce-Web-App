import React, { useEffect } from 'react';
import './Product.css';
import { useLocalProvider } from '../../../context/LocalContext';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Product = () => {
  const { product, setBag, setWishList, bag, wishlist } = useLocalProvider();
  const navigate = useNavigate();

  useEffect(() => {
      console.log("Product in main-->", product);
  }, []);

  // Handle Add to Bag
  const handleAddToBag = () => {
    console.log("Added to bag clicked", product);
    if (!bag.some(bagItem => bagItem.id === product.id)) {
      setBag((prevbag) => [...prevbag, product]);
      toast.success(`${product.productName} Added to Bag`);
    } else {
      toast.warning(`${product.productName} is already in the Bag`);
    }
  };

  //Handle Remove from bag
  const handleRemoveFromBag = ()=>{
    console.log("Remove from bag clicked", product);
    setBag((prevbag) => prevbag.filter(bagItem => bagItem.id !== product.id))
    toast.success(`${product.productName} Removed from Bag`);
  }

  // Handle Add to Wishlist
  const handleWishList = () => {
    console.log("Added to wishlist clicked");
    if (!wishlist.some(wishItem => wishItem.productName === product.productName)) {
      setWishList((prevWishList) => [...prevWishList, product]);
      toast.success(`${product.productName} Added to wishlist`);
    } else {
      toast.warning(`${product.productName} is already in the wishlist`);
    }
  };


  // Handle Navigation
  const handleNavigation = (value) => {
    navigate(value);
  }

  // Handle Category Navigation
  const handleCateNavigation = (value) => {
    navigate(value);
  }

  return (
    <div className='product main'> 
      <div className="product-left prod-cont">
        <div className="product-left-top">
          <p>
            <span onClick={() => handleNavigation('/home')}>Home </span>›
            <span onClick={() => handleCateNavigation(`/category/${product.category}`)}> {product.category} </span>›
            <span> Product </span>
          </p>
        </div>
        <div className="product-left-mid">
          <div className="product-top-img">
            <Carousel dynamicHeight={true}>
              {product.images.length > 0 ? (product.images.map((img, index) => (
                <div key={index}>
                  <img src={img} alt={`Product ${index + 1}`} />
                </div>
              ))):(<p>No Photos Available</p>)}
            </Carousel>
          </div>
        </div>
      </div>
      <div className="product-right prod-cont">
        <div className="product-right-top">
          <h2>{product.productName}</h2>
          <p>{product.description}</p>
          <p>5⭐ (Reviews)</p>
          <h1>₹{product.price}.00 <span>(Inc. Tax)</span></h1>
        </div>
        <div className="product-right-mid">
          <div className="prodrmid-top">
            {bag.some((prevBag) => prevBag.id === product.id) ? 
            (<button className='addtobag btn' onClick={handleRemoveFromBag}>+ Remove From Bag</button>)
            :(<button className='addtobag btn' onClick={handleAddToBag}>+ Add To Bag</button>) }
            <button className='buynow btn'>Buy Now</button>
          </div>
          <div className="prodrmid-bot">
            <h2 onClick={handleWishList}> ❤ <span> Add to Wishlist</span></h2>
          </div>
        </div>
        <div className="product-right-bot">
          <div className="prodrbot-top">
            <h2>Availability <span>{product.availability ? 'In Stock' : 'Out of Stock'}</span></h2>
          </div>
          <div className="prodrbot-mid">
            <h2>Categories:</h2>
            <p>{product.category}</p>
          </div>
          <div className="prodrbot-bot">
            <h2>Brand:</h2>
            <p>{product.brand}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
