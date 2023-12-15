import { FaRegQuestionCircle } from "react-icons/fa";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./tokenOwnership.scss";
import { TokenCard } from "../../components/imports";

const TokenOwnership = () => {
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
          <TokenCard />
          <TokenCard />
          <TokenCard />
          <TokenCard />
          <TokenCard />
          <TokenCard />
          <TokenCard />
          <TokenCard />
          <TokenCard />
        </div>
      </ContentWrapper>
    </div>
  )
}

export default TokenOwnership