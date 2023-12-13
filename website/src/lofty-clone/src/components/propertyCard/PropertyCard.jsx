import "./propertyCard.scss";

const PropertyCard = (props) => {

  return (
    <div className="propertyCard">
      <div className="boxTop">
        <img
          src="https://images.lofty.ai/images/01FYWQCYEFQFTYDWH1YY5D0DR8/thumb-min.webp"
          alt=""
        />
      </div>
      <div className="boxBody">
        <div className="title">621 E Le Claire Rd</div>
        <div className="details">
          <div className="detail">Bedroom: 4</div>
          <div className="detail">WC: 2</div>
          <div className="detail">Total of Floor: 4</div>
          <div className="detail">Area: 243 (m&sup2;)</div>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </p>
      </div>
      <div className="boxBottom">
        <div className="checkBoxes">
          <div className="checkBox">
            <input type="checkbox" disabled />
            <label>Is verified </label>
          </div>
          <div className="checkBox">
            <input type="checkbox" disabled />
            <label>Is listed </label>
          </div>
        </div>
        <div className="buttons">
          <button type="button" onClick={props.onClick}>Verify Property</button>
          <button type="button">Listing Property</button>
        </div>
      </div>      
    </div>
  );
};

export default PropertyCard;
