import Banner from "../../components/banner/Banner";
import FilterSection from "../../components/filterSection/FilterSection";
import Explore from "../../components/explore/Explore";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      <Banner />
      <FilterSection />
      <Explore />
    </div>
  )
}

export default Home