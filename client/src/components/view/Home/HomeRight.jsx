import React from 'react'
import ArrowSlider from '../_templates/ArrowSlider'

const HomeRight = () => {
  return (
    <div className="homerightdiv cont">
    <div className="mainrightcont">
      {/* mainright top */}
      <div className="mainrighttop mainrightdiv">
        <div className="mainrighthead hometext">
        <h2>Popular</h2>
        </div>
        <ArrowSlider />
      </div>
      {/* end main right top */}
      {/* mainright bot */}
      <div className="mainrightbot mainrightdiv">
      <div className="mainrighthead hometext">
        <h2>Best Seller</h2>
        </div>
        <ArrowSlider />
      </div>
      {/* end main right bot */}
    </div>
  </div>
  )
}

export default HomeRight