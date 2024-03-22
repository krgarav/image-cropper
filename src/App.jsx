import { Routes, Route, Navigate, Router } from "react-router-dom";
import "./App.css";
import DownloadModal from "./component/downloadModal";
import Homepage from "./pages/Homepage";
import { useState } from "react";
// import Homepage from "./pages/Homepage";
// import DownloadModal from "./component/downloadModal";

function App() {
  const [downloadPath, setDownloadPath] = useState("/.../");
  const downloadPathSaver = (paths) => {
    setDownloadPath(paths);
  };
  console.log(downloadPath);
  return (
    <>
      {/* <DownloadModal DownloadPath={downloadPathSaver}></DownloadModal> */}

      <Routes>
        <Route path="/Image Cropper" element={<Homepage />} />
        <Route
          path="*"
          element={
            <Navigate to="/Image Cropper" accessDownloadPath={downloadPath} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
