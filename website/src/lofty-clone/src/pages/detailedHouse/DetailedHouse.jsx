import ProgressBar from "@ramonak/react-progress-bar";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./detailedHouse.scss";
import { FaCircleExclamation } from "react-icons/fa6";

const DetailedHouse = () => {
  return (
    <div className="detailedHouse">
      <div className="imgContainer">
        <img src="https://images.lofty.ai/images/01FYWQCYEFQFTYDWH1YY5D0DR8/01H9S5B7DH9AMX9PP2QT937E0G.webp" alt="" />
      </div>
      <ContentWrapper>
        <div className="textContainer">
          <div className="statusTag">
            <span>Active</span>
          </div>
          <div className="title">
            <h1>621 E Le Claire Rd</h1>
            <span>Eldridge, IA 52748</span>
          </div>
          <ul className="navItems">
            <li><span>Details</span></li>
            <li><span>Documents</span></li>
          </ul>
          <div className="line"></div>
          <div className="infoItems">
            <div className="infoItem">
              <span>7800 sqft</span>
            </div>
            <div className="infoItem">
              <span>Retail</span>
            </div>
          </div>
          <div className="description">
            <h3>About the Property</h3>
            <div className="line"></div>
            <div className="content">
              <p>
                Located in the Quad Cities Metro area, this is a 4-unit retail building built in 2010. The tenants include McDonalds, Domino's, US Cellular, and a Real Estate Office. All tenants are on multi-year triple-net leases (NNN). This means that the tenants pay all the expenses of the property including real estate taxes, building insurance, and maintenance.
                Near new Amazon project
                Amazon is building a 2.9M square foot robotics fulfillment center just a 12 minute drive from this strip mall. The warehouse is expected to open summer of 2024 and create a minimum annual economic impact of $148M to the region.
              </p>
              <p>
                Located in the Quad Cities Metro area, this is a 4-unit retail building built in 2010. The tenants include McDonalds, Domino's, US Cellular, and a Real Estate Office. All tenants are on multi-year triple-net leases (NNN). This means that the tenants pay all the expenses of the property including real estate taxes, building insurance, and maintenance.
                Near new Amazon project
                Amazon is building a 2.9M square foot robotics fulfillment center just a 12 minute drive from this strip mall. The warehouse is expected to open summer of 2024 and create a minimum annual economic impact of $148M to the region.
              </p>
              <p>
                Located in the Quad Cities Metro area, this is a 4-unit retail building built in 2010. The tenants include McDonalds, Domino's, US Cellular, and a Real Estate Office. All tenants are on multi-year triple-net leases (NNN). This means that the tenants pay all the expenses of the property including real estate taxes, building insurance, and maintenance.
                Near new Amazon project
                Amazon is building a 2.9M square foot robotics fulfillment center just a 12 minute drive from this strip mall. The warehouse is expected to open summer of 2024 and create a minimum annual economic impact of $148M to the region.
              </p>
              <p>
                Located in the Quad Cities Metro area, this is a 4-unit retail building built in 2010. The tenants include McDonalds, Domino's, US Cellular, and a Real Estate Office. All tenants are on multi-year triple-net leases (NNN). This means that the tenants pay all the expenses of the property including real estate taxes, building insurance, and maintenance.
                Near new Amazon project
                Amazon is building a 2.9M square foot robotics fulfillment center just a 12 minute drive from this strip mall. The warehouse is expected to open summer of 2024 and create a minimum annual economic impact of $148M to the region.
              </p>
            </div>
          </div>
        </div>
        <div className="emptyBox"></div>
        <div className="stickyBox">
          <div className="boxHeader">
            <div className="title">
              <div className="titleLeft">
                <span>Starting at</span>
                <FaCircleExclamation />
              </div>
              <div className="titleRight">
                <span>$</span>
                <span>50.00</span>
              </div>
            </div>

            <ProgressBar completed={60} />

            <div className="boxHeaderBottom">
              <span>12,696 tokens left</span>
            </div>
          </div>
          <div className="boxBody">
            <div className="bodyItem">
              <div className="itemLeft">
                <span>Projected Annual Return</span>
                <FaCircleExclamation />
              </div>
              <div className="itemRight">
                <span>9.6%</span>
              </div>
            </div>
            <div className="bodyItem">
              <div className="itemLeft">
                <span>Projected Rental Yield</span>
                <FaCircleExclamation />
              </div>
              <div className="itemRight">
                <span>6%</span>
              </div>
            </div>
            <div className="bodyItem">
              <div className="itemLeft">
                <span>Rental Yield</span>
                <FaCircleExclamation />
              </div>
              <div className="itemRight">
                <span>6%</span>
              </div>
            </div>
            <div className="bodyItem">
              <button type="button">Buy</button>
              <button type="button">Sell</button>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  )
}

export default DetailedHouse