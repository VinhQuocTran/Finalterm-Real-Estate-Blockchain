import { useRef, useState } from "react";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import { MdGridView } from "react-icons/md";
import { PiTextColumnsBold } from "react-icons/pi";
import "./filterSection.scss";

const FilterSection = () => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPropertyOpen, setIsPropertyOpen] = useState(false);
  const [location, setLocation] = useState("All Markets");
  const [propertyType, setPropertyType] = useState("All Properties");
  const [areaValue, setAreaValue] = useState(0);
  const rangeAreaValue = useRef();
  const [tokenValue, setTokenValue] = useState(0);
  const rangeTokenValue = useRef();
  const locationListRef = useRef();
  const locationInputBox = useRef();
  const propertyTypeListRef = useRef();
  const propertyTypeInputBox = useRef();

  const handleClick = (isOpen, setIsOpen, listRef, inputBox) => {
    setIsOpen(!isOpen);
    if (listRef.current) {
      listRef.current.style.maxHeight = isOpen
        ? null
        : listRef.current.scrollHeight + "px";
      listRef.current.style.boxShadow = isOpen
        ? null
        : "0 1px 2px 0 rgba(0, 0, 0, 0.15),0 1px 3px 1px rgba(0, 0, 0, 0.1)";
    }
    if (inputBox.current) {
      inputBox.current.click();
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.textContent);
    handleClick(locationListRef, locationInputBox);
  };

  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.textContent);
    handleClick(propertyTypeListRef, propertyTypeInputBox);
  };

  // console.log(rangeAreaValue.current.style.left);
  return (
    <div className="filterSection">
      <ContentWrapper>
        <div className="filterContainer">
          <div className="optionItems">
            <PiTextColumnsBold />
            <MdGridView />
          </div>
          <div className="filterContent">
            <div className="leftContent">
              <div className="filterItem">
                <span className="filterItemTitle">Location</span>
                <div className="dropdown">
                  <div
                    className={`input-box ${isLocationOpen ? "open" : ""}`}
                    ref={locationInputBox}
                    onClick={() =>
                      handleClick(isLocationOpen, setIsLocationOpen, locationListRef, locationInputBox)
                    }
                  >
                    {location}
                  </div>
                  <div className="list" ref={locationListRef}>
                    <input type="radio" name="location" id="drop1" defaultChecked />
                    <label htmlFor="drop1" onClick={handleLocationChange}>
                      All Markets
                    </label>

                    <input type="radio" name="location" id="drop2" />
                    <label htmlFor="drop2" onClick={handleLocationChange}>
                      Akron
                    </label>

                    <input type="radio" name="location" id="drop3" />
                    <label htmlFor="drop3" onClick={handleLocationChange}>
                      Atlanta
                    </label>

                    <input type="radio" name="location" id="drop4" />
                    <label htmlFor="drop4" onClick={handleLocationChange}>
                      Berkeley
                    </label>
                  </div>
                </div>
              </div>
              <div className="filterItem">
                <span className="filterItemTitle">Property type</span>
                <div className="dropdown">
                  <div
                    className={`input-box ${isPropertyOpen ? "open" : ""}`}
                    ref={propertyTypeInputBox}
                    onClick={() =>
                      handleClick(isPropertyOpen, setIsPropertyOpen, propertyTypeListRef, propertyTypeInputBox)
                    }
                  >
                    {propertyType}
                  </div>
                  <div className="list" ref={propertyTypeListRef}>
                    <input type="radio" name="propertyType" id="drop5" defaultChecked />
                    <label htmlFor="drop5" onClick={handlePropertyTypeChange}>
                      All Properties
                    </label>

                    <input type="radio" name="propertyType" id="drop6" />
                    <label htmlFor="drop6" onClick={handlePropertyTypeChange}>
                      Single Family
                    </label>

                    <input type="radio" name="propertyType" id="drop7" />
                    <label htmlFor="drop7" onClick={handlePropertyTypeChange}>
                      Multi Family
                    </label>

                    <input type="radio" name="propertyType" id="drop8" />
                    <label htmlFor="drop8" onClick={handlePropertyTypeChange}>
                      Mixed Use
                    </label>
                  </div>
                </div>
              </div>
              <div className="filterItem">
                <span className="filterItemTitle">Area of property</span>
                <span className="filterItemTitle">({areaValue}%)</span>
                <div className="range">
                  <div className="slider">
                    <div className="rangeValue" ref={rangeAreaValue}>
                    </div>
                    <input name="area" type="range" min={0} max={18} step={1} value={areaValue} onChange={(e) => setAreaValue(parseInt(e.target.value))} />
                  </div>
                  <div className="limitValues">
                    <span>0%</span>
                    <span>18%</span>
                  </div>
                </div>
              </div>
              <div className="filterItem">
                <span className="filterItemTitle">Token of property</span>
                <span className="filterItemTitle">({tokenValue}%)</span>
                <div className="range">
                  <div className="slider">
                    <div className="rangeValue" ref={rangeTokenValue}>
                    </div>
                    <input name="area" type="range" min={0} max={18} step={1} value={tokenValue} onChange={(e) => setTokenValue(parseInt(e.target.value))} />
                  </div>
                  <div className="limitValues">
                    <span>0%</span>
                    <span>18%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </ContentWrapper>
    </div>
  );
};

export default FilterSection;
