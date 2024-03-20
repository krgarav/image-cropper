import React, { useState } from "react";
import Imagecontext from "./image-context";

function Imageprovider(props) {
  const initialData = {
    selectedImage: [],
    croppedImage: [],
  };
  const [imgState, setImgState] = useState(initialData);
  const addToSelectedImageHandler = () => {};
  const addToCroppedImagesHandler = () => {};
  const removeFromCroppedImageHandler = () => {};
  const imgContext = {
    selectedImage: imgState.selectedImage,
    croppedImage: imgState.croppedImage,
    addToSelectedImage: addToSelectedImageHandler,
    addToCroppedImages: addToCroppedImagesHandler,
    removeFromCroppedImage: removeFromCroppedImageHandler,
  };

  return (
    <Imagecontext.Provider value={imgContext}>
      {props.children}
    </Imagecontext.Provider>
  );
}

export default Imageprovider;
