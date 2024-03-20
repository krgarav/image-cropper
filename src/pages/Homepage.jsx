import React, { useContext, useState, useEffect, useRef } from "react";
import DrawerAppBar from "../component/Appbar/Appbar";
import classes from "./Homepage.module.css";
import imageContext from "../store/image-context";
import ImageSelector from "../component/ImageSelector/ImageSelector";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "@mui/material";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import getImageDimensions from "../component/imageDimentions";
const Homepage = () => {
  const [image, setImage] = useState(null);
  const [currIndex, setCurrIndex] = useState(0);
  const imgCtx = useContext(imageContext);
  const cropperRef = useRef(null);
  const imgSelected = imgCtx.selectedImage;

  useEffect(() => {
    const imgUrl = imgCtx.selectedImage.map((item) => {
      return item.imageUrl;
    });
    setImage(imgUrl[currIndex]);
  }, [imgCtx.selectedImage, currIndex]);
  useEffect(() => {
    
    if (!!image) {
        console.log("runned")
      const fn = async () => {
        const { width, height } = await getImageDimensions(image);
        console.log(width, height);
      };
      fn();
    }
  }, [image]);
  const handleFileChange = (event) => {
    imgCtx.addToSelectedImage(event.target.files);
  };
  const prevHandler = () => {
    setCurrIndex((value) => {
      if (value === 0) {
        alert("No previous image present");
        return value;
      } else {
        return value - 1;
      }
    });
  };
  const nextHandler = () => {
    setCurrIndex((value) => {
      if (value === imgCtx.selectedImage.length - 1) {
        alert("You have reached to last image");

        return value;
      } else {
        return value + 1;
      }
    });
  };
  const saveHandler = async () => {
    const cropper = cropperRef.current?.cropper;
    const croppedCanvas = cropper.getCroppedCanvas();
    const fileObj = imgCtx.selectedImage.filter((item) => {
      return item.imageUrl === image;
    });
    const filename = fileObj[0].imageName;

    if (croppedCanvas) {
      try {
        const blob = await new Promise((resolve) => {
          croppedCanvas.toBlob(resolve, "image/png");
        });
        const options = {
          suggestedName: filename,
        };
        const handle = await window.showSaveFilePicker(options);
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        nextHandler();
      } catch (error) {
        console.error("Error saving file:", error);
      }
    }
  };
  //   console.log( image.width / image.height)
  return (
    <>
      <DrawerAppBar activeRoute="Image Cropper" />
      <main className={classes.main_container}>
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
                accept="image/*,.jpeg,.jpg,.png"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          )}

          {imgSelected.length !== 0 && (
            <section>
              <div style={{ width: "100%", padding: "10px", margin: "20px" }}>
                <Cropper
                  src={image}
                  style={{ maxHeight: "70dvh", width: "100%" }}
                  guides={true}
                  ref={cropperRef}
                  initialAspectRatio={1}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={true}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                />
              </div>
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
                  onClick={saveHandler}
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
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default Homepage;
