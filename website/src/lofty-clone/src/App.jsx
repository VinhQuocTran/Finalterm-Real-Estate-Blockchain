import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import { Header, Footer } from "./components/imports";
import { Home, DetailedHouse, Signup, Signin, MyProperty, TokenOwnership } from "./pages/imports";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:propertyId" element={<DetailedHouse />} />
          <Route path="/my-property" element={<MyProperty />} />
          <Route path="/token-ownership" element={<TokenOwnership />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
