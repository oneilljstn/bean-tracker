import React, { useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { storage } from "../../firebase/config";
import { v4 as uuid } from "uuid";
//styles
import styles from "./Home.module.css";
/**
 * Component for the add a new bean form
 * @param {string} uid The currently logged in user ID
 */
export default function AddBeanForm({ uid }) {
  const [name, setName] = useState("");
  const [grinderSetting, setGrinderSetting] = useState("");
  const [duration, setDuration] = useState("");
  const [beanNotes, setBeanNotes] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { addDocument } = useFirestore("beans");

  /**
   * Function fired when the form is submitted
   * @param {event} e
   */
  const handleSubmit = (e) => {
    // Prevent the form from refreshing the page
    e.preventDefault();
    // upload the image to firebase storage and add the associated document to firestore DB
    uploadImage();
    // hide the form once submitted
    setShowForm(false);
    // reset pending state
    setIsPending(false);
  };

  /**
   * Function fires each time the file is changed in the file picker.
   * @param {event} e
   */
  const handleFileChange = (e) => {
    // if the file exists, update the file state to reflect the new file
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  /**
   * Function to upload the image to firebase storage and add the associated document to firebase db
   */
  const uploadImage = () => {
    setIsPending(true);
    // Check to see if user actually added a file
    if (!file) {
      alert("Please upload an image first!");
      setIsPending(false);
      return;
    }
    // Create a unique id for the image
    const uniqueId = uuid();
    // Upload file to the firebase storage as 'images/uniquename+imagename.jpg'
    const uploadTask = storage.ref(`images/${uniqueId}_${file.name}`).put(file);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Each time the snapshot changes update the progress state with the new value
        var prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log("Upload is " + prog + "% done");
        setProgress(prog);
      },
      (err) => {
        // If there is an error, log it to console and update the error state
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        console.log("error: " + err);
        setError(err);
      },
      () => {
        // Upload completed successfully
        // Get the download URL from the snapshot then.
        uploadTask.snapshot.ref.getDownloadURL().then((imgURL) => {
          // console.log("uploaded image: " + imgURL);
          // create an object to be stored in Firestore
          let doc = {
            name: name,
            grinderDuration: duration,
            grinderSetting: grinderSetting,
            image: imgURL,
            userId: uid,
            notes: beanNotes,
          };
          // Add the new document to Firestore using the addDocument function from useFirestore hook
          addDocument(doc);
          // reset pending state
          setIsPending(false);
        });
      }
    );
  };

  return (
    <>
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
      <button
        className={styles.formBtn}
        title="Open Form"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "-" : "+"}
      </button>
    </>
  );
}
