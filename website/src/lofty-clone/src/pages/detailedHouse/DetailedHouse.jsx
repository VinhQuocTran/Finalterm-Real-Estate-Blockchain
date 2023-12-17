import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { FaCircleExclamation } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/api";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import "./detailedHouse.scss";

const DetailedHouse = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchProperty = async () => {
      try {
        const response = await axios.get(BASE_URL + `/properties/${propertyId}`);
        setProperty(response.data.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProperty();
  }, [propertyId]);

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
            <span>{loading ? <Skeleton /> : property?.district + " District, HCM City"}</span>
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
  );
};

export default DetailedHouse;
