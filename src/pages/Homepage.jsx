import React, { useContext, useState, useEffect, useRef } from "react";
import DrawerAppBar from "../component/Appbar/Appbar";
import classes from "./Homepage.module.css";
import imageContext from "../store/image-context";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, Slider } from "@mui/material";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import getImageDimensions from "../component/imageDimentions";
import { toast } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const Homepage = () => {
  const [image, setImage] = useState(null);
  const [currIndex, setCurrIndex] = useState(0);
  const imgCtx = useContext(imageContext);
  const cropperRef = useRef(null);
  const imgSelected = imgCtx.selectedImage;
  const [imgWidth, setImgWidth] = useState("");
  const [imgHeight, setImgHeight] = useState("");
  const [imageName, setImageName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [rotate, setRotate] = useState(0);
  const folderNameRef = useRef();
  const [loading, setLoading] = useState(false);

  const theme = createTheme({
    palette: {
      ochre: {
        main: "#E3D026",
        light: "#E9DB5D",
        dark: "#A29415",
        contrastText: "#242105",
      },
    },
  });
  useEffect(() => {
    const imgUrl = imgCtx.selectedImage.map((item) => {
      return item.imageUrl;
    });
    const imageName = imgCtx.selectedImage.map((item) => {
      return item.imageName;
    });
    setImageName(imageName[currIndex]);
    setImage(imgUrl[currIndex]);
  }, [imgCtx.selectedImage, currIndex]);
  useEffect(() => {
    if (!!image) {
      const fn = async () => {
        const { width, height } = await getImageDimensions(image);
        setImgWidth(width);
        setImgHeight(height);
      };
      fn();
    }
  }, [image]);

  const handleFileChange = (event) => {
    console.log(event.target.files);
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
    setLoading(true);
    const folderName = folderNameRef.current.value;
    if (!folderNameRef.current.value) {
      toast.error("please enter folder Name !!!!");
      setLoading(false);
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

        const formData = new FormData();
        formData.append("file", blob, filename);
        formData.append("folderName", folderName);
        await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });
        toast.success(
          `Cropped ${filename} saved in ${folderName} Successfully`
        );
        setLoading(false);
        nextHandler();
      } catch (error) {
        toast.error("Image could not be saved");
        setLoading(false);
        console.error("Error saving file:", error);
      }
    }
  };
  const clearHandler = () => {
    imgCtx.resetSelectedImage();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const items = event.dataTransfer.items;
    let filesArray = [];

    // Check if dropped items are files
    if (items) {
      const promises = [];
      for (let i = 0; i < items.length; i++) {
        // Get the Entry object for each item
        const entry = items[i].webkitGetAsEntry();
        if (entry) {
          promises.push(traverseFileTree(entry, filesArray));
        }
      }

      // Wait for all promises to resolve
      Promise.all(promises).then(() => {
        // Convert files array to FileList
        const fileList = new DataTransfer();
        filesArray.forEach((file) => {
          fileList.items.add(file);
        });

        // Add the FileList to the image context
        imgCtx.addToSelectedImage(fileList.files);
      });
    }
  };

  // Function to recursively traverse the directory tree
  const traverseFileTree = (entry, filesArray) => {
    return new Promise((resolve, reject) => {
      if (entry.isFile) {
        // Handle file
        entry.file((file) => {
          if (file.type.startsWith("image/")) {
            // Add image file to the files array
            filesArray.push(file);
          }
          resolve();
        });
      } else if (entry.isDirectory) {
        // Iterate through directory contents
        const directoryReader = entry.createReader();
        directoryReader.readEntries((entries) => {
          const promises = [];
          for (let i = 0; i < entries.length; i++) {
            // Recursively traverse each directory entry
            promises.push(traverseFileTree(entries[i], filesArray));
          }
          // Wait for all promises to resolve
          Promise.all(promises).then(resolve);
        });
      }
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRightRotate = () => {
    const cropper = cropperRef.current.cropper;
    cropper.rotate(rotate + 1);
  };
  const handleLeftRotate = () => {
    const cropper = cropperRef.current.cropper;
    cropper.rotate(rotate - 1);
  };
  return (
    <>
      <DrawerAppBar activeRoute="Image Cropper" />
      <main className={classes.main_container}>
        <div className={classes.box}>
          {imgSelected.length === 0 && (
            <div
              className={`${classes.dropbox} `}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className={`${isDragOver ? classes.dragOver : ""}`}>
                <h1>
                  Drop your image folder here <br /> <strong>or</strong>
                </h1>
                <label htmlFor="file-upload">
                  <h1 className={classes.uploader}>
                    Click here to Upload Image Folder
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
            </div>
          )}

          {imgSelected.length !== 0 && (
            <section>
              <h3 className={classes.image_header}>{imageName}</h3>
              <div
                className={classes.cropper}
                style={{
                  height: "70dvh",
                  padding: "10px",
                  marginBottom: "20px",
                }}
              >
                <Cropper
                  src={image}
                  style={{ height: "70dvh", width: `70dvw` }}
                  guides={true}
                  ref={cropperRef}
                  initialAspectRatio={100}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={true}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false}
                  zoomable={false}
                  rotatable={true}
                />
              </div>
              <div className={classes.rotate_section}>
                <ThemeProvider theme={theme}>
                  <Button
                    variant="contained"
                    color="ochre"
                    onClick={handleRightRotate}
                  >
                    Rotate 1&deg; left
                  </Button>
                  <Button
                    variant="contained"
                    color="ochre"
                    onClick={handleLeftRotate}
                  >
                    Rotate 1&deg; Right
                  </Button>
                </ThemeProvider>
              </div>
              <div className={classes.btn_container}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={clearHandler}
                >
                  CLEAR IMAGES
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ArrowBackIosIcon />}
                  onClick={prevHandler}
                >
                  PREV
                </Button>
                {loading && (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="outlined"
                  >
                    SAVING
                  </LoadingButton>
                )}
                {!loading && (
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<SaveIcon />}
                    onClick={saveHandler}
                  >
                    SAVE
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={nextHandler}
                >
                  NEXT
                </Button>
                {/* <Slider
                  size="small"
                  defaultValue={70}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                  value={rotate}
                  onChange={handleRotate}
                /> */}

                <input
                  placeholder="Enter folder Name"
                  ref={folderNameRef}
                  style={{ width: "120px" }}
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
