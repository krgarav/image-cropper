import React from "react";

const imageContext = React.createContext({
  selectedImage: [],
  croppedImage: [],
  addToSelectedImage: () => {},
  addToCroppedImages: () => {},
  removeFromCroppedImage: () => {},
  resetSelectedImage:()=>{}
});

export default imageContext;
