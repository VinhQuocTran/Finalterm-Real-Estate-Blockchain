import { useEffect, useRef, useState } from "react";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import { MdGridView } from "react-icons/md";
import { PiTextColumnsBold } from "react-icons/pi";
import "./filterSection.scss";

const FilterSection = ({districts, setDistricts, areaValue, setAreaValue, tokenValue, setTokenValue}) => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const rangeAreaValue = useRef();
  const rangeTokenValue = useRef();
  const locationListRef = useRef();
  const locationInputBox = useRef();

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
    setDistricts(e.target.textContent);
    locationListRef.current.style.maxHeight = 0;
    locationListRef.current.style.boxShadow = 0;
    locationInputBox.current.click();
  };

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
                <span className="filterItemTitle">District</span>
                <div className="dropdown">
                  <div
                    className={`input-box ${isLocationOpen ? "open" : ""}`}
                    ref={locationInputBox}
                    onClick={() =>
                      handleClick(isLocationOpen, setIsLocationOpen, locationListRef, locationInputBox)
                    }
                  >
                    {districts}
                  </div>
                  <div className="list" ref={locationListRef}>
                    <input type="radio" name="location" id="drop1" defaultChecked />
                    <label htmlFor="drop1" onClick={handleLocationChange}>
                      All districts
                    </label>

                    <input type="radio" name="location" id="drop2" />
                    <label htmlFor="drop2" onClick={handleLocationChange}>
                      1,2,3
                    </label>

                    <input type="radio" name="location" id="drop3" />
                    <label htmlFor="drop3" onClick={handleLocationChange}>
                      4,5,6
                    </label>

                    <input type="radio" name="location" id="drop4" />
                    <label htmlFor="drop4" onClick={handleLocationChange}>
                      7,8,9
                    </label>

                    <input type="radio" name="location" id="drop5" />
                    <label htmlFor="drop5" onClick={handleLocationChange}>
                      10,11,12
                    </label>

                    <input type="radio" name="location" id="drop6" />
                    <label htmlFor="drop6" onClick={handleLocationChange}>
                      Binh Thanh, Thu Duc, Go Vap
                    </label>

                    <input type="radio" name="location" id="drop7" />
                    <label htmlFor="drop7" onClick={handleLocationChange}>
                      Phu Nhuan, Tan Binh
                    </label>

                    <input type="radio" name="location" id="drop8" />
                    <label htmlFor="drop8" onClick={handleLocationChange}>
                      Tan Phu, Binh Tan
                    </label>               
                  </div>
                </div>
              </div>
              {/* <div className="filterItem">
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
              </div> */}
              <div className="filterItem">
                <span className="filterItemTitle">Area of property</span>
                <span className="filterItemTitle">(0 - {areaValue + ' m\u00B2'})</span>
                <div className="range">
                  <div className="slider">
                    <div className="rangeValue" ref={rangeAreaValue}>
                    </div>
                    <input name="area" type="range" min={0} max={500} step={1} value={areaValue} onChange={(e) => setAreaValue(parseInt(e.target.value))} />
                  </div>
                  <div className="limitValues">
                    <span>0</span>
                    <span>500</span>
                  </div>
                </div>
              </div>
              {/* <div className="filterItem">
                <span className="filterItemTitle">Token of property</span>
                <span className="filterItemTitle">({tokenValue} )</span>
                <div className="range">
                  <div className="slider">
                    <div className="rangeValue" ref={rangeTokenValue}>
                    </div>
                    <input name="area" type="range" min={0} max={5000} step={1} value={tokenValue} onChange={(e) => setTokenValue(parseInt(e.target.value))} />
                  </div>
                  <div className="limitValues">
                    <span>0</span>
                    <span>2000</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>        
      </ContentWrapper>
    </div>
  );
};

export default FilterSection;
