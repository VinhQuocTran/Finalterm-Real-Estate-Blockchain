import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Select from 'react-select'
import { IoMdClose } from "react-icons/io";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { PropertyCard } from "../../components/imports";
import NewPropertyFormInput from "../../components/newPropertyFormInput/NewPropertyFormInput";
import "./myproperty.scss";
import { BASE_URL } from "../../utils/api";

const MyProperty = () => {
  const currentUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [userProperties, setUserProperties] = useState(null);
  const newPropertyModalRef = useRef();
  const verifyPropertyModalRef = useRef();
  const [isNewPropertyModalOpened, setIsNewPropertyModalOpened] = useState(false);
  const [isVerifyPropertyModalOpened, setIsVerifyPropertyModalOpened] = useState(false);
  const [values, setValues] = useState({
    address: "",
    district: "",
    numOfBedroom: "",
    numOfWc: "",
    totalFloor: "",
    area: "",
    propertyImageUrl: "",
    propertyDocumentUrl: "",
    description: ""
  });

  const inputs = [
    {
      id: 1,
      name: "address",
      type: "text",
      label: "Address",
      errorMessage: "Address is required",
      required: true
    },
    {
      id: 2,
      name: "numOfBedroom",
      type: "number",
      min: "1",
      label: "Num of bedroom",
      errorMessage: "Num of bedroom is required",
      required: true
    },
    {
      id: 3,
      name: "numOfWc",
      type: "number",
      min: "1",
      label: "Num of WC",
      errorMessage: "Num of WC is required",
      required: true
    },
    {
      id: 4,
      name: "totalFloor",
      type: "number",
      min: "1",
      label: "Total of floor",
      errorMessage: "Total of floor is required",
      required: true
    },
    {
      id: 5,
      name: "area",
      type: "number",
      min: "1",
      label: "Area",
      errorMessage: "Area is required",
      required: true
    },
    {
      id: 6,
      name: "propertyImageUrl",
      type: "text",
      label: "Property image (jpeg,jpg,png)",
      errorMessage: "Property image is required",
      required: true
    },
    {
      id: 7,
      name: "propertyDocumentUrl",
      type: "text",
      label: "Property document (pdf)",
      errorMessage: "Property document is required",
      required: true
    },
    {
      id: 8,
      name: "description",
      type: "text",
      label: "Description",
      errorMessage: "Description is required",
      required: true
    }
  ];

  const districtOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: 'Binh Thanh', label: 'Binh Thanh' },
    { value: 'Thu Duc', label: 'Thu Duc' },
    { value: 'Go Vap', label: 'Go Vap' },
    { value: 'Phu Nhuan', label: 'Phu Nhuan' },
    { value: 'Tan Binh', label: 'Tan Binh' },
    { value: 'Tan Phu', label: 'Tan Phu' },
    { value: 'Binh Tan', label: 'Binh Tan' }
  ]

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

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

  const handleNewPropertySubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    data.append('accountId', currentUser.id);
    try {
      const response = await axios.post(BASE_URL + "/properties", Object.fromEntries(data), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Create new property successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      toast.error('Internal Server Error!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    const fetchCurrentUserProperties = async () => {
      try {
        const response = await axios.get(BASE_URL + `/properties?accountId=${currentUser.id}`);
        setUserProperties(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCurrentUserProperties();
  }, [currentUser.id]);

  return (
    <div className="myProperty">
      <ContentWrapper>
        <div className="buttons" onClick={handleNewPropertyModalClick}>
          <button type="button">Create new property</button>
        </div>
        <div className="line"></div>
        <div className="propertyContainer">
          {userProperties &&
            userProperties.map((item, index) =>
              <PropertyCard key={index} property={item} onClick={handleVerifyPropertyClick} />
            )
          }
        </div>
      </ContentWrapper>
      <div className="newPropertyModal" ref={newPropertyModalRef} onSubmit={handleNewPropertySubmit}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <form action="">
            <div className="contentTop">
              <h1>New property</h1>
              <IoMdClose onClick={handleNewPropertyModalClick} />
            </div>
            <div className="inputForm">
              <label htmlFor="district">District</label>
              <Select name="district" options={districtOptions} />
              <span>District is required</span>
            </div>
            {inputs.map((item) => <NewPropertyFormInput key={item.id} {...item} value={values[item.name]} onChange={onChange} />)}
            <div className="submitBtn">
              <button type="submit">Submit</button>
            </div>
          </form>
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>    
  )
}

export default MyProperty