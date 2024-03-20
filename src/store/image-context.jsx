import React from "react";

const imageContext = React.createContext({
  selectedImage: [],
  croppedImage: [],
  addToSelectedImage: () => {},
  addToCroppedImages: () => {},
  removeFromCroppedImage: () => {},
});

export default imageContext;
