import React from 'react'
import { useAdminContext } from '../../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { useLocalProvider } from '../../../context/LocalContext';

const HomeLeft = () => {

  const {categories,explore} = useAdminContext();
  const navigate = useNavigate();
  const {setCategory} = useLocalProvider();

  const handleCateClick = (cate) =>{
     setCategory(cate);
     navigate(`/category/${cate.name}`);
  }

  return (
    <div className="homeleftdiv cont">
      <div className="homeleftdivmain">
        {/* homeleftmain */}
        <div className="homeleftmain1 homeleftmain">
          <div className="homeleftmainhead hometext" >
            <h2>Categories</h2>
          </div>
          <div className="homeleftmainlist">
            <ul>
               {categories.map((cate)=>(
                <li key={cate.id} onClick={()=>handleCateClick(cate)}><a href>{cate.name}</a><p> → </p></li>
               ))}
            </ul>
          </div>
        </div>
        {/* end homeleftmain */}
        <div className="homeleftmain1 homeleftmain">
          <div className="homeleftmainhead hometext" >
            <h2>Explore</h2>
          </div>
          <div className="homeleftmainlist">
            <ul>
                {explore.map((exp)=>(
                  <li key={exp.id} onClick={()=>handleCateClick(exp)}><a href>{exp.name}</a><p> → </p></li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeLeft