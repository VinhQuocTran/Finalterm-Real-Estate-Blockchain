import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { TokenCard } from "../../components/imports";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../utils/api";
import { setDarkTheme } from "../../redux/themeSlice";
import withdrawHistoryList from "./dummyData.json";
import BasicTable from "../../components/basicTable/BasicTable";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./tokenOwnership.scss";
import { increaseCashBalance, updateUser } from "../../redux/userSlice";

const TokenOwnership = () => {
  const [tokenOwnership, setTokenOwnership] = useState(null);
  const [historyWithdraws, setHistoryWithdraws] = useState([]);
  const [totalCurrentEarned, setTotalCurrentEarned] = useState(0);
  const currentUser = useSelector(state => state.user);
  const appTheme = useSelector(state => state.theme);
  const dispatch = useDispatch();

  const columns = [
    {
      header: 'Withdraw ID',
      accessorKey: 'id',
    },
    {
      header: 'Amount',
      accessorKey: 'withdraw_amount',

    },
    {
      header: 'Date time',
      accessorKey: 'withdraw_date',
    },
    {
      header: 'Type',
      accessorKey: 'withdraw_type_option',
    }
  ];

  const handleWithdrawClick = async () => {
    try {
      await axios.get(BASE_URL + `/chains/${currentUser.user.id}/getWithDrawRentalIncome`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });

      dispatch(increaseCashBalance(totalCurrentEarned));
      // dispatch(updateUser(currentUser.user));

      toast.success('Withdraw successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

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
    const value = tokenOwnership?.reduce((accumulator, tokenOwnership) => {
      return accumulator + tokenOwnership.total_current_balance;
    }, 0);
    console.log(value);
    setTotalCurrentEarned(value?.toFixed(2));
  }, [tokenOwnership]);

  useEffect(() => {
    const fetchHistoryWithdraw = async () => {
      try {
        const response = await axios.get(BASE_URL + `/chains/${currentUser.user.id}/withdrawIncome`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        console.log(response);
        setHistoryWithdraws(response.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchHistoryWithdraw();
  }, [currentUser?.user]);

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
              <button type="button" onClick={handleWithdrawClick}>Withdraw</button>
            </div>
          </div>
          <div className="widthdrawHistoryList">
            <BasicTable data={historyWithdraws} columns={columns} />
          </div>
        </div>
        <div className="boxContainer">
          <h1 className="boxTitle">Token Ownership</h1>
          <div className="items">
            {tokenOwnership && tokenOwnership?.map((item, index) => <TokenCard key={index} token={item} />)}
          </div>
        </div>
      </ContentWrapper>
      <ToastContainer />
    </div>
  )
}

export default TokenOwnership