import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
//import { BrowserRouter as Router } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import LandingPage from "./Components/landing/LandingPage";
import Login from "./Components/login/Login";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingMap from "./assets/Lottie/loadingMap.json";
import Register from "./Components/register/Register";
import Header from "./Components/header/Header";
import MainPage from "./Components/main/MainPage";
import CreateMap from "./Components/createmap/CreateMap";
import MyMap from "./Components/mymap/MyMap";
import SocialPage from "./Components/social/SocialPage";
import Profile from "./Components/profile/Profile";

function App() {
  //Initial Loading Feature For Web
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const user = useSelector(selectUser);

  if (loading) {
    return (
      <div className="App loading_screen">
        <Lottie animationData={loadingMap} />
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/createmap" element={<CreateMap />} />
          <Route path="/socialpage" element={<SocialPage />} />
          <Route path="/mymap" element={<MyMap />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="/mainpage"
            element={user ? <MainPage /> : <LandingPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
