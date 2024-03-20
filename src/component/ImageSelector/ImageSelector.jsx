import React, { useContext, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import imageContext from "../../store/image-context";
const ImageSelector = (props) => {
  const cropperRef = useRef(null);

  const handleCrop = () => {
    if (typeof cropperRef.current.getCroppedCanvas() === "undefined") {
      return;
    }
    setCroppedImageUrl(cropperRef.current.getCroppedCanvas().toDataURL());
  };

  return (
    <div style={{ width: "100%" }}>
      <Cropper
        src={props.imgurl}
        style={{ maxHeight: "70dvh", width: "100%" }}
        guides={true}
        crop={handleCrop}
        ref={cropperRef}
      />
    </div>
  );
};

export default ImageSelector;
