import { FaRegQuestionCircle } from "react-icons/fa";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./tokenOwnership.scss";
import { TokenCard } from "../../components/imports";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/api";

const TokenOwnership = () => {
  const [tokenOwnership, setTokenOwnership] = useState(null);
  const currentUser = useSelector(state => state.user);

  useEffect(() => {
    const fetchTokenOwnership = async () => {
      try {
        const response = await axios.get(BASE_URL + `/chains/${currentUser.user.id}/tokenOwnership`);
        setTokenOwnership(JSON.parse(response.data.data));
      } catch (err) {
        console.log(err);
      }
    }
    fetchTokenOwnership();
  }, [currentUser?.user]);

  console.log(tokenOwnership);
    
  return (
    <div className="tokenOwnership">
      <ContentWrapper>
        <div className="box">
          <div className="boxLeft">
            <h2>Current Rent Balance (USD)</h2>
            <span>$31.98</span>
            <h2>Current Gift Balance: <span>$1.03 <FaRegQuestionCircle /></span></h2>
          </div>
          <div className="boxRight">
            <button type="button">Withdraw</button>
          </div>
        </div>
        <div className="items">
          {tokenOwnership && tokenOwnership?.map((item, index) => <TokenCard key={index} token={item} />)}
        </div>
      </ContentWrapper>
    </div>
  )
}

export default TokenOwnership