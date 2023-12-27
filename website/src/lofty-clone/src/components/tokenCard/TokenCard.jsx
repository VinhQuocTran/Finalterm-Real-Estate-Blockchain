// import { FaRegQuestionCircle } from "react-icons/fa";
// import { FaArrowUp } from "react-icons/fa";
// import { AiOutlineFilePdf } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/api";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import "./tokenCard.scss";

const TokenCard = ({ token }) => {
  const [blockchainUser, setBlockchainUser] = useState(null);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchBlockchainUser = async () => {
      const response = await axios.get(BASE_URL + `/chains/users/${token?.user_id}`);
      setBlockchainUser(JSON.parse(response.data.data));
    }

    const fetchPropertyByTokenId = async () => {
      const suffixId = token?.token_id.split("_")[1];
      const response = await axios.get(BASE_URL + `/properties/PROPERTY_${suffixId}`);
      setProperty(response.data.data);
    }

    fetchBlockchainUser();
    fetchPropertyByTokenId();
  }, [token]);

  console.log(blockchainUser);

  return (
    <div className="tokenCard">
      <div className="itemImg">
        <img src={property?.propertyImageUrl || <Skeleton />} alt="" />
      </div>
      <div className="itemInfo">
        <div className="infoTop">
          <h1>{property?.address || <Skeleton />}, {property?.propertyDistrict || <Skeleton />} District, HCM City</h1>
          {/* <div className="infoExtra">
            <span><FaArrowUp /> 9.27%</span>
            <FaRegQuestionCircle />
            <AiOutlineFilePdf />
          </div> */}
        </div>
        <div className="infoBottom">
          <div className="infoLeft">
            <div className="infoDetail">
              <h3>Token owned</h3>
              <p>{token?.own_number + ` of ${token?.token_supply}` || <Skeleton />}
                <span>
                  ({((Number(token?.own_number) / token?.token_supply) * 100).toFixed(2)}%)
                </span>
              </p>
            </div>
            <div className="infoDetail">
              <h3>Price per token</h3>
              <p>${token?.token_price || <Skeleton />}</p>
            </div>
            <div className="infoDetail">
              <h3>Token balance</h3>
              <p>${(Number(token?.own_number) * token?.token_price)} <span>of {blockchainUser?.token_balance || <Skeleton />} ({((token?.own_number * token?.token_price / blockchainUser?.token_balance) * 100).toFixed(2)}%)</span></p>
            </div>
          </div>
          <div className="infoRight">
            <div className="infoDetail">
              <h3>Current rent balance</h3>
              <p>${token?.total_current_balance.toFixed(2) || <Skeleton />}</p>
            </div>
            <div className="infoDetail">
              <h3>Total rent earned</h3>
              <p>${token?.total_earned.toFixed(2) || <Skeleton />}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenCard