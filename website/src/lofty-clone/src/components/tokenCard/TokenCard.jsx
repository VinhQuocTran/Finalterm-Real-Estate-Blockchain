import { FaRegQuestionCircle } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { AiOutlineFilePdf } from "react-icons/ai";
import "./tokenCard.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/api";

const TokenCard = ({ token }) => {
  const [blockchainUser, setBlockchainUser] = useState(null);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchBlockchainUser = async () => {
      const response = await axios.get(BASE_URL + `/chains/users/${token.user_id}`);
      setBlockchainUser(JSON.parse(response.data.data));
    }

    const fetchPropertyByTokenId = async () => {
      const suffixId = token.token_id.split("_")[1];
      console.log(BASE_URL + `/properties/PROPERTY_${suffixId}`);
      const response = await axios.get(BASE_URL + `/properties/PROPERTY_${suffixId}`);
      setProperty(response.data.data);
    }

    fetchBlockchainUser();
    fetchPropertyByTokenId();
  }, [token]);

  console.log(property);

  return (
    <div className="tokenCard">
      <div className="itemImg">
        <img src={property?.propertyImageUrl} alt="" />
      </div>
      <div className="itemInfo">
        <div className="infoTop">
          <h1>{property?.address}, {property?.propertyDistrict} District, HCM City</h1>
          {/* <div className="infoExtra">
            <span><FaArrowUp /> 9.27%</span>
            <FaRegQuestionCircle />
            <AiOutlineFilePdf />
          </div> */}
        </div>
        <div className="infoBottom">
          <div className="infoLeft">
            <div className="infoDetail">
              <h3>Own token</h3>
              <p>${token?.own_number} {/*<span>of  (0.11%)</span>*/}</p>
            </div>
            <div className="infoDetail">
              <h3>Token price</h3>
              <p>${token?.token_price}</p>
            </div>
            {/* <div className="infoDetail">
              <h3>Current</h3>
              <p>$164.16</p>
            </div> */}
          </div>
          {/* <div className="infoRight">
            <div className="infoDetail">
              <h3>Current rent balance</h3>
              <p>6.94%</p>
            </div>
            <div className="infoDetail">
              <h3>Total rent earned</h3>
              <p>$164.16</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default TokenCard