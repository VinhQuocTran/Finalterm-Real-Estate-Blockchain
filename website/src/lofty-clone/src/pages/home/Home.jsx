import axios from "axios";
import { useEffect, useState } from "react";
import Banner from "../../components/banner/Banner";
import FilterSection from "../../components/filterSection/FilterSection";
import Explore from "../../components/explore/Explore";
import { BASE_URL } from "../../utils/api";
import "./home.scss";

const Home = () => {
  const [properties, setProperties] = useState(null);
  const [districts, setDistricts] = useState("All districts");
  const [areaValue, setAreaValue] = useState(0);
  const [tokenValue, setTokenValue] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(BASE_URL + '/properties?isVerified=1' +
          `${districts !== "All districts" ? '&district=' + districts : ''}` +
          `${areaValue !== 0 ? '&area[lte]=' + areaValue : ''}`
        );
        setProperties(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProperties();
  }, [districts, areaValue]);


  return (
    <div className="home">
      <Banner />
      <FilterSection 
        districts={districts} setDistricts={setDistricts} 
        areaValue={areaValue} setAreaValue={setAreaValue} 
        tokenValue={tokenValue} setTokenValue={setTokenValue} 
      />
      <Explore properties={properties} />
    </div>
  )
}

export default Home