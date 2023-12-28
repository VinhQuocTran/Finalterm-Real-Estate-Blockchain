import { useNavigate } from "react-router-dom";
import "./propertyCard.scss";

const PropertyCard = ({ property, onClick, onEditModalClick, onListingPropertyClick }) => {
  const navigate = useNavigate();

  return (
    <div className="propertyCard">
      <div className="boxTop">
        <img
          src={property.propertyImageUrl}
          alt=""
        />
      </div>
      <div className="boxBody">
        <div className="title">{property.address}, {property.propertyDistrict} District, HCM City</div>
        <div className="details">
          <div className="detail">Bedroom: {property.numOfBedroom}</div>
          <div className="detail">WC: {property.numOfWc}</div>
          <div className="detail">Total of Floor: {property.totalFloor}</div>
          <div className="detail">Area: {property.area} (m&sup2;)</div>
        </div>
        <p>
          {property.description}
        </p>
      </div>
      <div className="boxBottom">
        <div className="checkBoxes">
          <div className="checkBox">
            <input type="checkbox" defaultChecked={property.isVerified === "1"} disabled />
            <label>Is verified</label>
          </div>
          <button disabled={property.isVerified === "0" || property.isVerified === "1"} data-id={property.id} type="button" onClick={onClick}>{property.isVerified === "-1" ? "Verify Property" : property.isVerified === "0" ? "Pending..." : "Accepted"}</button>
        </div>
        <div className="checkBoxes">
          <div className="checkBox">
            <input type="checkbox" defaultChecked={property.isListed === "1"} disabled />
            <label>Is listed</label>
          </div>
          <button disabled={property.isVerified === "-1" || property.isVerified === "0" || property.isListed === "0" || property.isListed === "1"} data-id={property.id} type="button" onClick={onListingPropertyClick}>{property.isListed === "-1" ? "List Property" : property.isListed === "0" ? "Pending..." : "Accepted"}</button>
        </div>
        <button className="btnBottom" onClick={() => navigate(`/properties/${property.id}`)} disabled={property.isListed === "-1" || property.isListed === "0"}>View</button>
        <button className="btnBottom" data-id={property.id} onClick={onEditModalClick} disabled={property.isVerified === "0" || property.isVerified === "1"}>Edit</button>
      </div>      
    </div>
  );
};

export default PropertyCard;
