import ContentWrapper from "../contentWrapper/ContentWrapper";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";

import "./header.scss";
import { useRef, useState } from "react";

const Header = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const mobileViewRef = useRef();

  const mobileMenuClickHandler = () => {
    setOpenMobileMenu(!openMobileMenu);
  };

  window.addEventListener('resize', function () {
    setWidth(window.innerWidth);
  });

  return (
    <header className="header">
      <ContentWrapper>
        <div className="logo">
          <img src="https://www.lofty.ai/static/media/logo-light.ff9fcbf0916e664961e966b23ce0dcc5.svg?__cf_chl_tk=Ikxz1stAGrjbZdu6FcAGd13.pCoDP1rb67ddLlwlSD8-1701791342-0-gaNycGzNEyU" alt="" />
        </div>
        <div className={`rightHeader ${openMobileMenu&&width<1024 ? 'mobileView' : ''}`} ref={mobileViewRef}>
          <ul className="nav-items">
            <li className="nav-item">About us</li>
            <li className="nav-item">Learn</li>
            <li className="nav-item">List property</li>
            <li className="nav-item">Log In</li>
          </ul>
          <button type="button" className="header-btn">Sign Up</button>
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