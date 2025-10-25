import React from "react";
import "./FullScreenLoader.css";

const FullScreenLoader = ({ message = "Cargando..." }) => {
  return (
    <div className="fullscreen-loader">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default FullScreenLoader;
