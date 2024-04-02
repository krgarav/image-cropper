import React, { useContext, useState, useEffect, useRef } from "react";
import DrawerAppBar from "../component/Appbar/Appbar";
import classes from "./Homepage.module.css";
import imageContext from "../store/image-context";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, IconButton, TextField } from "@mui/material";
import Cropper from "react-cropper";
import { toast } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Rotate90DegreesCcwIcon from "@mui/icons-material/Rotate90DegreesCcw";
import { MdOutlineRotate90DegreesCw } from "react-icons/md";
import { Row, Col } from "react-bootstrap";
import "cropperjs/dist/cropper.css";
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
  const [loading, setLoading] = useState(false);
  const [folderName, setFolderName] = useState("");

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
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextHandler();
      } else if (event.key === "ArrowLeft") {
        prevHandler();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
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
  // useEffect(() => {
  //   if (!!image) {
  //     const fn = async () => {
  //       const { width, height } = await getImageDimensions(image);
  //       setImgWidth(width);
  //       setImgHeight(height);
  //     };
  //     fn();
  //   }
  // }, [image]);

  useEffect(() => {
    if (cropperRef.current !== null) {
      const cropper = cropperRef.current.cropper;
      const imageData = cropper.getImageData();
      const imageWidth = imageData.width;
      const imageHeight = imageData.height;
      setImgHeight(imageHeight);
      setImgWidth(imageWidth);
    }
  }, [cropperRef, rotate]);

  const handleFileChange = (event) => {
    imgCtx.addToSelectedImage(event.target.files);
    const files = event.target.files;
    if (files.length > 0) {
      const directoryPath = extractDirectoryPath(files[0].webkitRelativePath);
    }
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
    if (!folderName) {
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
        await fetch("http://localhost:3400/upload", {
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
    setCurrIndex(0);
    setFolderName("");
    setImage("");
    setRotate(0);
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
        entry.file((file) => {
          if (file.type.startsWith("image/")) {
            filesArray.push(file);
          }
          resolve();
        });
      } else if (entry.isDirectory) {
        const directoryReader = entry.createReader();
        directoryReader.readEntries((entries) => {
          const promises = [];
          for (let i = 0; i < entries.length; i++) {
            promises.push(traverseFileTree(entries[i], filesArray));
          }

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
    cropper.rotate(1);
    setRotate(rotate + 1);
  };
  const handleLeftRotate = () => {
    const cropper = cropperRef.current.cropper;
    cropper.rotate(-1);
    setRotate(rotate - 1);
  };
  const handleNinetyLeft = () => {
    const cropper = cropperRef.current.cropper;
    cropper.rotate(-90);
    setRotate(rotate - 90);
  };
  const handleNinetyRight = () => {
    const cropper = cropperRef.current.cropper;
    cropper.rotate(+90);
    setRotate(rotate + 90);
  };
  const handleFolderChange = (event) => {
    setFolderName(event.target.value);
  };
  function extractDirectoryPath(webkitRelativePath) {
    // The webkitRelativePath is in the form 'directory/subdirectory/filename'
    // We can split it to get the directory path
    const parts = webkitRelativePath.split("/");

    // Remove the last part which represents the filename
    parts.pop();

    // Join the remaining parts to get the directory path
    const directoryPath = parts.join("/");

    return directoryPath;
  }

  return (
    <>
      <DrawerAppBar
        activeRoute="Image Cropper"
        fileName={
          <article>
            <span style={{ color: "ivory" }}>
              {currIndex + 1} of {imgCtx.selectedImage.length}
            </span>
            <span style={{ color: "whiteSmoke" }}>:</span>
            {imageName}
          </article>
        }
      />
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
              <div
                className={classes.cropper}
                style={{
                  padding: "5px",
                  marginBottom: "10px",
                  marginTop: "10px",
                  border: "1px solid black",
                  borderRadius: "5px",
                }}
              >
                <Cropper
                  src={image}
                  style={{
                    height: "70dvh",
                    width: `70dvw`,
                  }}
                  guides={true}
                  ref={cropperRef}
                  initialAspectRatio={0}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={true}
                  responsive={true}
                  autoCropArea={0}
                  checkOrientation={false}
                  zoomable={false}
                  rotatable={true}
                  autoCrop={false}
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
                  <IconButton
                    color="secondary"
                    aria-label="rotate left"
                    onClick={handleNinetyLeft}
                  >
                    <Rotate90DegreesCcwIcon />
                  </IconButton>

                  <IconButton
                    color="secondary"
                    aria-label="rotate right"
                    onClick={handleNinetyRight}
                  >
                    <MdOutlineRotate90DegreesCw />
                  </IconButton>
                  <Button
                    variant="contained"
                    color="ochre"
                    onClick={handleLeftRotate}
                  >
                    Rotate 1&deg; Right
                  </Button>
                </ThemeProvider>
              </div>
              <Row>
                <Col
                  style={{ display: "flex", justifyContent: "start" }}
                  sm={3}
                  md={3}
                  lg={3}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={clearHandler}
                  >
                    CLEAR IMAGES
                  </Button>
                </Col>
                <Col sm={6} md={6} lg={6} className={classes.btn_container}>
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
                </Col>
                <Col
                  style={{ display: "flex", justifyContent: "end" }}
                  sm={3}
                  md={3}
                  lg={3}
                >
                  <TextField
                    id="outlined-textarea"
                    label="Destination Folder Name"
                    placeholder="Enter folder Name"
                    multiline
                    color="secondary"
                    value={folderName}
                    focused
                    onChange={handleFolderChange}
                  />
                </Col>
              </Row>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

export default Homepage;
