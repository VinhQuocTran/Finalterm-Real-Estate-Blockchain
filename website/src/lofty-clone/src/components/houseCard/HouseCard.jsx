import "./houseCard.scss";

const HouseCard = () => {
  return (
    <div className="houseCard">
      <div className="imgContainer">
        <img src="https://images.lofty.ai/images/01FYWQCYEFQFTYDWH1YY5D0DR8/thumb-min.webp" alt="" />
        <div className="topTag">FEATURED</div>
        <div className="bottomTag">New Listing</div>
      </div>
      <div className="textSection">
        <h1>621 E Le Claire Rd</h1>
        <p>Eldridge, IA 52748</p>
        <h2>6.0% Projected Rental Yield</h2>
        <h3>8.6% Projected Annual Return</h3>
      </div>
      <div className="textFooter">
        <span>Available: 12,709 tokens at $50</span>
      </div>
    </div>
  )
}

export default HouseCard