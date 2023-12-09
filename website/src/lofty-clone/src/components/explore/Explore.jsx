import ContentWrapper from "../contentWrapper/ContentWrapper";
import HouseCard from "../houseCard/HouseCard";
import "./explore.scss";

const Explore = () => {
  return (
    <div className="explore">
      <ContentWrapper>
        <HouseCard />
        <HouseCard />
        <HouseCard />
        <HouseCard />
        <HouseCard />
        <HouseCard />
        <HouseCard />
        <HouseCard />
        <HouseCard />
      </ContentWrapper>
    </div>
  )
}

export default Explore