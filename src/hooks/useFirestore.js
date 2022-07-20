import { useReducer, useState, useEffect } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

/** set defualt state to be used in useReducer hook */
let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

/**
 * Reducer function for each firestore action. Each case overwrites the old state completely
 * @param {*} state
 * @param {*} action
 * @returns
 */
const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "ADDED_DOCUMENT":
      return {
        document: action.payload,
        error: null,
        success: false,
        isPending: false,
      };
    case "IS_PENDING":
      return { document: null, error: null, success: false, isPending: true };
    case "ERROR":
      return {
        document: null,
        error: action.payload,
        success: false,
        isPending: false,
      };
    case "DELETED_DOCUMENT":
      return { document: null, error: false, success: true, isPending: false };
    default:
      return state;
  }
};
/**
 * Custom hook to access a firestore collection and perform several different actions such as adding and deleting documents
 * @param {string} collection - Name of the firestore collection to be accessed
 * @returns functions to add and delete documents as well as the response from firestore
 */
export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // Set reference to the firetstore collection
  const ref = projectFirestore.collection(collection);

  /**
   * Wrapper function to ensure dispatch's are only fired if isCancelled is false.
   * The firestore functions are asynchronous and could cause state changes after the component unmounts
   * @param {*} action - Action to be passed onto the dispatch function
   */
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  /**
   * Add a new document to firestore db
   * @param {*} doc - Object to be stored as a new document in firestore
   */
  const addDocument = async (doc) => {
    // initially displatch the IS_PENDING action to set the state to null and reset errors/pending
    dispatch({ type: "IS_PENDING" });
    try {
      // create a new timestamp for the document to be added
      const createdAt = timestamp.fromDate(new Date());
      // spread the document within a new object and add the timestamp then add the document to firebase
      const addedDocument = await ref.add({ ...doc, createdAt: createdAt });
      // dispatch the reference to the new doc
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (err) {
      // if an error is thrown, dispatch the error message
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  /**
   * Delete a document from firestore based on it's ID
   * @param {string} id - ID of the document to be deleted
   */
  const deleteDocument = async (id) => {
    // initially displatch the IS_PENDING action to set the state to null and reset errors/pending
    dispatch({ type: "IS_PENDING" });
    try {
      // Delete the document and dispatch the action
      await ref.doc(id).delete();
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      // if an error is thrown, dispatch the error message
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  /**
   * useEffect callback function to fire cleanup function. Avoid's updating state of an unmounted component
   */
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, response };
};
