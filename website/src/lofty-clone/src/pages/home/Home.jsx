import axios from "axios";
import { useEffect, useState } from "react";
import Banner from "../../components/banner/Banner";
import FilterSection from "../../components/filterSection/FilterSection";
import Explore from "../../components/explore/Explore";
import { BASE_URL } from "../../utils/api";
import { useDispatch } from "react-redux";
import { setLightTheme } from "../../redux/themeSlice";
import "./home.scss";

const Home = () => {
  const dispatch = useDispatch();
  const [properties, setProperties] = useState(null);
  const [districts, setDistricts] = useState("All districts");
  const [areaValue, setAreaValue] = useState(0);
  const [tokenValue, setTokenValue] = useState(0);

  useEffect(() => {
    dispatch(setLightTheme());
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(BASE_URL + '/properties?isListed=1' +
          `${districts !== "All districts" ? '&propertyDistrict=' + districts : ''}` +
          `${areaValue !== 0 ? '&area[lte]=' + areaValue : ''}` + 
          `${tokenValue !== 0 ? '&tokenLTE=' + tokenValue : ''}`
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