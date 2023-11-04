// import { useSelector } from "react-redux";
// import { selectUser } from "./features/userSlice";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import LandingPage from "./Components/landing/LandingPage";

import Header from "./Components/header/Header";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingMap from "./assets/Lottie/loadingMap.json";

function App() {
  //Initial Loading Feature For Web
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="App loading_screen">
        <Lottie animationData={loadingMap} />
      </div>
    );
  }
  return (
    <Router>
      <div className="App">
        <Header />
        <LandingPage />
      </div>
    </Router>
  );
  // const user = useSelector(selectUser);
  // return <div className="App">{user ? <MainPage /> : <Login />}</div>;
}

export default App;
