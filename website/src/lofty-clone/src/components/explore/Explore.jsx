import ContentWrapper from "../contentWrapper/ContentWrapper";
import HouseCard from "../houseCard/HouseCard";
import "./explore.scss";

const Explore = ({ properties }) => {
  return (
    <div className="explore">
      <ContentWrapper>
        {properties && properties.map((item, index) => <HouseCard key={index} property={item} />)}
      </ContentWrapper>
    </div>
  )
}

export default Explore