import React from 'react';
import HomeLeft from './HomeLeft';
import HomeRight from './HomeRight';
import './Home.css';
import { useAdminContext } from '../../../context/AdminContext';

const Home = () => {
  const { homeData } = useAdminContext();

  return (
    <div className="home">
      <HomeLeft />
      <div className="homemiddiv cont">
        {homeData.map((admin, index) => (
          <div className="homemidtop" key={index}>
            <div
              className="homeMainMidTop homecont"
              style={{
                backgroundImage: `url(${admin.homemidtopimage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
            />
            <div className="homeMainMidBot">
              <div
                className="MidBot1 MidBot homecont"
                style={{
                  backgroundImage: `url(${admin.MidBot1})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              >
                <div className="linkText">
                  <h2>Shop Now →</h2>
                </div>
              </div>
              <div
                className="MidBot2 MidBot homecont"
                style={{
                  backgroundImage: `url(${admin.MidBot2})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              >
                <div className="linkText">
                  <h2>Shop Now →</h2>
                </div>
              </div>
              <div
                className="MidBot3 MidBot homecont"
                style={{
                  backgroundImage: `url(${admin.MidBot3})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}
              >
                <div className="linkText">
                  <h2>Shop Now →</h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <HomeRight />
    </div>
  );
};

export default Home;
