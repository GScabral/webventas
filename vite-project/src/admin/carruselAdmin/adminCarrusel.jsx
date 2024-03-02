import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadImage } from "./redux/actions";

const ImageUpload = () => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      dispatch(uploadImage(selectedFile));
      // Lógica para subir la imagen al servidor
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir imagen</button>
    </div>
  );
};

export default ImageUpload;
