import React, { useContext, useState, useEffect, useRef } from "react";
import DrawerAppBar from "../component/Appbar/Appbar";
import classes from "./Homepage.module.css";
import imageContext from "../store/image-context";
import ImageSelector from "../component/ImageSelector/ImageSelector";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, TextField } from "@mui/material";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import getImageDimensions from "../component/imageDimentions";
import { toast } from "react-toastify";
const Homepage = () => {
  const [image, setImage] = useState(null);
  const [currIndex, setCurrIndex] = useState(0);
  const imgCtx = useContext(imageContext);
  const cropperRef = useRef(null);
  const imgSelected = imgCtx.selectedImage;
  const [imgWidth, setImgWidth] = useState("");
  const [imgHeight, setImgHeight] = useState("");
  const folderNameRef = useRef();

  useEffect(() => {
    const imgUrl = imgCtx.selectedImage.map((item) => {
      return item.imageUrl;
    });
    setImage(imgUrl[currIndex]);
  }, [imgCtx.selectedImage, currIndex]);
  useEffect(() => {
    if (!!image) {
      console.log("runned");
      const fn = async () => {
        const { width, height } = await getImageDimensions(image);
        setImgWidth(width);
        setImgHeight(height);
        console.log(height, width);
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
    const folderName = folderNameRef.current.value;
    // console.log("folder",folderNameRef.current.value)
    if (!folderNameRef.current.value) {
      toast.error("please enter folder Name !!!!");
      return;
    }
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
        // Create a blob URL
        const blobUrl = URL.createObjectURL(blob);

        // Create a link element
        const a = document.createElement("a");
        a.href = blobUrl;

        // Set the filename using the download attribute
        a.download = filename;

        // Append the link to the document body (optional)
        document.body.appendChild(a);

        // Trigger a click event on the link
        a.click();

        // Clean up: remove the link and revoke the blob URL
        a.remove();
        URL.revokeObjectURL(blobUrl);
        toast.success(`cropped image saved to folder - ${folderName}`);
        nextHandler();
      } catch (error) {
        console.error("Error saving file:", error);
        toast.error(`Error in saving the cropped file...plz try again later`);
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
                webkitdirectory=""
                style={{ display: "none" }}
              />
            </div>
          )}

          {imgSelected.length !== 0 && (
            <section>
              <div
                className={classes.cropper}
                style={{
                  height: "70dvh",
                  padding: "10px",
                  margin: "20px",
                }}
              >
                <Cropper
                  src={image}
                  style={{ height: "70dvh", width: `70dvw` }}
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
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
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
                <input
                  placeholder="Enter folder Name"
                  ref={folderNameRef}
                ></input>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default Homepage;
