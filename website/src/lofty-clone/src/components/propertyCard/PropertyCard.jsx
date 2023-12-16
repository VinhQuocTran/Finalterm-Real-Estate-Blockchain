import "./propertyCard.scss";

const PropertyCard = ({ property, onClick, onEditModalClick }) => {

  return (
    <div className="propertyCard">
      <div className="boxTop">
        <img
          src={property.propertyImageUrl}
          alt=""
        />
      </div>
      <div className="boxBody">
        <div className="title">{property.address}, {property.district} District, HCM City</div>
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
            <input type="checkbox" defaultChecked={property.isVerified === "1"} disabled={property.isVerified === "1"} />
            <label>Is verified</label>
          </div>
          <button disabled={property.isVerified === "0" || property.isVerified === "1"} data-id={property.id} type="button" onClick={onClick}>{property.isVerified === "-1" ? "Verify Property" : property.isVerified === "0" ? "Pending..." : "Accepted"}</button>
        </div>
        <div className="checkBoxes">
          <div className="checkBox">
            <input type="checkbox" disabled />
            <label>Is listed</label>
          </div>
          <button disabled={property.isVerified === "-1" || property.isVerified === "0"} type="button">Listing Property</button>
        </div>
        <button data-id={property.id} onClick={onEditModalClick}>Edit</button>
      </div>      
    </div>
  );
};

export default PropertyCard;
