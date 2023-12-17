import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/imports";
import { Home, DetailedHouse, Signup, Signin, MyProperty, TokenOwnership } from "./pages/imports";
import "./App.scss";

function App() {
  const currentUser = useSelector((state) => state.user);

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties/:propertyId" element={<DetailedHouse />} />
          <Route path="/my-property" element={currentUser.user ? <MyProperty /> : <Signin />} />
          <Route path="/token-ownership" element={<TokenOwnership />} />
          <Route path="/sign-up" element={currentUser.user ? <Home /> : <Signup />} />
          <Route path="/sign-in" element={currentUser.user ? <Home /> : <Signin />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
