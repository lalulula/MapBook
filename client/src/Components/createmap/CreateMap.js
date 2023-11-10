import React from "react";
import { useNavigate } from "react-router-dom";

const CreateMap = () => {
  const navigate = useNavigate();
  return <div onClick={() => navigate("/mainpage")}>CreateMapPage</div>;
};

export default CreateMap;
