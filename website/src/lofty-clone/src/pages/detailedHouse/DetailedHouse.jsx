import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { FaCircleExclamation } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../utils/api";
import Skeleton from 'react-loading-skeleton'
import TokenModal from "../../components/tokenTransaction/TokenModal";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import 'react-loading-skeleton/dist/skeleton.css'
import "./detailedHouse.scss";

const DetailedHouse = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);
  const [isSellModalOpen, setSellModalOpen] = useState(false);
  const currentUser = useSelector(state => state.user)
  const [activeTab, setActiveTab] = useState('details');
  const detailsRef = useRef(null);
  const documentsRef = useRef(null);
  const orderBookRef = useRef(null);
  const [tokenOffers, setTokenOffers] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchProperty = async () => {
      try {
        let response = await axios.get(BASE_URL + `/properties/detail/${propertyId}`);
        setProperty(response.data.data.property);
        setToken(response.data.data.token);
        console.log(response.data.data)
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(BASE_URL + `/chains/offers`);
        const currentOffers = response.data.data.filter(offer => offer.token_id === token.id && offer.is_active);
        setTokenOffers(currentOffers);
        console.log(currentOffers);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOffers();
  }, [token]);

  const openBuyModal = () => {
    if (!currentUser.user) {
      navigate("/sign-in");
    }
    setBuyModalOpen(true);
  };

  const closeBuyModal = () => {
    setBuyModalOpen(false);
  };

  const openSellModal = () => {
    setSellModalOpen(true);
  };

  const closeSellModal = () => {
    setSellModalOpen(false);
  };

  const handleTabClick = (tabName, tabRef) => {
    setActiveTab(tabName);

    // Remove 'isClicked' class from all tabs
    detailsRef.current.classList.remove('isClicked');
    documentsRef.current.classList.remove('isClicked');
    orderBookRef.current.classList.remove('isClicked');

    // Add 'isClicked' class to the clicked tab
    tabRef.current.classList.add('isClicked');
  };


  return (
    <div className="detailedHouse">
      <div className="imgContainer">
        <img
          src={property?.propertyImageUrl || <Skeleton count={5} />}
          alt=""
        />
      </div>
      <ContentWrapper>
        <div className="textContainer">
          <div className="statusTag">
            <span>Active</span>
          </div>
          <div className="title">
            <h1>{loading ? <Skeleton /> : property?.address}</h1>
            <span>{loading ? <Skeleton /> : property?.propertyDistrict + " District, HCM City"}</span>
          </div>
          <ul className="navItems">
            <li>
              <span ref={detailsRef} className={activeTab === 'details' ? 'isClicked' : ""} onClick={() => handleTabClick('details', detailsRef)}>Details</span>
            </li>
            <li>
              <span ref={documentsRef} className={activeTab === 'documents' ? 'isClicked' : ""} onClick={() => handleTabClick('documents', documentsRef)}>Documents</span>
            </li>
            <li>
              <span ref={orderBookRef} className={activeTab === 'orderBook' ? 'isClicked' : ""} onClick={() => handleTabClick('orderBook', orderBookRef)}>Order book</span>
            </li>
          </ul>
          <div className="line"></div>
          <div style={{display: activeTab === 'details' ? 'flex' : 'none'}} className="infoItems">
            <div className="infoItem">
              <span>{loading ? <Skeleton /> : property?.area} m<sup>2</sup></span>
            </div>
            <div className="infoItem">
              <span>{loading ? <Skeleton /> : property?.totalFloor} floor</span>
            </div>
            <div className="infoItem">
              <span>{loading ? <Skeleton /> : property?.numOfBedroom} bedroom</span>
            </div>
            <div className="infoItem">
              <span>{loading ? <Skeleton /> : property?.numOfWc} wc</span>
            </div>
          </div>
          <div style={{display: activeTab === 'documents' ? 'flex' : 'none'}}  className="documents">
            <a href={property?.propertyDocumentUrl}>{property?.propertyDocumentUrl}</a>
          </div>
          <div style={{display: activeTab === 'orderBook' ? 'flex' : 'none'}} className="orderBook">
            <h3>Open orders</h3>
            <div className="items">
              <div className="item">
                <h4>Price (USD)</h4>
                {tokenOffers && tokenOffers.map(offer => offer.is_buy==="true" && <span>{Number(offer.at_price).toFixed(2)}</span>)}
                {/* <span>50.13</span>
                <span>50.13</span>
                <span>50.13</span>
                <span>50.13</span>
                <span>50.13</span>
                <span>50.13</span> */}
              </div>
              <div className="item">
                <h4>Buy order</h4>
                {tokenOffers && tokenOffers.map(offer => offer.is_buy==="true" && <span>{offer.quantity}</span>)}                
                {/* <span>5 Tokens</span>
                <span>5 Tokens</span>
                <span>5 Tokens</span>
                <span>5 Tokens</span>
                <span>5 Tokens</span>
                <span>5 Tokens</span> */}
              </div>
              <div className="item">
                <h4>Price (USD)</h4>
                {tokenOffers && tokenOffers.map(offer => offer.is_buy==="false" && <span>{Number(offer.at_price).toFixed(2)}</span>)}
                {/* <span>50.13</span>
                <span>50.13</span>
                <span>50.13</span>
                <span>50.13</span>
                <span>50.13</span>
                <span>50.13</span> */}
              </div>
              <div className="item">
                <h4>Sell order</h4>
                {tokenOffers && tokenOffers.map(offer => offer.is_buy==="false" && <span>{offer.quantity}</span>)}                                
                {/* <span>5 Tokens</span>
                <span>5 Tokens</span>
                <span>5 Tokens</span>
                <span>5 Tokens</span>
                <span>5 Tokens</span>
                <span>5 Tokens</span> */}
              </div>
            </div>
          </div>
          <div style={{display: activeTab === 'details' ? '' : 'none'}}  className="description">
            <h3>About the property</h3>
            <div className="line"></div>
            <div className="content">
              <p>
                {loading ? <Skeleton /> : property?.description}
              </p>
            </div>
          </div>
        </div>
        <div className="emptyBox"></div>
        <div className="stickyBox">
          <div className="boxHeader">
            <div className="title">
              <div className="titleLeft">
                <span>% Total tokens:</span>
                <FaCircleExclamation />
              </div>
              <div className="titleRight">
                <span>$</span>
                <span>{loading ? <Skeleton /> : token?.token_price}</span>
              </div>
            </div>

            <ProgressBar
              completed={100}
            />
            <div className="boxHeaderBottom">
              <span>{loading ? <Skeleton /> : token?.quantity} tokens</span>
            </div>
          </div>
          <div className="boxBody">
            <div className="bodyItem">
              <button type="button" onClick={openBuyModal}>Buy</button>
              <button disabled={!currentUser.user} type="button" onClick={openSellModal}>Sell</button>
            </div>

            <TokenModal
              token={token}
              isOpen={isBuyModalOpen}
              onClose={closeBuyModal}
              actionType="buy"
              toast={toast}
            />

            <TokenModal
              token={token}
              isOpen={isSellModalOpen}
              onClose={closeSellModal}
              actionType="sell"
              toast={toast}
            />
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
        </div>
      </ContentWrapper>
    </div>
  );
};

export default DetailedHouse;
