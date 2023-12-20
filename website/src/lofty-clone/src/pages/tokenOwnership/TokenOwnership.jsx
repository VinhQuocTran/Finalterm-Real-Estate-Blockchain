import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { TokenCard } from "../../components/imports";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/api";
import { setDarkTheme } from "../../redux/themeSlice";
import withdrawHistoryList from "./dummyData.json";
import BasicTable from "../../components/basicTable/BasicTable";
import "./tokenOwnership.scss";

const TokenOwnership = () => {
  const [tokenOwnership, setTokenOwnership] = useState(null);
  const [totalCurrentEarned, setTotalCurrentEarned] = useState(0);
  const currentUser = useSelector(state => state.user);
  const appTheme = useSelector(state => state.theme);
  const dispatch = useDispatch();

  const columns = [
    {
      header: 'Withdraw ID',
      accessorKey: 'id',
      footer: 'Withdraw ID',
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      footer: 'Amount',

    },
    {
      header: 'Date time',
      accessorKey: 'datetime',
      footer: 'Date time',
    },
    {
      header: 'Type',
      accessorKey: 'type',
      footer: 'Type',
    }
  ];

  useEffect(() => {
    dispatch(setDarkTheme());
  }, []);

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

  useEffect(() => {
    const value = tokenOwnership?.reduce((accumulator, { total_earned }) => {
      return accumulator + total_earned;
    }, 0);
    console.log(value);
    setTotalCurrentEarned(value?.toFixed(2));
  }, [tokenOwnership]);

  return (
    <div className={`tokenOwnership ${appTheme.themeColor === 'dark' ? 'darkTheme' : ""}`}>
      <ContentWrapper>
        <div className="boxContainer">
          <h1 className="boxTitle">Withdraw History</h1>
          <div className="box">
            <div className="boxLeft">
              <h2>Current Rent Balance (USD)</h2>
              <span>${totalCurrentEarned}</span>
            </div>
            <div className="boxRight">
              <button type="button">Withdraw</button>
            </div>
          </div>
          <div className="widthdrawHistoryList">
            <BasicTable data={withdrawHistoryList} columns={columns} />
          </div>
        </div>
        <div className="boxContainer">
          <h1 className="boxTitle">Token Ownership</h1>
          <div className="items">
            {tokenOwnership && tokenOwnership?.map((item, index) => <TokenCard key={index} token={item} />)}
          </div>
        </div>
      </ContentWrapper>
    </div>
  )
}

export default TokenOwnership