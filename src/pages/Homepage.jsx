import React, { useState } from "react";
import DrawerAppBar from "../component/Appbar/Appbar";
import classes from "./Homepage.module.css";
const Homepage = () => {
  const [image, setImage] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(event.target.files)
    setImage(URL.createObjectURL(file));
  };
  return (
    <>
      <DrawerAppBar />
      <div className={classes.main_container}>
        <div className={classes.box}>
          {!image && (
            <div className={classes.dropbox}>
              <h1>
                Drop your image here <br /> <strong>or</strong>
              </h1>
              <label htmlFor="file-upload">
                <h1 className={classes.uploader}>
                  Click here to Upload an Image
                </h1>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple 
                accept="image/*,.jpeg,.jpg"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Homepage;
