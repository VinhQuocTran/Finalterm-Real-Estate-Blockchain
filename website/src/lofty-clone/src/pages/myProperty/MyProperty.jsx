import { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { PropertyCard } from "../../components/imports";
import "./myproperty.scss";

const MyProperty = () => {
  const newPropertyModalRef = useRef();
  const verifyPropertyModalRef = useRef();
  const [isNewPropertyModalOpened, setIsNewPropertyModalOpened] = useState(false);
  const [isVerifyPropertyModalOpened, setIsVerifyPropertyModalOpened] = useState(false);

  const handleNewPropertyModalClick = (e) => {
    newPropertyModalRef.current.style.visibility = !isNewPropertyModalOpened ? 'visible' : 'hidden';
    newPropertyModalRef.current.style.opacity = !isNewPropertyModalOpened ? 1 : 0;
    if (isNewPropertyModalOpened) e.stopPropagation();
    setIsNewPropertyModalOpened(!isNewPropertyModalOpened);
  };

  const handleVerifyPropertyClick = (e) => {
    verifyPropertyModalRef.current.style.visibility = !isVerifyPropertyModalOpened ? 'visible' : 'hidden';
    verifyPropertyModalRef.current.style.opacity = !isVerifyPropertyModalOpened ? 1 : 0;
    if (isVerifyPropertyModalOpened) e.stopPropagation();
    setIsVerifyPropertyModalOpened(!isVerifyPropertyModalOpened);
  };

  return (
    <div className="myProperty">
      <ContentWrapper>
        <div className="buttons" onClick={handleNewPropertyModalClick}>
          <button type="button">Create new property</button>
        </div>
        <div className="line"></div>
        <div className="propertyContainer">
          <PropertyCard onClick={handleVerifyPropertyClick} />
          <PropertyCard onClick={handleVerifyPropertyClick} />
          <PropertyCard onClick={handleVerifyPropertyClick} />
          <PropertyCard onClick={handleVerifyPropertyClick} />
          <PropertyCard onClick={handleVerifyPropertyClick} />
          <PropertyCard onClick={handleVerifyPropertyClick} />
          <PropertyCard onClick={handleVerifyPropertyClick} />
        </div>
      </ContentWrapper>
      <div className="newPropertyModal" ref={newPropertyModalRef} onClick={handleNewPropertyModalClick}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <div className="contentTop">
            <h1>New property</h1>
            <IoMdClose onClick={handleNewPropertyModalClick} />
          </div>
          <div className="inputForm">
            <label htmlFor="address">Address</label>
            <input id="address" type="text" />
          </div>
          <div className="inputForm">
            <label htmlFor="numBedroom">Num of bedroom</label>
            <input id="numBedroom" type="number" min={1} />
          </div>
          <div className="inputForm">
            <label htmlFor="numWC">Num of wc</label>
            <input id="numWC" type="number" min={1} />
          </div>
          <div className="inputForm">
            <label htmlFor="numFloor">Total floor</label>
            <input id="numFloor" type="number" min={0} />
          </div>
          <div className="inputForm">
            <label htmlFor="area">Area (m&sup2;)</label>
            <input id="area" type="number" min={1} />
          </div>
          <div className="inputForm">
            <label htmlFor="image">Image (jpg,jpeg,png)</label>
            <input id="image" type="file" />
          </div>
          <div className="inputForm">
            <label htmlFor="docFile">Document (pdf)</label>
            <input id="docFile" type="text" />
          </div>
          <div className="inputForm">
            <label htmlFor="district">District</label>
            <input id="district" type="text" />
          </div>
          <div className="submitBtn">
            <button type="button">Submit</button>
          </div>
        </div>
      </div>
      <div className="verifyPropertyModal" ref={verifyPropertyModalRef} onClick={handleVerifyPropertyClick}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <div className="contentTop">
            <IoMdClose onClick={handleVerifyPropertyClick} />
          </div>
          <div className="line"></div>
          <h4>Do you understand that all of your provided information about the property will be used for verification process?</h4>
          <div className="line"></div>
          <div className="submitBtn">
            <button type="button">Accept</button>
            <button type="button" onClick={handleVerifyPropertyClick}>No</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProperty