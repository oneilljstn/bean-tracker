import { useEffect, useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";

/**
 * A custom hook to access firestore documents in a given collection. 
 * @param {string} collection The name of the Firestore collection being accessed
 * @param {array} [_query] An array of strings in the format used by Firestore .where() function
 * @param {array} [_orderBy] An array of strings in the format used by Firestore .orderBy() function
 * @returns An array of objects representing the documents from the firebase collection
 */
export const useCollection = (collection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  /** if we dont user a ref for query and orderBy we get infinite loop in useEffect
  _query is an array and is "different" on every function call */
  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  useEffect(() => {
    // update the reference to the firestore collection with a query and order if they were included when the hook was called
    let ref = projectFirestore.collection(collection);
    if (query) {
      ref = ref.where(...query);
    }
    if (orderBy) {
      ref = ref.orderBy(...orderBy);
    }
    /**
     * get a snapshot of collection initially and every time data changes while subscribed
     * Snaphots are unsubscribed on component unmount
     */
    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        // blank array for storing each document's data
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error.message);
        setError("could not fetch data");
      }
    );

    // useEffect's callback function to unsubscribe on unmount
    return () => unsubscribe();
  }, [collection, query, orderBy]);

  return { documents, error };
};
