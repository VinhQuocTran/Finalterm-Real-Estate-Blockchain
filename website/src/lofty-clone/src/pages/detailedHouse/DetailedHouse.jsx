import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { FaCircleExclamation } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/api";
import Skeleton from 'react-loading-skeleton'
import TokenModal from "../../components/tokenTransaction/TokenModal";
import { useSelector } from "react-redux";
import 'react-loading-skeleton/dist/skeleton.css'
import "./detailedHouse.scss";
import TokenModal from "../../components/tokenTransaction/TokenModal";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const DetailedHouse = () => {
  const currentUser = useSelector(state => state.user);
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [token, setToken] = useState(null);
  // const [tokenOwnerShip, setTokenOwnerShip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);
  const [isSellModalOpen, setSellModalOpen] = useState(false);
  const currentUser = useSelector(state => state.user)
  const jwt = currentUser.token;
  const isLoggedIn = jwt !== null;
  useEffect(() => {
    setLoading(true);
    const fetchProperty = async () => {
      try {
        let response = await axios.get(BASE_URL + `/properties/detail/${propertyId}`);
        setProperty(response.data.data.property);
        setToken(response.data.data.token);
        console.log(response.data.data)
        // setTokenOwnerShip(response.data.data.tokenOwnerShip[0]);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProperty();
  }, [propertyId]);

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
              <span>Details</span>
            </li>
            <li>
              <span>Documents</span>
            </li>
          </ul>
          <div className="line"></div>
          <div className="infoItems">
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
          <div className="description">
            <h3>About the Property</h3>
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
