import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  updateDoc,
  addDoc
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBw9Y6LVcqeKJQhx56QjZFbPhFvb29_6Mg",
    authDomain: "reservation-system-43d03.firebaseapp.com",
    projectId: "reservation-system-43d03",
    storageBucket: "reservation-system-43d03.appspot.com",
    messagingSenderId: "526682468950",
    appId: "1:526682468950:web:5fa1f6c6e04fc111dc41f7",
    measurementId: "G-9RN13Z2JPE"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const updateDateAvailability = async (collectionKey) => {
  const batch = writeBatch(db);
  const collectionRef = collection(db, collectionKey);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Function to get all dates of the year
  const getAllDatesOfYear = (year) => {
    const dates = [];
    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
        dates.push(`${day}-${month + 1}-${year}`);
      }
    }
    return dates;
  };

  const allDatesOfYear = getAllDatesOfYear(currentYear);

  const docRef = doc(collectionRef, "data");

  // Fetch the current "data" document to maintain "id_counter"
  const docSnapshot = await getDoc(docRef);
  let idCounter = 0;
  if (docSnapshot.exists()) {
    idCounter = docSnapshot.data().id_counter || 0;
  }

  const tempDates = allDatesOfYear.map((date, index) => {
    const unavailable = Math.random() < 0.5 ? true : undefined; // Randomly set unavailable to true or keep it undefined
    if (unavailable){
      return {
        id: index + 1, // Increment id_counter for each date
        date: date,
        unavailable: unavailable
      };
    }
    else {
      return {
        id: index + 1, // Increment id_counter for each date
        date: date,
      };
    }
  });

  // Update "data" document with new "dates" array and updated "id_counter"
  batch.set(docRef, {
    dates: tempDates,
    id_counter: idCounter + allDatesOfYear.length // Increment id_counter
  });

  await batch.commit();
  console.log('Added dates availability to the database');
};


export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd,
  num
) => {
  const batch = writeBatch(db);
  const collectionRef = collection(db, collectionKey);

  console.log("objectsToAdd length:", objectsToAdd.length);

  for (let i = 0; i < objectsToAdd.length; i++) {
      console.log("i:", i);
      let docRef; // Declare docRef outside the if-else blocks

      if (i === 0) {
          docRef = doc(collectionRef, "data");
      } else if (i === objectsToAdd.length - 1) {
          
          docRef = doc(collectionRef, getCurrentDate());
      } else {
          docRef = doc(collectionRef,"table" + objectsToAdd[i].id);
      }

      batch.set(docRef, objectsToAdd[i]);
  }

  await batch.commit();  
  console.log('added to db');
};

export const addDocumentToDatabase = async (
  collectionKey,
  documentName,
  documentToAdd
) => {
  try {
    const batch = writeBatch(db);
    const collectionRef = collection(db, collectionKey);
    const docRef = doc(collectionRef, documentName);
    batch.set(docRef, documentToAdd);
    await batch.commit();
    console.log(`Added ${documentName} to db`);
    return docRef; // Return the reference to the added document if needed
  } catch (error) {
    console.error("Error adding document to database: ", error);
    throw error;
  }
};

// export const addCollectionAndDocuments = async (
//   collectionKey,
//   objectsToAdd,
//   num
// ) => {
//   const batch = writeBatch(db);
//   const collectionRef = collection(db, collectionKey);

//   console.log("objectsToAdd length:", objectsToAdd.length);

//   const currentDate = new Date();
//   for (let i = 0; i < num; i++) {
//     const date = new Date(currentDate); // Create a new date object for each iteration
//     date.setDate(date.getDate() + i); // Add 'i' days to the current date

//     console.log("Processing date:", date);

//     const dateString = formatDate(date); // Format the date string

//     const docRef = doc(collectionRef, dateString);
//     for (let j = 0; j < objectsToAdd.length; j++) {
//       console.log("i:", j);
//       let docRef; // Declare docRef outside the if-else blocks

//       if (j === 0) {
//           docRef = doc(collectionRef, "data");
//       } else if (j === objectsToAdd.length - 1) {
          
//           docRef = doc(collectionRef, getCurrentDate());
//       } else {
//           docRef = doc(collectionRef,"table" + objectsToAdd[j].id);
//       }

//       batch.set(docRef, objectsToAdd[j]);
//   }
//   }

//   await batch.commit();  
//   console.log('added to db');
// };


export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is zero-based
  const day = date.getDate();
  return `${day}-${month}-${year}`;
}

export const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Month is zero-based
  const day = currentDate.getDate();
  return `${day}-${month}-${year}`;
}

export const getDateRange = (num) => {
  const currentDate = new Date();
  const dates = [];

  for (let i = 0; i <= num; i++) {
    const date = new Date(currentDate.getTime() + i * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is zero-based
    const day = date.getDate();
    dates.push(`${day}-${month}-${year}`);
  }

  return dates;
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

// export const fetchTablesData = async () => {

//   const restaurantsRef = collection(db, 'restaurants');
//   const sampleRestaurantRef = doc(restaurantsRef, 'sample-restaurant');
//   // Fetch the sample restaurant document
//   const sampleRestaurantDoc = await getDoc(sampleRestaurantRef);
//   if (!sampleRestaurantDoc.exists()) {
//     console.log('Sample restaurant document does not exist');
//     return; // Exit function if document does not exist
//   }

//   // Log the data of the sample restaurant document
//   console.log('Sample Restaurant Data:', sampleRestaurantDoc.data().tables);

//   const tablesData = sampleRestaurantDoc.data().tables;


//   // console.log('Tables Data:');
//   // Object.keys(tablesData).forEach(tableId => {
//   //   console.log(tablesData[tableId]);
//   // });

//   return tablesData;
// };

// Returns true if date in collection "collectionKey" is available to reserve

export const fetchMenu = async (collectionKey) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef,"info");
  const infoDoc = await getDoc(infoRef);

  if (infoDoc.exists()){
    const menu = infoDoc.data().menu;
    console.log("Menu:");
    console.log(menu);
    return  menu;
  }

  console.log(`Error while fetching info doc.`);
  
  return null;

};

export const fetchOrderIdCounter = async (collectionKey) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef,"info");
  const infoDoc = await getDoc(infoRef);

  if (infoDoc.exists()){
    const orderIdCounter = infoDoc.data().order_id_counter;
    console.log("Order ID counter:");
    console.log(orderIdCounter);
    return  orderIdCounter;
  }

  console.log(`Error while fetching info doc.`);
  
  return null;

};

export const fetchReservationIdCounter = async (collectionKey) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef,"info");
  const infoDoc = await getDoc(infoRef);

  if (infoDoc.exists()){
    const reservationIdCounter = infoDoc.data().reservation_id_counter;
    console.log("Reservation ID counter:");
    console.log(reservationIdCounter);
    return  reservationIdCounter;
  }

  console.log(`Error while fetching info doc.`);
  
  return null;

};

export const fetchTables = async (collectionKey) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef,"info");
  const infoDoc = await getDoc(infoRef);

  if (infoDoc.exists()){
    const tables = infoDoc.data().tables;
    console.log("Tables:");
    console.log(tables);
    return  tables;
  }

  console.log(`Error while fetching info doc.`);
  
  return null;

};

export const fetchReservationTimes = async (collectionKey) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef,"info");
  const infoDoc = await getDoc(infoRef);

  if (infoDoc.exists()){
    const reservation_times = infoDoc.data().reservation_times;
    console.log("Reservation times:");
    console.log(reservation_times);
    return  reservation_times;
  }

  console.log(`Error while fetching info doc.`);
  
  return null;

};

export const fetchDateAvailability = async (collectionKey, date) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef,"info");
  const infoDoc = await getDoc(infoRef);

  if (infoDoc.exists()){
    const unavailable_days = infoDoc.data().unavailable_days;
    console.log("Unavailable days:");
    console.log(unavailable_days);
    console.log(`Fetched date ${date} availability: ${(!unavailable_days.includes(date))}`);
    return  !unavailable_days.includes(date);
  }

  console.log(`Error while fetching info doc.`);
  
  return null;

};

export const fetchDatesAvailability = async (collectionKey, dates) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef,"info");
  const infoDoc = await getDoc(infoRef);

  if (infoDoc.exists()){
    const unavailable_days = infoDoc.data().unavailable_days;
    const availability = [];
    dates.forEach(date => {
      availability.push(!unavailable_days.includes(date));
    });
    console.log("Unavailable days:");
    console.log(unavailable_days);
    console.log(`Fetched dates availability:`);
    console.log(dates);
    return  availability;
  }

  console.log(`Error while fetching info doc.`);
  
  return null;

};

export const fetchTimeByIndex = async (collectionKey, index) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef, "info");
  const infoDoc = await getDoc(infoRef);

  if (infoDoc.exists()) {
    const reservation_times = infoDoc.data().reservation_times;

    for (const reservation_time of reservation_times) {
      if (index === reservation_time.id) {
        console.log(`Index: ${index}, Time: ${reservation_time.time}`);
        return reservation_time.time; // Return the value directly
      }
    }

    console.log(`Time not found for index ${index}`);
    return null; // Return null if the index is not found
  } else {
    console.log(`Error while fetching info doc`);
    return null; // Return null in case of error
  }

};

export const fetchTimesByIndexes = async (collectionKey, indexes) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef, "info");
  const infoDoc = await getDoc(infoRef);

  if (infoDoc.exists()) {
    const reservation_times = infoDoc.data().reservation_times;
    const timesOfIndexes = [];

    for (const index of indexes) {
      let found = false;

      for (const time of reservation_times) {
        if (index === time.id) {
          timesOfIndexes.push(time.time);
          found = true;
          break; // Stop looping through times once a match is found
        }
      }

      if (!found) {
        timesOfIndexes.push(undefined);
        console.log(`Time not found for index ${index}`);
      }
    }

    console.log("Indexes:");
    console.log(indexes);
    console.log("Times found:");
    console.log(timesOfIndexes);

    return timesOfIndexes;
  } else {
    console.log(`Error while fetching info doc`);
    return null; // Return null or handle the error case appropriately
  }

};

export const fetchUnavailableTimesIndexesOfDate = async (collectionKey, date) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const dateRef = doc(sampleRestaurantRef, date);
  const dateDoc = await getDoc(dateRef);

  if (dateDoc.exists()) {

    const unavailable_times_indexes = dateDoc.data().unavailable_times_indexes;

    console.log(`Unavailable times indexes pairs of date ${date}:`);
    console.log(unavailable_times_indexes);

    return unavailable_times_indexes;

  } else {
    console.log(`Error while fetching info doc`);
    return null; // Return null or handle the error case appropriately
  }

};

export const fetchUnavailableTablesOfDate = async (collectionKey, date) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const dateRef = doc(sampleRestaurantRef, date);
  const dateDoc = await getDoc(dateRef);

  if (dateDoc.exists()) {

    const unavailable_tables = dateDoc.data().unavailable_tables;

    console.log(`Unavailable tables of date ${date}:`);
    console.log(unavailable_tables);

    return unavailable_tables;

  } else {
    console.log(`Error while fetching info doc`);
    return null; // Return null or handle the error case appropriately
  }

};

export const fetchUnavailableTablesTimesIndexesOfDate = async (collectionKey, date) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const dateRef = doc(sampleRestaurantRef, date);
  const dateDoc = await getDoc(dateRef);

  if (dateDoc.exists()) {

    const unavailable_tables_times_indexes = dateDoc.data().unavailable_tables_times_indexes;

    console.log(`Unavailable tables times indexes of date ${date}:`);
    console.log(unavailable_tables_times_indexes);

    return unavailable_tables_times_indexes;

  } else {
    console.log(`Error while fetching info doc`);
    return null; // Return null or handle the error case appropriately
  }

};

export const fetchReservationsOfDate = async (collectionKey, date) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const dateRef = doc(sampleRestaurantRef, date);
  const dateDoc = await getDoc(dateRef);

  if (dateDoc.exists()) {

    const reservations = dateDoc.data().reservations;

    console.log(`Reservations of date ${date}:`);
    console.log(reservations);

    return reservations;

  } else {
    console.log(`Error while fetching info doc`);
    return null; // Return null or handle the error case appropriately
  }

};

export const fetchOrdersOfDate = async (collectionKey, date) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const dateRef = doc(sampleRestaurantRef, date);
  const dateDoc = await getDoc(dateRef);

  if (dateDoc.exists()) {

    const orders = dateDoc.data().orders;

    console.log(`Orders of date ${date}:`);
    console.log(orders);

    return orders;

  } else {
    console.log(`Error while fetching info doc`);
    return null; // Return null or handle the error case appropriately
  }

};

export const dateExists = async (collectionKey, date) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const dateRef = doc(sampleRestaurantRef, date);
  const dateDoc = await getDoc(dateRef);
  if (dateDoc.exists()) {
    console.log(`${date} exists.`);
    return true;
  } else {
    console.log(`${date} does not exist.`);
    return false;
  }
  
};

export const fetchInfo = async (collectionKey) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef, "info");
  const infoDoc = await getDoc(infoRef);
  if (infoDoc.exists()) {
    console.log(`Info doc returned:`);
    console.log(infoDoc.data());
    return infoDoc.data();
  } else {
    console.log(`Info doc does not exist.`);
    return false;
  }

};

export const fetchInfoForCustomer = async (collectionKey) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef, "info");
  const infoDoc = await getDoc(infoRef);
  if (infoDoc.exists()) {
    console.log(`Info returned to client:`);
    const infoReturned=[];
    infoReturned[0]=infoDoc.data().reservation_times;
    infoReturned[1]=infoDoc.data().unavailable_days;
    
    const tablesCapacityMap = {};

    for (const table of infoDoc.data().tables) {
        tablesCapacityMap[table.id] = table.capacity;
    }
    infoReturned[2]=tablesCapacityMap;

    infoReturned[3]=infoDoc.data().numberOfDaysToShowToCustomers;
    infoReturned[4]=infoDoc.data().maxCapacity;
    infoReturned[5]=infoDoc.data().maxReservationDurationIndexNumber;
    console.log(infoDoc.data());
    return infoReturned;
  } else {
    console.log(`Info doc does not exist.`);
    return false;
  }

};

export const fetchDateInfo = async (collectionKey,date) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef, date);
  const infoDoc = await getDoc(infoRef);
  const dateInfoToReturn = [];

  if (infoDoc.exists()) {

    console.log(`Date doc received and being adjusted:`);
    dateInfoToReturn[0]=infoDoc.data().unavailable_times_indexes;
    dateInfoToReturn[1]=infoDoc.data().unavailable_tables;
    dateInfoToReturn[2]=infoDoc.data().unavailable_tables_times_indexes;

    const reservations=infoDoc.data().reservations;

    dateInfoToReturn[3] = [...reservations];

    reservations.sort((a, b) => {
      if (a.start_time_index < b.start_time_index) {
          return -1;
      } else if (a.start_time_index > b.start_time_index) {
          return 1;
      } else {
          return 0;
      }
    });

    reservations.sort((a, b) => {
      
      if ((a.accepted===undefined && a.canceled===undefined) && (b.accepted!==undefined || b.canceled!==undefined)){return -1;}
      else if ((b.accepted===undefined && b.canceled===undefined) && (a.accepted!==undefined || a.canceled!==undefined)){return 1;}
      if ((a.accepted!==undefined) && (b.canceled!==undefined)){return -1;}
      else if ((b.accepted!==undefined) && (a.canceled!==undefined)){return 1;}
      if (a.canceled===undefined && b.canceled!==undefined){return -1;}
      else if (a.canceled!==undefined && b.canceled===undefined){return 1;}
      else {return a.name.localeCompare(b.name);}
      
    });

    const reservationsByStartTimeIndex = {};
    // Group reservations by table_id
    reservations.forEach(reservation => {
      const { start_time_index, ...rest } = reservation;
      if (!reservationsByStartTimeIndex[start_time_index]) {
        reservationsByStartTimeIndex[start_time_index] = { start_time_index: start_time_index, reservations: [] };
      }
      reservationsByStartTimeIndex[start_time_index].reservations.push({ ...rest });
    });

    // Convert the object to an array of reservations grouped by table_id
    const reservationsGroupedByStartTimeIndex = Object.values(reservationsByStartTimeIndex);

    console.log("Start time index reservations:");
    console.log(reservationsGroupedByStartTimeIndex);

    dateInfoToReturn[4] = [...reservationsGroupedByStartTimeIndex];

    reservations.sort((a, b) => {
      if ((a.completed===undefined && a.canceled===undefined) && (b.completed!==undefined || b.canceled!==undefined)){return -1;}
      else if ((b.completed===undefined && b.canceled===undefined) && (a.completed!==undefined || a.canceled!==undefined)){return 1;}
      if ((a.completed!==undefined) && (b.canceled!==undefined)){return -1;}
      else if ((b.completed!==undefined) && (a.canceled!==undefined)){return 1;}
      if (a.canceled===undefined && b.canceled!==undefined){return -1;}
      else if (a.canceled!==undefined && b.canceled===undefined){return 1;}
      else {return a.name.localeCompare(b.name);}
      
    });

    dateInfoToReturn[5] = [...reservations];

    // reservations.sort((a, b) => {
    //   if (a.table_id < b.table_id) {
    //     return -1;
    // } else if (a.table_id > b.table_id) {
    //     return 1;
    // } else {
    //     return 0;
    // }
    // });

    const reservationsByTableId = {};

    // Group reservations by table_id
    reservations.forEach(reservation => {
        const { table_id, ...rest } = reservation;
        if (!reservationsByTableId[table_id]) {
            reservationsByTableId[table_id] = { id: table_id, reservations: [] };
        }
        reservationsByTableId[table_id].reservations.push({ ...rest });
    });

    // Convert the object to an array of reservations grouped by table_id
    const reservationsGroupedByTableId = Object.values(reservationsByTableId);

    console.log("Table reservations:");
    console.log(reservationsGroupedByTableId);

    dateInfoToReturn[6] = [...reservationsGroupedByTableId];

    const orders=infoDoc.data().orders;

    dateInfoToReturn[7] = [...orders];

    orders.sort((a, b) => {
      if (a.reservation_id < b.reservation_id) {
          return -1;
      } else if (a.reservation_id > b.reservation_id) {
          return 1;
      } else {
          return 0;
      }
    });

    dateInfoToReturn[8] = [...orders];

    console.log(dateInfoToReturn);

    return dateInfoToReturn;
  } else {
    console.log(`Info doc does not exist.`);
    return false;
  }

};

export const fetchDateInfoForCustomer = async (collectionKey,date) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef, date);
  const infoDoc = await getDoc(infoRef);
  const dateInfoToReturn = [];

  if (infoDoc.exists()) {

    console.log(`Date doc received for customer and being adjusted:`);

    dateInfoToReturn[0]=infoDoc.data().unavailable_times_indexes;
    dateInfoToReturn[1]=infoDoc.data().unavailable_tables;
    dateInfoToReturn[2]=infoDoc.data().unavailable_tables_times_indexes;
    dateInfoToReturn[3]=infoDoc.data().reservations;

    return dateInfoToReturn;
  } else {
      console.log(`Date doc does not exist.`);
    return false;
  }

};

export const fetchInfoForTableReservation = async (collectionKey) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const infoRef = doc(sampleRestaurantRef, "info");
  const infoDoc = await getDoc(infoRef);

  if (infoDoc.exists()) {
    console.log(`TimesMap returned to client:`);

    const infoToReturn = [];

    const timesMap = {};

    for (const time of infoDoc.data().reservation_times) {
      timesMap[time.id] = time.time;
    }


    infoToReturn[0]=timesMap;
    infoToReturn[1]=infoDoc.data().name;

    return infoToReturn;
    
  } else {

    console.log(`Info doc does not exist.`);
    return false;

  }

};

// Fetches table data given the table number

export const fetchTable = async (tableNumber) => {

  const sampleRestaurantRef = collection(db, 'sample-restaurant');
  const tableRef = doc(sampleRestaurantRef, "table"+tableNumber);
  const tableDoc = await getDoc(tableRef);
  if (tableDoc.exists()) {
    return tableDoc.data();
  } else {
    console.log(`Table ${tableNumber} does not exist.`);
  }
};

export const fetchSchedulesTimes = async (date) => {

  const sampleRestaurantRef = collection(db, 'sample-restaurant');
  const currentDateRef = doc(sampleRestaurantRef, date);
  const currentDateDoc = await getDoc(currentDateRef);
  if (currentDateDoc.exists()) {
    return currentDateDoc.data().times;
  } else {
    console.log(`Current date does not exist.`);
  }
};

export const fetchReservations = async (date) => {

  const sampleRestaurantRef = collection(db, 'sample-restaurant');
  const currentDateRef = doc(sampleRestaurantRef, date);
  const currentDateDoc = await getDoc(currentDateRef);
  if (currentDateDoc.exists()) {
    console.log(currentDateDoc.data());
    return currentDateDoc.data().reservations;
  } else {
    console.log(`Current date does not exist.`);
  }
  
};

// export const fetchReservationTimes = async (startIndex, endIndex,date) => {

//   const sampleRestaurantRef = collection(db, 'sample-restaurant');
  
//   const currentDateRef = doc(sampleRestaurantRef, "data");
//   const currentDateDoc = await getDoc(currentDateRef);

//   if (currentDateDoc.exists()) {
//     return [currentDateDoc.data().times[startIndex].time,currentDateDoc.data().times[endIndex].time];
//   } else {
//     console.log(`CurrentDate does not exist.`);
//   }


//   return;
// };

export const fetchTablesAvailability = async (startIndex, endIndex, date) => {

  const sampleRestaurantRef = collection(db, 'sample-restaurant');
  
  const unavailableTables=[];

  const currentDateRef = doc(sampleRestaurantRef, date);

  const currentDateDoc = await getDoc(currentDateRef);
  if (currentDateDoc.exists()) {
    const reservations = currentDateDoc.data().reservations;
    for (let i=0;i<reservations.length;i++){
      if (unavailableTables.includes(reservations[i].table_id)){
        continue;
      }
      if (reservations[i].canceled===undefined && !((reservations[i].startIndex<startIndex && reservations[i].endIndex<startIndex) || (reservations[i].startIndex>endIndex && reservations[i].endIndex>endIndex))){
        unavailableTables.push(reservations[i].table_id);
      }
    }
  } else {
    console.log(`Current date does not exist.`);
  }
  // console.log(availableTables);

  return unavailableTables;
};

export const addNewReservation = async (collectionKey, date, startIndex, endIndex, tableNumber, fullName, phone, email, notes) => {

  
  const sampleRestaurantRef = collection(db, collectionKey);
  const dateRef = doc(sampleRestaurantRef, date);
  const infoRef = doc(sampleRestaurantRef, "info");

  try {

    const dateDoc = await getDoc(dateRef);
    const infoDoc = await getDoc(infoRef);

    if (dateDoc.exists() && infoDoc.exists()) {

      const reservations = dateDoc.data().reservations;
      const currentId = infoDoc.data().reservation_id_counter+1;


      reservations.push({
        name: fullName,
        phone: phone,
        email: email,
        notes: notes,
        start_time_index: startIndex,
        end_time_index: endIndex,
        table_id: tableNumber,
        reservation_id: currentId,
      });


      await updateDoc(infoRef, {
        'reservation_id_counter': currentId
      });

      console.log(dateRef);
      console.log(reservations);

      await updateDoc(dateRef, {
        'reservations': reservations
      });

      console.log(`Added new reservation for table ${tableNumber} from index ${startIndex} to index ${endIndex} on ${date} with reservation id ${currentId+1}`);
    } else {
      console.log(`Date or info doc does not exist.`);
    }

  } catch (error) {

    console.error("Error current date or data", error);

  }

};

export const updateTableSchedules = async (startIndex, endIndex, name, phone, tableNumber, date) => {

  const sampleRestaurantRef = collection(db, 'sample-restaurant');
  const currentDateRef = doc(sampleRestaurantRef, date);
  const dataRef = doc(sampleRestaurantRef, "data");

  try {

    const currentDateDoc = await getDoc(currentDateRef);
    const dataDoc = await getDoc(dataRef);

    if (currentDateDoc.exists() && dataDoc.exists()) {

      const reservations = currentDateDoc.data().reservations;
      const currentId = dataDoc.data().id_counter;

      reservations.push({
        name,
        phone,
        startIndex,
        endIndex,
        table_id: tableNumber,
        reservation_id: currentId,
      });

      console.log(reservations);
      console.log(currentId);

      await updateDoc(dataRef, {
        'idCounter': currentId+1
      });

      console.log(currentId);

      await updateDoc(currentDateRef, {
        [`reservations`]: reservations
      });


      console.log(`Current date updated new reservation for table ${tableNumber} from index ${startIndex} to index ${endIndex} with reservation id ${currentId+1}`);
    } else {
      console.log(`Current date or data does not exist.`);
    }

  } catch (error) {
    console.error("Error current date or data", error);
  }

};

export const cancelReservationByTableNumber = async (collectionKey, reservationId, date) => {


  const sampleRestaurantRef = collection(db, collectionKey);
  const dateRef = doc(sampleRestaurantRef, date);
  const dateDoc = await getDoc(dateRef);

  if (dateDoc.exists()) {

    const reservations = dateDoc.data().reservations;

    let reservationIndex = -1;
      for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].reservation_id === reservationId) {
          reservationIndex = i;
          break;
        }
      }

    if (reservationIndex !== -1) {

      reservations[reservationIndex].canceled = true;
      await updateDoc(dateRef, { reservations });
      console.log(`Reservation with id: ${reservationId} was canceled.`);

    }
    else {
      console.log(`Reservation with id: ${reservationId} wasn't found.`);
    }

  } else {
    console.log(`Error while fetching date doc`);
    return null; // Return null or handle the error case appropriately
  }

};

export const completeReservationByTableNumber = async (collectionKey, reservationId, date) => {

  const sampleRestaurantRef = collection(db, collectionKey);
  const dateRef = doc(sampleRestaurantRef, date);
  const dateDoc = await getDoc(dateRef);

  if (dateDoc.exists()) {

    const reservations = dateDoc.data().reservations;

    let reservationIndex = -1;
      for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].reservation_id === reservationId) {
          reservationIndex = i;
          break;
        }
      }

    if (reservationIndex !== -1) {

      reservations[reservationIndex].completed = true;
      await updateDoc(dateRef, { reservations });
      console.log(`Reservation with id: ${reservationId} was completed.`);

    }
    else {
      console.log(`Reservation with id: ${reservationId} wasn't found.`);
    }

  } else {
    console.log(`Error while fetching date doc`);
    return null; // Return null or handle the error case appropriately
  }

};

export const attemptLogin = async (username,password) => {
  try {
    await signInWithEmailAndPassword(auth,username, password);
    console.log('Logged in successfully!');
    return true;
  } catch (error) {
    console.error('Error logging in:', error.message);
    return false;
  }
};