import React from "react";

const imageContext = React.createContext({
  selectedImage: [],
  croppedImage: [],
  pathToSave: "",
  addToSelectedImage: () => {},
  addToCroppedImages: () => {},
  removeFromCroppedImage: () => {},
  addToPath:()=>{},
  resetSelectedImage:()=>{}
});

export default imageContext;
