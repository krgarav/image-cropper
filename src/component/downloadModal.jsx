import React, { useRef } from "react";
import modalImage from "../images/explosion-colored-powder-white-background.jpg";
function DownloadModal(props) {
  const locationref = useRef();
  const savePathHandler = () => {
    // console.log()
    props.DownloadPath(locationref.current.value)
  };
  return (
    <div
      style={{
        display: "flex",
        position: "fixed",
        justifyContent: "center",
        
        zIndex: "2",
        
        width: "100%",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          background: "white", // Setting the background image
          backgroundSize: "cover",
          padding: "5px 10px",
          boxShadow: "5px 5px 5px black",
        }}
      >
        <input
          ref={locationref}
          placeholder="enter download path"
          style={{
            width: "400px",
            height: "40px",
            // border: "2px solid black",
            margin: "20px 0px",
          }}
        ></input>
        <button
          style={{ height: "30px", padding: "5px" }}
          onClick={savePathHandler}
        >
          save download path
        </button>
      </div>
    </div>
  );
}

export default DownloadModal;
