import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import "./App.css";
import Login from "./Components/Login";
import MainPage from "./Components/MainPage";
import LandingPage from "./Components/landing/LandingPage";
import Header from "./Components/header/Header";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingMap from "./assets/Lottie/loadingMap.json";
function App() {
  //Initial Loading Feature For Web
  const [loading, setLoading] = useState(false);
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
    <div className="App">
      <Header />
      <br></br>
      <LandingPage />
    </div>
  );
  // const user = useSelector(selectUser);
  // return <div className="App">{user ? <MainPage /> : <Login />}</div>;
}

export default App;
