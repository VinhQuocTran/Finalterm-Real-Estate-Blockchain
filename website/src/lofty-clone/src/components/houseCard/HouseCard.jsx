import { useNavigate } from "react-router-dom";
import "./houseCard.scss";

const HouseCard = ({property}) => {
  const navigate = useNavigate();

  return (
    <div className="houseCard" onClick={() => navigate(`/properties/${property.id}`)}>
      <div className="imgContainer">
        <img src={property.propertyImageUrl} alt="" />
        {/* <div className="topTag">FEATURED</div>
        <div className="bottomTag">New Listing</div> */}
      </div>
      <div className="textSection">
        <h1>{property.address}</h1>
        <p>{property.propertyDistrict} District, HCM City</p>
        <h2>Area: {property.area} ({'m\u00B2'})</h2>
        {/* <h3>Token: </h3> */}
      </div>
      <div className="textFooter">
        <span>Available: 12,709 tokens at $50</span>
      </div>
    </div>
  )
}

export default HouseCard