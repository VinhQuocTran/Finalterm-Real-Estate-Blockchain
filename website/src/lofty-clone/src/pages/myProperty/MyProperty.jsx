import { useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { PropertyCard } from "../../components/imports";
import "./myproperty.scss";

const MyProperty = () => {
  const newPropertyModalRef = useRef();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenModal = (e) => {
    newPropertyModalRef.current.style.visibility = !isOpenModal ? 'visible' : 'hidden';
    newPropertyModalRef.current.style.opacity = !isOpenModal ? 1 : 0;
    if (isOpenModal) e.stopPropagation();
    setIsOpenModal(!isOpenModal);
  };

  return (
    <div className="myProperty">
      <ContentWrapper>
        <div className="buttons" onClick={handleOpenModal}>
          <button type="button">Create new property</button>
        </div>
        <div className="line"></div>
        <div className="propertyContainer">
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
          <PropertyCard />
        </div>
      </ContentWrapper>
      <div className="newPropertyModal" ref={newPropertyModalRef} onClick={handleOpenModal}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <div className="contentTop">
            <h1>New property</h1>
            <IoMdClose onClick={handleOpenModal} />
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
    </div>
  )
}

export default MyProperty