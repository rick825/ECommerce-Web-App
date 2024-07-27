import React, { useEffect } from 'react';
import './Categories.css';
import { useLocalProvider } from '../../../context/LocalContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Categories = () => {
  const { category, productList, setProductList, setProduct, bag, wishlist, setBag, setWishList } = useLocalProvider();
  const navigate = useNavigate();

  // Handle add product to state for persistence
  const handleProduct = (value) => {
    console.log("Product-->", value);
    setProduct(value);
    navigate('/product');
  }

  useEffect(() => {
    handleGetProducts();
  }, []);

  const handleGetProducts = async () => {
    try {
      const response = await axios.get(`/api/getProductInCategory/${category.name}`);
      if (response.status === 200) {
        setProductList(response.data.products);
        console.log("Selected Category-->", category);
        console.log("Response --->", response.data.products);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("Error while getting Products", error);
      toast.error("Error while getting products");
    }
  }

  // Handle Add to Bag
  const handleAddToBag = (item) => {
    console.log("Added to bag clicked", item);
    if (!bag.some(bagItem => bagItem.productName === item.productName)) {
      setBag((prevBag) => [...prevBag, item]);
      toast.success(`${item.productName} Added to Bag`);
    } else {
      toast.warning(`${item.productName} is already in the Bag`);
    }
  };

  // Handle Add to Wishlist 
  const handleWishList = (item) => {
    console.log("Added to wishlist clicked", item);
    if (!wishlist.some(wishItem => wishItem.productName === item.productName)) {
      setWishList((prevWishList) => [...prevWishList, item]);
      toast.success(`${item.productName} Added to Wishlist`);
    } else {
      toast.warning(`${item.productName} is already in the Wishlist`);
    }
  };

  // Handle Remove from Bag 
  const handleRemoveFromBag = (prod) => {
    console.log("Remove from bag clicked", prod);
    setBag((prevBag) => prevBag.filter((item) => item.productName !== prod.productName));
    toast.success(`${prod.productName} Removed from Bag`);
  }

  // Handle Remove from Wishlist
  const handleRemoveFromWishList = (prod) => {
    console.log("Remove from wishlist clicked", prod);
    setWishList((prevWishList) => prevWishList.filter((item) => item.productName !== prod.productName));
    toast.success(`${prod.productName} Removed from Wishlist`);
  }

  return (
    <div className='categories'>
      <div className="topcate catecont">
        <div className="cate-head head">
          <h2>{category.name}</h2>
        </div>
      </div>
      <div className="botcate catecont">
        <div className="productList">
          {productList.length > 0 ? (
            productList.map((prod) => (
              prod.category === category.name && (
                <div className="prod1 prod" key={prod._id}>
                  <div className="prod-img" onClick={() => handleProduct(prod)}>
                {prod.images.length > 0 ? (<img src={prod.images[0]} alt="" />):(<img src='https://images.unsplash.com/photo-1510074468346-504b4d8a8630?q=80&w=1898&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt=''/>)}
              </div>
              <div className="prod-info">
                <div className="prod-info-top">
                 <h2 onClick={()=>handleProduct(prod)}>{prod.productName}</h2>
                 <h3>₹{prod.price}</h3>
                </div>
                <div className="prod-info-desc">
                 <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia tenetur distinctio repellat? Dolor ipsam deserunt qui.</p>
                 <p><b>5 Star</b></p>
                </div>
                <div className="prod-info-button">
                  {bag.some(bagItem => bagItem.productName === prod.productName) ? (
                    <h2 onClick={()=>handleRemoveFromBag(prod)}>Remove <span>From Bag   →</span></h2>
                  ):( <h2 onClick={()=>handleAddToBag(prod)}>Add <span>to Bag  →</span></h2>)}

                  {wishlist.some(wishItem => wishItem.productName === prod.productName)?(
                    <h2 className='wishlist' onClick={()=>handleRemoveFromWishList(prod)}>Remove <span>from Wishlist </span><img  src="https://img.icons8.com/pastel-glyph/64/like--v2.png" alt="like--v2"/></h2>
                  ):( <h2 className='wishlist' onClick={()=>handleWishList(prod)}>Add <span>to Wishlist </span><img  src="https://img.icons8.com/pastel-glyph/64/like--v2.png" alt="like--v2"/></h2>)}
                </div>
              </div>
            </div>)
           ))):(<p>No Products Available</p>)}
           {/* end product */}
          
         </div>
      </div>
    </div>
  )
}

export default Categories