import { FaRegQuestionCircle } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { AiOutlineFilePdf } from "react-icons/ai";
import "./tokenCard.scss";

const TokenCard = () => {
  return (
    <div className="tokenCard">
      <div className="itemImg">
        <img src="https://images.lofty.ai/images/01HAW7JQ4TGDEPM7WS82A8WKWN/thumb-min.webp" alt="" />
      </div>
      <div className="itemInfo">
        <div className="infoTop">
          <h1>917 Pawneee Ave, Mempis, TN 38109</h1>
          <div className="infoExtra">
            <span><FaArrowUp /> 9.27%</span>
            <FaRegQuestionCircle />
            <AiOutlineFilePdf />
          </div>
        </div>
        <div className="infoBottom">
          <div className="infoLeft">
            <div className="infoDetail">
              <h3>Tokens</h3>
              <p>3 <span>of 2762 (0.11%)</span></p>
            </div>
            <div className="infoDetail">
              <h3>Your CoC Return</h3>
              <p>6.94%</p>
            </div>
            <div className="infoDetail">
              <h3>Tokens</h3>
              <p>$164.16</p>
            </div>
          </div>
          <div className="infoRight">
            <div className="infoDetail">
              <h3>Current rent balance</h3>
              <p>6.94%</p>
            </div>
            <div className="infoDetail">
              <h3>Total rent earned</h3>
              <p>$164.16</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenCard