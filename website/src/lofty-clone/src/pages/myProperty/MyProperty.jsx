import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Select from 'react-select'
import { IoMdClose } from "react-icons/io";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { PropertyCard } from "../../components/imports";
import NewPropertyFormInput from "../../components/newPropertyFormInput/NewPropertyFormInput";
import { BASE_URL } from "../../utils/api";
import { fetchUserPropertiesFailure, fetchUserPropertiesStart, fetchUserPropertiesSuccess, updateUserProperties, updateVerifiedPropertyStatus, updateProperty, updateListingPropertyStatus } from "../../redux/userPropertiesSlice";
import FilterItem from "../../components/filterItem/FilterItem";
import { setLightTheme } from "../../redux/themeSlice";
import { updateCashBalance, updateUser } from "../../redux/userSlice";
import "./myproperty.scss";

const MyProperty = () => {
  const [verifyPropertyId, setVerifyPropertyId] = useState(null);
  const [listingPropertyId, setListingPropertyId] = useState(null);
  const currentUser = useSelector((state) => state.user);
  const [cashBalance, setCashBalance] = useState(currentUser.user.cashBalance);
  const currentUserProperties = useSelector((state) => state.userProperties);
  const dispatch = useDispatch();
  const newPropertyModalRef = useRef();
  const verifyPropertyModalRef = useRef();
  const editPropertyModalRef = useRef();
  const listingPropertyModalRef = useRef();
  const [editProperty, setEditProperty] = useState(null);
  const [editDistrict, setEditDistrict] = useState(null);
  const [isNewPropertyModalOpened, setIsNewPropertyModalOpened] = useState(false);
  const [isVerifyPropertyModalOpened, setIsVerifyPropertyModalOpened] = useState(false);
  const [isEditPropertyModalOpened, setIsEditPropertyModalOpened] = useState(false);
  const [isListingPropertyModalOpened, setIsListingPropertyModalOpened] = useState(false);
  const [isInspectionSelectOpened, setIsInspectionSelectOpened] = useState(false);
  const [isValuationSelectOpened, setIsValuationSelectOpened] = useState(false);
  const [values, setValues] = useState({
    address: "",
    propertyDistrict: "",
    numOfBedroom: "",
    numOfWc: "",
    totalFloor: "",
    area: "",
    propertyImageUrl: "",
    propertyDocumentUrl: "",
    description: ""
  });
  const [editValues, setEditValues] = useState({
    address: "",
    propertyDistrict: "",
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

  const totalPrice = useRef();
  const selectedBackgroundCheckServiceId = "BCS_0001";
  const [selectedBackgroundCheckService, setSelectedBackgroundCheckService] = useState("BGC_1");  //"BGC_1";
  const [backgroundCheckServicePrice, setBackgroundCheckServicePrice] = useState("500"); //"500";
  const [inspectionServices, setInspectionServices] = useState(null);
  const [valuationServices, setValuationServices] = useState(null);
  const [selectedInspectionService, setSelectedInspectionService] = useState(null);
  const [selectedValuationService, setSelectedValuationService] = useState(null);
  const [inspectionServicePrice, setInspectionServicePrice] = useState(0);
  const [valuationServicePrice, setValuationServicePrice] = useState(0);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  }

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
    setVerifyPropertyId(e.target.dataset.id);
  };

  const handleEditPropertyModalClick = (e) => {
    if (!isEditPropertyModalOpened) {
      const property = currentUserProperties.userProperties.find(item => item.id === e.target.dataset.id);
      setEditProperty(property);
      setEditValues(property);
      setEditDistrict({ label: property.propertyDistrict, value: property.propertyDistrict });
    }
    editPropertyModalRef.current.style.visibility = !isEditPropertyModalOpened ? 'visible' : 'hidden';
    editPropertyModalRef.current.style.opacity = !isEditPropertyModalOpened ? 1 : 0;
    if (isEditPropertyModalOpened) e.stopPropagation();
    setIsEditPropertyModalOpened(!isEditPropertyModalOpened);
  }

  const handleListingPropertyModalClick = (e) => {
    listingPropertyModalRef.current.style.visibility = !isListingPropertyModalOpened ? 'visible' : 'hidden';
    listingPropertyModalRef.current.style.opacity = !isListingPropertyModalOpened ? 1 : 0;
    if (isListingPropertyModalOpened) e.stopPropagation();
    setIsListingPropertyModalOpened(!isListingPropertyModalOpened);
    setListingPropertyId(e.target.dataset.id);
  }

  const handleNewPropertySubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    data.append('accountId', currentUser.user.id);
    dispatch(fetchUserPropertiesStart());

    try {
      const response = await axios.post(BASE_URL + "/properties", Object.fromEntries(data), {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });

      if (response.data.status === "success") {
        dispatch(updateUserProperties(response.data.data));
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
      }

      // reset form
      setValues({
        address: "",
        propertyDistrict: "",
        numOfBedroom: "",
        numOfWc: "",
        totalFloor: "",
        area: "",
        propertyImageUrl: "",
        propertyDocumentUrl: "",
        description: ""
      });

      // close modal
      newPropertyModalRef.current.style.visibility = 'hidden';
      newPropertyModalRef.current.style.opacity = 0;
      setIsNewPropertyModalOpened(false);

    } catch (err) {
      dispatch(fetchUserPropertiesFailure());
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

  const handleEditPropertySubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    data.append('accountId', currentUser.user.id);
    dispatch(fetchUserPropertiesStart());

    try {
      await axios.patch(BASE_URL + `/properties/${editProperty.id}`, Object.fromEntries(data), {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });

      dispatch(updateProperty({ id: editProperty.id, ...Object.fromEntries(data) }));

      toast.success('Edit new property successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // reset form
      setEditValues({
        address: "",
        propertyDistrict: "",
        numOfBedroom: "",
        numOfWc: "",
        totalFloor: "",
        area: "",
        propertyImageUrl: "",
        propertyDocumentUrl: "",
        description: ""
      });

      // close modal
      editPropertyModalRef.current.style.visibility = 'hidden';
      editPropertyModalRef.current.style.opacity = 0;
      setIsEditPropertyModalOpened(false);

    } catch (err) {
      console.log(err);
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

  const handleListingPropertySubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    data.append('backgroundCheck', selectedBackgroundCheckServiceId);
    data.append('totalPrice', totalPrice.current.dataset.value);

    try {
      const response = await axios.post(BASE_URL + `/custom/${listingPropertyId}/requestListingProperty`, Object.fromEntries(data), {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      console.log(response.data);
      if (response.data.status === "success") {
        console.log(response.data.data);
        const { updatedUser } = response.data.data;

        let user = localStorage.getItem('user');
        user = JSON.parse(user);
        user.cashBalance = JSON.parse(updatedUser).cash_balance;
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(updateListingPropertyStatus(listingPropertyId));
        
      }
      setListingPropertyId(null);

      // close modal
      listingPropertyModalRef.current.style.visibility = 'hidden';
      listingPropertyModalRef.current.style.opacity = 0;
    } catch (err) {
      console.log(err);
    }
  }

  const handleAcceptBtnClick = async () => {
    try {
      const response = await axios.get(BASE_URL + `/custom/${verifyPropertyId}/requestVerify`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });

      if (response.data.status === "success") {
        dispatch(updateVerifiedPropertyStatus(verifyPropertyId));
      }
      setVerifyPropertyId(null);

      // close verify property modal
      verifyPropertyModalRef.current.style.visibility = 'hidden';
      verifyPropertyModalRef.current.style.opacity = 0;
      setIsVerifyPropertyModalOpened(false);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    dispatch(setLightTheme());
  }, []);

  useEffect(() => {
    const fetchInspectionServices = async () => {
      const response = await axios.get(BASE_URL + "/propertyInspectionServices");
      setInspectionServices(response.data.data);
    }

    const fetchValuationServices = async () => {
      const response = await axios.get(BASE_URL + "/propertyValuationServices");
      setValuationServices(response.data.data);
    }

    const fetchBackgroundCheckService = async () => {
      const response = await axios.get(BASE_URL + `/backgroundCheckServices/${selectedBackgroundCheckServiceId}`);
      setSelectedBackgroundCheckService(response.data.data.name);
      setBackgroundCheckServicePrice(response.data.data.feePerTime);
    }

    fetchInspectionServices();
    fetchValuationServices();
    fetchBackgroundCheckService();
  }, []);


  useEffect(() => {
    const fetchCurrentUserProperties = async () => {
      dispatch(fetchUserPropertiesStart());
      try {
        const response = await axios.get(BASE_URL + `/properties?accountId=${currentUser.user.id}`);
        dispatch(fetchUserPropertiesSuccess(response.data.data));
      } catch (err) {
        dispatch(fetchUserPropertiesFailure());
        console.log(err);
      }
    };

    fetchCurrentUserProperties();
  }, [currentUser]);

  return (
    <div className={`myProperty`}>
      <ContentWrapper>
        <div className="buttons">
          <button type="button" onClick={handleNewPropertyModalClick}>Create new property</button>
        </div>
        <div className="line"></div>
        <div className="propertyContainer">
          {currentUserProperties.userProperties &&
            currentUserProperties.userProperties.map((item, index) =>
              <PropertyCard key={index} property={item} onClick={handleVerifyPropertyClick} onEditModalClick={handleEditPropertyModalClick} onListingPropertyClick={handleListingPropertyModalClick} />
            )
          }
        </div>
      </ContentWrapper>
      <div className="newPropertyModal" ref={newPropertyModalRef} onSubmit={handleNewPropertySubmit} onClick={handleNewPropertyModalClick}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <form action="">
            <div className="contentTop">
              <h1>New property</h1>
              <IoMdClose onClick={handleNewPropertyModalClick} />
            </div>
            <label htmlFor="select" className="districtLabel">
              District:
            </label>
            <Select className="selectDistrict" name="propertyDistrict" options={districtOptions} />
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
            <button type="button" onClick={handleAcceptBtnClick}>Accept</button>
            <button type="button" onClick={handleVerifyPropertyClick}>No</button>
          </div>
        </div>
      </div>
      <div className="editPropertyModal" ref={editPropertyModalRef} onSubmit={handleEditPropertySubmit} onClick={handleEditPropertyModalClick}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <form action="">
            <div className="contentTop">
              <h1>New property</h1>
              <IoMdClose onClick={handleEditPropertyModalClick} />
            </div>
            <div className="inputForm">
              <label htmlFor="district">District</label>
              <Select name="propertyDistrict" options={districtOptions} value={editDistrict} onChange={(selectedOption) => setEditDistrict(selectedOption)} required />
              <span>District is required</span>
            </div>
            {inputs.map((item) => <NewPropertyFormInput key={item.id} {...item} value={editValues[item.name]} onChange={onEditChange} />)}
            <div className="submitBtn">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div className="listingPropertyModal" ref={listingPropertyModalRef} onSubmit={handleListingPropertySubmit} onClick={handleListingPropertyModalClick}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <form action="">
            <div className="contentTop">
              <h1>Choose services</h1>
              <IoMdClose onClick={handleListingPropertyModalClick} />
            </div>
            <div className="contentBody">
              <div className="selectBox">
                <FilterItem title={"Property inspection"} inputName={"inspection"} isFilterItemOpen={isInspectionSelectOpened} setIsFilterItemOpen={setIsInspectionSelectOpened} items={inspectionServices} selectedItem={selectedInspectionService} setSelectedItem={setSelectedInspectionService} setServicePrice={setInspectionServicePrice} isNotChange={false} />
                <span className="price">Price: {inspectionServicePrice}$</span>
              </div>
              <div className="selectBox">
                <FilterItem title={"Property valuation"} inputName={"valuation"} isFilterItemOpen={isValuationSelectOpened} setIsFilterItemOpen={setIsValuationSelectOpened} items={valuationServices} selectedItem={selectedValuationService} setSelectedItem={setSelectedValuationService} setServicePrice={setValuationServicePrice} isNotChange={false} />
                <span className="price">Price: {valuationServicePrice}$</span>
              </div>
              <div className="selectBox">
                <FilterItem title={"Property background check"} inputName={"backgroundCheck"} isFilterItemOpen={false} setIsFilterItemOpen={null} items={[selectedBackgroundCheckService]} selectedItem={selectedBackgroundCheckService} setSelectedItem={null} setServicePrice={null} isNotChange={true} />
                <span className="price">Price: {backgroundCheckServicePrice}$</span>
              </div>
            </div>
            <div className="totalPrice">
              <span ref={totalPrice} data-value={parseInt(inspectionServicePrice) + parseInt(valuationServicePrice) + parseInt(backgroundCheckServicePrice)} >Total: {parseInt(inspectionServicePrice) + parseInt(valuationServicePrice) + parseInt(backgroundCheckServicePrice)}$</span>
            </div>
            <div className="submitBtn">
              <button type="submit">Accept</button>
            </div>
          </form>
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