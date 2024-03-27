import React, { useState } from "react";
import Imagecontext from "./image-context";

function Imageprovider(props) {
  const initialData = {
    selectedImage: [],
    croppedImage: [],
  };
  const [imgState, setImgState] = useState(initialData);
  const addToSelectedImageHandler = (imgArray) => {
    const copiedData = [...imgArray];
    const ImageData = copiedData.map((image) => {
      const imageUrl = URL.createObjectURL(image);
      const imageName = image.name;
      return { imageName, imageUrl };
    });
    setImgState((prev) => {
      return { ...prev, selectedImage: ImageData };
    });
  };
  const resetSelectedImageHandler = () => {
    setImgState((prev) => {
      return { ...prev, selectedImage: [] };
    });
  };
  const addToCroppedImagesHandler = () => {};
  const removeFromCroppedImageHandler = () => {};
  const imgContext = {
    selectedImage: imgState.selectedImage,
    croppedImage: imgState.croppedImage,
    addToSelectedImage: addToSelectedImageHandler,
    addToCroppedImages: addToCroppedImagesHandler,
    removeFromCroppedImage: removeFromCroppedImageHandler,
    resetSelectedImage: resetSelectedImageHandler,
  };

  return (
    <Imagecontext.Provider value={imgContext}>
      {props.children}
    </Imagecontext.Provider>
  );
}

export default Imageprovider;
