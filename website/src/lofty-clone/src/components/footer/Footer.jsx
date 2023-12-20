import ContentWrapper from "../contentWrapper/ContentWrapper";
import { useSelector } from "react-redux";
import "./footer.scss";

const Footer = () => {
  const appTheme = useSelector(state => state.theme);


  return (
    <div className={`footer ${appTheme.themeColor === 'dark' ? 'darkTheme' : ''}`}>
      <ContentWrapper>
        <div className="logo">
          {/* <img src="https://www.lofty.ai/static/media/logo-light.ff9fcbf0916e664961e966b23ce0dcc5.svg?__cf_chl_tk=Ikxz1stAGrjbZdu6FcAGd13.pCoDP1rb67ddLlwlSD8-1701791342-0-gaNycGzNEyU" alt="" /> */}
          <span>Lofty</span>
        </div>
        <div className="navItems">
          <span className="navItem">About us</span>
          <span className="navItem">Reviews</span>
          <span className="navItem">Compare Lofty</span>
          <span className="navItem">Learn</span>
          <span className="navItem">Blog</span>
          <span className="navItem">List property</span>
          <span className="navItem">Privacy policy</span>
          <span className="navItem">Term of service</span>
          <span className="navItem">Contact us</span>
        </div>
      </ContentWrapper>
    </div>
  )
}

export default Footer