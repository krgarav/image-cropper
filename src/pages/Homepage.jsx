import React, { useContext, useState, useEffect } from "react";
import DrawerAppBar from "../component/Appbar/Appbar";
import classes from "./Homepage.module.css";
import imageContext from "../store/image-context";
import ImageSelector from "../component/ImageSelector/ImageSelector";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "@mui/material";
const Homepage = () => {
  const [image, setImage] = useState(null);
  const [currIndex, setCurrIndex] = useState(0);
  const imgCtx = useContext(imageContext);
  const imgSelected = imgCtx.selectedImage;

  useEffect(() => {
    const imgUrl = imgCtx.selectedImage.map((item) => {
      return item.imageUrl;
    });
    setImage(imgUrl[currIndex]);
  }, [imgCtx.selectedImage, currIndex]);

  const handleFileChange = (event) => {
    imgCtx.addToSelectedImage(event.target.files);
  };
  const prevHandler = () => {
    setCurrIndex((value) => {
      if (value === 0) {
        return value;
      } else {
        return value - 1;
      }
    });
  };
  const nextHandler = () => {
    setCurrIndex((value) => {
      if (value === imgCtx.selectedImage.length) {
        return value;
      } else {
        return value + 1;
      }
    });
  };
  return (
    <>
      <DrawerAppBar activeRoute="Image Cropper" />
      <div className={classes.main_container}>
        <div className={classes.box}>
          {imgSelected.length === 0 && (
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

          {imgSelected.length !== 0 && (
            <div>
              <ImageSelector imgurl={image} />
              <div className={classes.btn_container}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ArrowBackIosIcon />}
                  onClick={prevHandler}
                >
                  PREV
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<SaveAltIcon />}
                >
                  SAVE
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={nextHandler}
                >
                  NEXT
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Homepage;
