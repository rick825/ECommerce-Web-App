import React, { createContext, useState, useContext, useEffect } from "react";

const LocalContext = createContext();

export const LocalProvider = ({ children }) => {
  const [local, setLocal] = useState([]);

  const getItemFromStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage`, error);
      return defaultValue;
    }
  };

  const [bag, setBag] = useState(() => getItemFromStorage('bag', []));
  const [wishlist, setWishList] = useState(() => getItemFromStorage('wishlist', []));
  const [category, setCategory] = useState(() => getItemFromStorage('selectedCategory', ''));
  const [product, setProduct] = useState(() => getItemFromStorage('selectedProduct', ''));
  const [productList, setProductList] = useState(()=> getItemFromStorage('productList',[]));
  const [orderList,setOrderList] = useState(()=>getItemFromStorage('orderList',[]))

  useEffect(()=>{
   localStorage.setItem('orderList', JSON.stringify(orderList))
   console.log("orderList--->",orderList);
  },[orderList])

  useEffect(() => {
    localStorage.setItem('bag', JSON.stringify(bag));
  }, [bag]);

  useEffect(()=>{
   localStorage.setItem('productList', JSON.stringify(productList));
  },[productList])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
  }, [product]);

  useEffect(() => {
    localStorage.setItem("selectedCategory", JSON.stringify(category));
  }, [category]);


  return (
    <LocalContext.Provider value={{ local, setLocal, category, setCategory, product, setProduct, productList, setProductList, bag, setBag, wishlist, setWishList, orderList, setOrderList }}>
      {children}
    </LocalContext.Provider>
  );
};

export const useLocalProvider = () => useContext(LocalContext);
