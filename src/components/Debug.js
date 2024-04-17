import React from "react";
import { addCollectionAndDocuments, addDocumentToDatabase, cancelReservationByTableNumber, dateExists, fetchDateAvailability, fetchDatesAvailability, fetchMenu, fetchOrderId, fetchOrderIdCounter, fetchOrdersOfDate, fetchReservationIdCounter, fetchReservationTimes, fetchReservationsOfDate, fetchTables, fetchTablesAvailability, fetchTimeByIndex, fetchTimesByIndexes, fetchUnavailableTablesOfDate, fetchUnavailableTablesTimesIndexesOfDate, fetchUnavailableTimesIndexesOfDate, getCurrentDate, signInWithGooglePopup, updateDateAvailability } from "./firebase.utils";
import infoDoc from "./dbData";
import configurationDoc from "./dbConfiguration";
import dateDoc from "./dbDate";

function Debug() {

    const addDocumentToDb = async(collectionKey, documentName, document) => {
        try {
          const response = await addDocumentToDatabase(collectionKey, documentName, document);
          console.log(response);
        } catch (error) {
          console.error("Error adding document: ", error);
        }
    }

    const removeFromDb = async () => {
        try {
          // Assuming the reservation ID is known and provided here
          const reservationId = 2;
          const tableNumber = 6;
          
          await cancelReservationByTableNumber(reservationId, tableNumber);
          console.log(`Reservation with id: ${reservationId} was canceled for table ${tableNumber}`);
        } catch (error) {
          console.error("Error encountered while removing reservation", error);
        }
      };

    const checkMenu = async(collectionKey) => {
      try {
          const response = await fetchMenu(collectionKey);
          console.log("Response:");
          console.log(response);
      } catch (error) {
          console.error("Error checking document: ", error);
      }
    }

    const checkOrderIdCounter = async(collectionKey) => {
      try {
          const response = await fetchOrderIdCounter(collectionKey);
          console.log("Response:");
          console.log(response);
      } catch (error) {
          console.error("Error checking document: ", error);
      }
    }

    const checkReservationIdCounter = async(collectionKey) => {
      try {
          const response = await fetchReservationIdCounter(collectionKey);
          console.log("Response:");
          console.log(response);
      } catch (error) {
          console.error("Error checking document: ", error);
      }
    }

    const checkTables = async(collectionKey) => {
      try {
          const response = await fetchTables(collectionKey);
          console.log("Response:");
          console.log(response);
      } catch (error) {
          console.error("Error checking document: ", error);
      }
    }

    const checkReservationTimes = async(collectionKey) => {
      try {
          const response = await fetchReservationTimes(collectionKey);
          console.log("Response:");
          console.log(response);
      } catch (error) {
          console.error("Error checking document: ", error);
      }
    }
    
    const checkDateAvailability = async(collectionKey, date) => {
    try {
        const response = await fetchDateAvailability(collectionKey, date);
        console.log("Response:");
        console.log(response);
    } catch (error) {
        console.error("Error checking document: ", error);
    }
    }
    
    const checkDatesAvailability = async(collectionKey, date,numberOfDays) => {
    try {
        const response = await fetchDatesAvailability(collectionKey, date, numberOfDays);
        console.log("Response:");
        console.log(response);
    } catch (error) {
        console.error("Error checking document: ", error);
    }
    }

    const checkTimeByIndex = async(collectionKey, index) => {
      try {
          const response = await fetchTimeByIndex(collectionKey, index);
          console.log("Response:");
          console.log(response);
      } catch (error) {
          console.error("Error checking document: ", error);
      }
      }
      
      const checkTimesByIndexes = async(collectionKey, indexes) => {
        try {
            const response = await fetchTimesByIndexes(collectionKey, indexes);
            console.log("Response:");
            console.log(response);
        } catch (error) {
            console.error("Error checking document: ", error);
        }
      }

      const checkDateExists = async(collectionKey, date) => {
        try {
            const response = await dateExists(collectionKey, date);
            console.log("Response:");
            console.log(response);
        } catch (error) {
            console.error("Error checking document: ", error);
        }
      }

      const checkUnavailableTimesIndexesOfDate = async(collectionKey, date) => {
        try {
            const response = await fetchUnavailableTimesIndexesOfDate(collectionKey, date);
            console.log("Response:");
            console.log(response);
        } catch (error) {
            console.error("Error checking document: ", error);
        }
      }

      const checkUnavailableTablesOfDate = async(collectionKey, date) => {
        try {
            const response = await fetchUnavailableTablesOfDate(collectionKey, date);
            console.log("Response:");
            console.log(response);
        } catch (error) {
            console.error("Error checking document: ", error);
        }
      }

      const checkUnavailableTablesTimesIndexesOfDate = async(collectionKey, date) => {
        try {
            const response = await fetchUnavailableTablesTimesIndexesOfDate(collectionKey, date);
            console.log("Response:");
            console.log(response);
        } catch (error) {
            console.error("Error checking document: ", error);
        }
      }

      const checkReservationsOfDate = async(collectionKey, date) => {
        try {
            const response = await fetchReservationsOfDate(collectionKey, date);
            console.log("Response:");
            console.log(response);
        } catch (error) {
            console.error("Error checking document: ", error);
        }
      }

      const checkOrdersOfDate = async(collectionKey, date) => {
        try {
            const response = await fetchOrdersOfDate(collectionKey, date);
            console.log("Response:");
            console.log(response);
        } catch (error) {
            console.error("Error checking document: ", error);
        }
      }

    return (
        <div>
            <button onClick={() => addDocumentToDb("sample-restaurant", "info", infoDoc)}>Update Info Document</button>
            <button onClick={() => addDocumentToDb("sample-restaurant", "configuration", configurationDoc)}>Update Configuration Document</button>
            <button onClick={() => addDocumentToDb("sample-restaurant", getCurrentDate(), dateDoc)}>Add today's document</button>
            <button onClick={() => checkMenu("sample-restaurant")}>Debug menu</button>
            <button onClick={() => checkOrderIdCounter("sample-restaurant")}>Debug order id counter</button>
            <button onClick={() => checkReservationIdCounter("sample-restaurant")}>Debug reservation id counter</button>
            <button onClick={() => checkTables("sample-restaurant")}>Debug tables</button>
            <button onClick={() => checkReservationTimes("sample-restaurant")}>Debug reservation times</button>
            <button onClick={() => checkDateExists("sample-restaurant", getCurrentDate())}>Debug date exists</button>
            <button onClick={() => checkDateAvailability("sample-restaurant", getCurrentDate())}>Debug date availability</button>
            <button onClick={() => checkDatesAvailability("sample-restaurant", ["2-4-2024","3-4-2024","4-4-2024","5-4-2024","6-4-2024","7-4-2024"])}>Debug dates availability</button>
            <button onClick={() => checkTimeByIndex("sample-restaurant", 2)}>Debug time by index</button>
            <button onClick={() => checkTimesByIndexes("sample-restaurant", [1,3])}>Debug times by indexes</button>
            <button onClick={() => checkUnavailableTimesIndexesOfDate("sample-restaurant", getCurrentDate())}>Debug unavailable times indexes of date</button>
            <button onClick={() => checkUnavailableTablesOfDate("sample-restaurant", getCurrentDate())}>Debug unavailable tables of date</button>
            <button onClick={() => checkUnavailableTablesTimesIndexesOfDate("sample-restaurant", getCurrentDate())}>Debug unavailable tables times indexes of date</button>
            <button onClick={() => checkUnavailableTablesTimesIndexesOfDate("sample-restaurant", getCurrentDate())}>Debug unavailable tables times indexes of date</button>
            <button onClick={() => checkReservationsOfDate("sample-restaurant", getCurrentDate())}>Debug resevations of date</button>
            <button onClick={() => checkOrdersOfDate("sample-restaurant", getCurrentDate())}>Debug orders of date</button>
        </div>
    );

}

export default Debug;