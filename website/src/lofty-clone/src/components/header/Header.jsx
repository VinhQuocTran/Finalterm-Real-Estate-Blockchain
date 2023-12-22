import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { BASE_URL } from "../../utils/api";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import { logout, updateUser } from "../../redux/userSlice";
import "./header.scss";

const Header = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const [user, setUser] = useState(currentUser.user);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const mobileViewRef = useRef();
  const profileModalRef = useRef();
  const [isProfileModalOpened, setIsProfileModalOpened] = useState(false);
  const navigate = useNavigate();
  const appTheme = useSelector(state => state.theme);

  const mobileMenuClickHandler = () => {
    setOpenMobileMenu(!openMobileMenu);
  };

  const handleProfileModalClick = (e) => {
    profileModalRef.current.style.visibility = !isProfileModalOpened ? 'visible' : 'hidden';
    profileModalRef.current.style.opacity = !isProfileModalOpened ? 1 : 0;
    if (isProfileModalOpened) e.stopPropagation();
    setIsProfileModalOpened(prevState => !prevState);
    const tempUser = JSON.parse(localStorage.getItem('user'));
    setUser(tempUser);
  };

  const handleLogoutBtnClick = async () => {
    try {
      await axios.get(BASE_URL + "/accounts/signout");
      dispatch(logout);
      localStorage.removeItem('user');
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  const updateProfileClick = async () => {
    try {
      await axios.patch(BASE_URL + `/accounts/${currentUser.user?.id}`, user, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      dispatch(updateUser(user));

      profileModalRef.current.style.visibility = !isProfileModalOpened ? 'visible' : 'hidden';
      profileModalRef.current.style.opacity = !isProfileModalOpened ? 1 : 0;
      setIsProfileModalOpened(false);
    } catch (err) {
      console.log(err);
    }
  };

  window.addEventListener('resize', function () {
    setWidth(window.innerWidth);
  });

  return (
    <header className={`header ${appTheme.themeColor === 'dark' ? 'darkTheme' : ''}`}>
      <ContentWrapper>
        <div className="logo" onClick={() => navigate("/")}>
          {/* <img src="https://www.lofty.ai/static/media/logo-light.ff9fcbf0916e664961e966b23ce0dcc5.svg?__cf_chl_tk=Ikxz1stAGrjbZdu6FcAGd13.pCoDP1rb67ddLlwlSD8-1701791342-0-gaNycGzNEyU" alt="" /> */}
          <span>Lofty</span>
        </div>
        <div className={`rightHeader ${openMobileMenu && width < 1024 ? 'mobileView' : ''}`} ref={mobileViewRef}>
          <ul className="nav-items">
            <li className="nav-item" onClick={() => navigate("/")}>Marketplace</li>
            <li className="nav-item" onClick={() => navigate("/token-ownership-and-rental-income")}>Token Ownership and Rental Income</li>
            <li className="nav-item" onClick={() => navigate("/my-property")}>My Property</li>
            <li className="nav-item" onClick={() => navigate("/my-order")}>My Order</li>
            {currentUser.user ?
              <li className="nav-item" onClick={handleProfileModalClick}>{currentUser.user.username}</li> :
              <li className="nav-item" onClick={() => navigate("/sign-in")}>Sign In</li>
            }
          </ul>
          {!currentUser.user && <button type="button" className="header-btn" onClick={() => navigate("/sign-up")}>Sign Up</button>}
          <IoClose className="closeIcon" onClick={mobileMenuClickHandler} />
        </div>
        <div className="mobileMenu" onClick={mobileMenuClickHandler}>
          <IoMdMenu />
        </div>
      </ContentWrapper>
      <div className="profileModal" ref={profileModalRef} onClick={handleProfileModalClick}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <div className="contentTop">
            <h1>My Account</h1>
            <IoMdClose onClick={handleProfileModalClick} />
          </div>
          <div className="inputForm">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={user?.username} onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))} />
          </div>
          <div className="inputForm">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={user?.email} readOnly />
          </div>
          <div className="inputForm">
            <label htmlFor="address">Address</label>
            <input id="address" type="text" value={user?.address} onChange={(e) => setUser((prev) => ({ ...prev, address: e.target.value }))} />
          </div>
          <div className="inputForm">
            <label htmlFor="phoneNumber">Phone number</label>
            <input id="phoneNumber" type="text" value={user?.phoneNumber} onChange={(e) => setUser((prev) => ({ ...prev, phoneNumber: e.target.value }))} />
          </div>
          <div className="inputForm">
            <label htmlFor="residentId">Resident ID</label>
            <input id="residentId" type="text" value={user?.residentId} onChange={(e) => setUser((prev) => ({ ...prev, residentId: e.target.value }))} />
          </div>
          <div className="inputForm">
            <label htmlFor="cashBalance">Cash balance</label>
            <input id="cashBalance" type="number" min={0} value={user?.cashBalance} onChange={(e) => setUser((prev) => ({ ...prev, cashBalance: e.target.value }))} />
          </div>
          <div className="inputForm">
            <label htmlFor="tokenBalance">Token balance</label>
            <input id="tokenBalance" type="number" min={0} value={user?.tokenBalance} onChange={(e) => setUser((prev) => ({ ...prev, tokenBalance: e.target.value }))} />
          </div>
          <div className="submitBtns">
            <button type="button" onClick={updateProfileClick}>Save changes</button>
            <button type="button" onClick={handleLogoutBtnClick}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header