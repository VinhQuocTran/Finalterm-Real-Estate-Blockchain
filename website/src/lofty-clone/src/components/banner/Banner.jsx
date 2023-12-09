import ContentWrapper from "../contentWrapper/ContentWrapper";
import "./banner.scss";

const Banner = () => {
  return (
    <div className="banner">   
      <ContentWrapper>
        <div className="banner-content">
          <h1>Fractional Real Estate Marketplace</h1>
          <h5>Invest in fractions of rental properties listed by third party sellers.</h5>
        </div>
      </ContentWrapper>
      <div className="banner-img">
        <img src="https://www.lofty.ai/static/media/deals-house.612a2ce2fff8af2c877a.png" alt="" />  
      </div>   
    </div>
  )
}

export default Banner