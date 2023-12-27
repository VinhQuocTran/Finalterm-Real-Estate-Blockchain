import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/imports";
import { Home, DetailedHouse, Signup, Signin, MyProperty, TokenOwnership, Order } from "./pages/imports";
import "./App.scss";

function App() {
  const currentUser = useSelector((state) => state.user);
  const appTheme = useSelector((state) => state.theme);

  return (
    <div className={`app ${appTheme.themeColor === 'light' ? '' : 'darkTheme' }`}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties/:propertyId" element={<DetailedHouse />} />
          <Route path="/my-property" element={currentUser.user ? <MyProperty /> : <Signin />} />
          <Route path="/token-ownership-and-rental-income" element={currentUser.user ? <TokenOwnership /> : <Signin />} />
          <Route path="/my-order" element={currentUser.user ? <Order /> : <Signin />} />
          <Route path="/sign-up" element={currentUser.user ? <Home /> : <Signup />} />
          <Route path="/sign-in" element={currentUser.user ? <Home /> : <Signin />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
