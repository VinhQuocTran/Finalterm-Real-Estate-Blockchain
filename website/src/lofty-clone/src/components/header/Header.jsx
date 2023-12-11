import { useNavigate } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import ContentWrapper from "../contentWrapper/ContentWrapper";

import "./header.scss";
import { useRef, useState } from "react";

const Header = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const mobileViewRef = useRef();
  const navigate = useNavigate();

  const mobileMenuClickHandler = () => {
    setOpenMobileMenu(!openMobileMenu);
  };

  window.addEventListener('resize', function () {
    setWidth(window.innerWidth);
  });

  return (
    <header className="header">
      <ContentWrapper>
        <div className="logo" onClick={() => navigate("/")}>
          <img src="https://www.lofty.ai/static/media/logo-light.ff9fcbf0916e664961e966b23ce0dcc5.svg?__cf_chl_tk=Ikxz1stAGrjbZdu6FcAGd13.pCoDP1rb67ddLlwlSD8-1701791342-0-gaNycGzNEyU" alt="" />
        </div>
        <div className={`rightHeader ${openMobileMenu && width < 1024 ? 'mobileView' : ''}`} ref={mobileViewRef}>
          <ul className="nav-items">
            <li className="nav-item" onClick={() => navigate("/")}>Marketplace</li>
            <li className="nav-item" onClick={() => navigate("/token-ownership")}>Token Ownership</li>
            <li className="nav-item" onClick={() => navigate("/my-property")}>My Property</li>
            <li className="nav-item" onClick={() => navigate("/sign-in")}>Sign In</li>
          </ul>
          <button type="button" className="header-btn" onClick={() => navigate("/sign-up")}>Sign Up</button>
          <IoClose className="closeIcon" onClick={mobileMenuClickHandler} />
        </div>
        <div className="mobileMenu" onClick={mobileMenuClickHandler}>
          <IoMdMenu />
        </div>
      </ContentWrapper>
    </header>
  )
}

export default Header