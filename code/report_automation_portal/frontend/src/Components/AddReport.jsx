import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import sendFile from './SendFile.js';
import ResSideBar from './SideBar.jsx';

export default function AddReport() {
  const [value, onChange] = useState(new Date());
  const [file, setFile] = useState();

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const response = sendFile(formData);
    console.log(response);
  };

  return (
    <>
      <ResSideBar />
      <div>Add Report</div>
      <div id="upload-form">
        <form action="" method="POST" onSubmit={uploadFile}>
          <input
            type="file"
            name="xlsx"
            id="file-button"
            onChange={handleFile}
          />
          <button type="submit">Upload report</button>
        </form>
      </div>
      <div style={{ margin: '10vh' }}>
        <Calendar onChange={onChange} value={value} />
      </div>
    </>
  );
}
