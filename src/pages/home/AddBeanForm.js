import React, { useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { storage } from "../../firebase/config";
import { v4 as uuid } from "uuid";

//styles
import styles from "./Home.module.css";

export default function AddBeanForm({ uid }) {
  const [name, setName] = useState("");
  const [grinderSetting, setGrinderSetting] = useState("");
  const [duration, setDuration] = useState("");
  const [beanNotes, setBeanNotes] = useState("")
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState("");
  const [showForm, setShowForm] = useState(false)
  const { addDocument } = useFirestore("beans");

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadImage()
    setShowForm(false)
    setIsPending(false)
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = () => {
    setIsPending(true);
    // Check to see if user actually added a file
    if (!file) {
      alert("Please upload an image first!");
      setIsPending(false);
      return;
    }
    const uniqueId = uuid();

    // Upload file to the object 'images/uniquename+imagename.jpg'
    const uploadTask = storage.ref(`images/${uniqueId}_${file.name}`).put(file);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(progress);
        var prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log("Upload is " + prog + "% done");
        setProgress(prog);
      },
      (err) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        console.log("error: " + err);
        setError(err);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((imgURL) => {
          //console.log("uploaded image: " + imgURL);
          let doc = {
            name: name,
            grinderDuration: duration,
            grinderSetting: grinderSetting,
            image: imgURL,
            userId: uid,
            notes: beanNotes,
          };
          //console.log(doc)
          addDocument(doc);
          // Add document to firestore
          setIsPending(false);
        });
      }
    );
  };

  return (
    <div>
   
   <div className={showForm ? styles.overlay : styles.overlayHidden}>
      
     
      <form onSubmit={handleSubmit}>

        <label htmlFor="bean-name"> Bean Name:</label>
        <input
          id="bean-name"
          type="text"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        ></input>

        <label htmlFor="grinder-setting"> Grinder setting:</label>
        <input
          id="grinder-setting"
          type="number"
          required
          onChange={(e) => setGrinderSetting(e.target.value)}
          value={grinderSetting}
        ></input>

        <label htmlFor="grinder-duration">Grinder Duration:</label>
        <input
          id="grinder-duration"
          type="number"
          required
          onChange={(e) => setDuration(e.target.value)}
          value={duration}
        ></input>
        <label htmlFor="bean-notes">Notes:</label>
        <input
          id="bean-notes"
          type="text"
          required
          onChange={(e) => setBeanNotes(e.target.value)}
          value={beanNotes}
        ></input>
         <label htmlFor="bean-image">Photo:</label>
        <input
          onChange={handleFileChange}
          accept="image/*"
          id="bean-image"
          type="file"
          capture="environment"
        />
        <button>SUBMIT</button>
      </form>
      </div>
      <button className={styles.formBtn} title="Open Form" onClick={() => setShowForm(!showForm)}>{showForm ? '-' : '+' }</button>

     
    </div>
  );
}
