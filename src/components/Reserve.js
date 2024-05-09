import React, { useEffect, useState } from 'react';
import {fetchDateInfoForCustomer, fetchDatesAvailability, fetchInfoForCustomer, fetchSchedulesTimes, fetchTablesAvailability, getCurrentDate, getDateRange } from './firebase.utils';
import '../styles/Reserve.css'; // Import CSS file for styling
import { ClockLoader } from 'react-spinners';
import { Helmet } from 'react-helmet-async';

const Reserve = () => {
 
  useEffect(() => {

    const getNextDays = (numberOfDays) => {
      const dates = [];
      const currentDate = new Date();
      
      for (let i = 0; i < numberOfDays; i++) {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1; // Month is zero-based
          const day = currentDate.getDate();
          const dateString = `${day}-${month}-${year}`;
          dates.push(dateString);
          
          currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
  }

    const getInfoFromServer = async (collectionKey) => {
        
      try {

          const response = await fetchInfoForCustomer(collectionKey);

          setLoading(true); 

          const reservationsTimesMap = {};

            response[0].forEach(item => {
                reservationsTimesMap[item.id] = item.time;
            })

          setTimesMap(reservationsTimesMap);
          setUnavailableDays(response[1]);
          setTablesCapacityMap(response[2]);
          setDaysToShow(getNextDays(response[3]).filter(date => !response[1].includes(date)));
          setMaxCapacity(response[4]);
          setMaxReservationDurationIndexNumber(parseInt(response[5]));
          setLoading(false);

        }
        catch (error) {

          console.error("Error checking document: ", error);

        }

      };


    const collectionKey = 'sample-restaurant';
    getInfoFromServer(collectionKey);
    
  }, []);

  const handleDateButtonClick = (date) => {

    setChoosingTime(true);
    setSelectedDate(date);
    getDateInfoFromServer('sample-restaurant', date);
    
  };

  const handleTimeButtonClick = (timeIndex) => {

    setChoosingTime(false);
    setChoosingCapacity(true);
    setSelectedTimeIndex(parseInt(timeIndex));
    
  };

  const handleCapacityButtonClick = (capacity) => {

    setSelectedCapacity(capacity);

  };

  const handleOkButtonClick = () => {

    const redTables = [...unavailableTables];

    for (const tableId in tablesCapacityMap) {
      if (redTables.includes(tableId))continue;
      if (tablesCapacityMap.hasOwnProperty(tableId)) {
          const capacity = tablesCapacityMap[tableId];
          if (capacity < selectedCapacity) {
            redTables.push(parseInt(tableId));
          }
      }
  }

    for (const table of unavailableTablesTimesIndexes) {
      if (redTables.includes(table.table_id))continue;
      let isAvailable = true;
      for (const timeIndex of table.times_indexes) {
          if (selectedTimeIndex >= timeIndex.start_time_index && selectedTimeIndex <= timeIndex.end_time_index) {
              isAvailable = false;
              break;
          }
      }
      if (!isAvailable) {
        redTables.push(table.table_id);
      }
    }

    for (const reservation of reservations) {
      if (redTables.includes(reservation.table_id) || reservation.canceled===true || reservation.completed===true ){
        continue;
      }
      if (selectedTimeIndex >= reservation.start_time_index - maxReservationDurationIndexNumber && selectedTimeIndex <= reservation.start_time_index + maxReservationDurationIndexNumber) {
        redTables.push(reservation.table_id);
      }

    }

    console.log("Red tables:")
    console.log(redTables);

    const data = {
              eventName: 'ReservationTimeSelected',
              redTables: redTables,
              collectionKey: "sample-restaurant",
              date: selectedDate,
              startIndex: selectedTimeIndex,
              endIndex: selectedTimeIndex+maxReservationDurationIndexNumber,
              people: selectedCapacity
            };
            
    window.parent.postMessage(data, '*');

  };

  const getDateInfoFromServer = async (collectionKey,date) => {
        
    try 
      {

        const response = await fetchDateInfoForCustomer(collectionKey,date);

        if (!response){
          setTimesMap([]);
          return;
        }

        setLoading(true); 
        setUnavailableTimesIndexes(response[0]);
        
        // console.log(Object.keys(timesMap).filter(key => !(key >= response[0][0]["start_time_index"] && key <= response[0][0]["end_time_index"])));

        const filteredMap = {};

        // Iterate through each key-value pair in timesMap
        for (const [key, value] of Object.entries(timesMap)) {
            let isInTimeRange = false;

            // Iterate through each object in response[0]
            for (const timeRange of response[0]) {
                // Check if key falls within any time range
                if (key >= timeRange.start_time_index && key <= timeRange.end_time_index) {
                    isInTimeRange = true;
                    break;
                }
            }

            // If key is not in any time range, add it to filteredMap
            if (!isInTimeRange) {
                filteredMap[key] = value;
            }
        }

        setTimesMap(filteredMap);
        setUnavailableTables(response[1]);
        setUnavailableTablesTimesIndexes(response[2]);
        setReservations(response[3]);
        setLoading(false);

      }
      catch (error) {

        console.error("Error checking document: ", error);

      }

    };
  
  const [timesMap, setTimesMap] = useState([]);
  const [unavailableDays, setUnavailableDays] = useState([]);
  const [tablesCapacityMap, setTablesCapacityMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysToShow,setDaysToShow] = useState(0);
  const [choosingTime, setChoosingTime] = useState(false);
  const [maxCapacity, setMaxCapacity] = useState(false);
  const [choosingCapacity, setChoosingCapacity] = useState(false);
  const [unavailableTimesIndexes, setUnavailableTimesIndexes] = useState([]);
  const [selectedDate,setSelectedDate] = useState("");
  const [selectedTimeIndex,setSelectedTimeIndex] = useState(0);
  const [selectedCapacity,setSelectedCapacity] = useState(1);
  const [maxReservationDurationIndexNumber,setMaxReservationDurationIndexNumber] = useState(7);
  const [unavailableTables,setUnavailableTables] = useState([]);
  const [unavailableTablesTimesIndexes,setUnavailableTablesTimesIndexes] = useState([]);
  const [reservations,setReservations] = useState([]);
  
  return (
    <div>
      <Helmet>
        <title>Home - HermesView</title>  
        <meta name="description" content="Make a reservation."/>
        <link rel="canonical" href="/reserve"/>
        <meta name='robots' content='noindex'/>
      </Helmet>
      {loading ? (
                  <div className="loading-spinner">
                      <ClockLoader type="Grid" color="#007bff" size={80}/>
                  </div>
                ) : (
                  <>
                    {!choosingTime && !choosingCapacity && <div className='reserve-container'>
                      <h2>Choose a day:</h2>
                      {daysToShow.map((day, index) => (
                        <button key={index} onClick={() => handleDateButtonClick(day)}>
                          {day}
                        </button>
                      ))}
                    </div>}
                    {choosingTime && !choosingCapacity && <div className='reserve-container'>
                      <h2>Choose time:</h2>
                      {timesMap.length===0 && <h2>No available reservation times for this date.</h2>}
                      {Object.entries(timesMap).map(([key, value]) => (
                      <button key={key} onClick={() => handleTimeButtonClick(key)}>
                        {value}
                      </button>
                    ))}
                    </div>}
                    {!choosingTime && choosingCapacity && <div className='reserve-container'>
                      <h2>Choose capacity:</h2>
                      {maxCapacity === 0 ? (
                        <h2>No available options.</h2>
                      ) : (
                        <select className='select-capacity-dropdown' onChange={(e) => handleCapacityButtonClick(e.target.value)}>
                          {[...Array(maxCapacity).keys()].map((num) => (
                            <option key={num + 1} value={num + 1}>
                              {num + 1}
                            </option>
                          ))}
                        </select>
                      )}
                      <button className='ok-button' onClick={() => handleOkButtonClick()}>OK</button>
                    </div>}
                  </>
              )}
    </div>
  );
};

export default Reserve;

// const [dates,setDates] = useState([]);
// const [times, setTimes] = useState([]);
// const [clickedIndex, setClickedIndex] = useState(null);
// const [maxIndex, setMaxIndex] = useState(null);
// const [choosingReservationDate, setChoosingReservationDate] = useState(false);
// const [showConfirmation, setShowConfirmation] = useState(false);
// const [selectedDate, setSelectedDate] = useState(false);
// const [dateSelected, setDateSelected] = useState("");
// const [datesFetched, setDatesFetched] = useState(false);
// const [timesFetched, setTimesFetched] = useState(false); 

// const handleButtonClickTime = (index) => {
//   if (choosingReservationDate) {
//     if (index < clickedIndex || index > maxIndex) {
//       setChoosingReservationDate(!choosingReservationDate);
//     } else {
//       setMaxIndex(index);
//       setShowConfirmation(true); // Show confirmation popup
//     }
//   } else {
//     if (times[index].unavailable === true) {
//       alert("Can't book this date");
//       return;
//     }
//     let num = 0;
//     for (let i = index + 1; i < index + maxIndexForward; i++) {
//       const time = times[i];
//       if (time.unavailable === undefined) {
//         num = num + 1;
//       } else {
//         break; // Exit the loop if table.name is not null
//       }
//     }
//     setClickedIndex(index);
//     setMaxIndex(index + num);
//     setChoosingReservationDate(!choosingReservationDate);
//   }
// };

// const handleConfirmation = (confirmed) => {
//   if (confirmed) {
//     handleTablesFetch();
//   }
//   else {
//     setChoosingReservationDate(false);
//   }
//   setShowConfirmation(false);
// };

// const handleTablesFetch = async () => {
//   fetchTablesAvailability(clickedIndex, maxIndex, getCurrentDate())
//     .then(unavailableTables => {
//       const data = {
//         eventName: 'ReservationTimeSelected',
//         redTables: unavailableTables,
//         startIndex: clickedIndex,
//         endIndex: maxIndex
//       };
//       console.log(unavailableTables);
//       window.parent.postMessage(data, '*');
//     })
//     .catch(error => {
//       console.error('Error fetching tables availability:', error);
//       // Handle error if needed
//     });
// };

{/* {(!timesFetched && selectedDate) || (!datesFetched) && (
        <div className="loading-overlay">
          <div className="loader-container">
            <HashLoader type="Grid" color="#8a5a00" size={80}/>
          </div>
        </div>
      )}
      <div className="calendar-buttons">
        {!selectedDate && dates.map((date, index) => (
          <button
            key={index}
            className={`
              ${date.unavailable ? 'calendar-button-green' : 'calendar-button-green'}
              ${choosingReservationDate && clickedIndex !== null && (index < clickedIndex || index > maxIndex) && 'grayed-out'}
            `}
            onClick={() => handleButtonClickDate(index)}
          >
            {date.date}
          </button>
        ))}
        {selectedDate && times.map((time, index) => (
          <button
            key={time.id}
            className={`
              ${time.unavailable === undefined ? 'calendar-button-green' : 'calendar-button-red'}
              ${choosingReservationDate && clickedIndex !== null && (index < clickedIndex || index > maxIndex) && 'grayed-out'}
            `}
            onClick={() => handleButtonClickTime(index)}
          >
            {time.time}
          </button>
        ))}
      </div>
      {showConfirmation && (
        <div className="confirmation-popup">
          <p>Are you sure you want to look for tables for these dates?</p>
          <div>
            <button onClick={() => handleConfirmation(true)}>Yes</button>
            <button onClick={() => handleConfirmation(false)}>No</button>
          </div>
        </div>
      )} */}

  // useEffect(() => {
  //   if (dateSelected) {
  //     const handleFetchTimes = async () => {
  //       const fetchedTimes = await fetchSchedulesTimes(dateSelected);
  //       setTimes(fetchedTimes);
  //       setTimesFetched(true);
  //     };
  
  //     handleFetchTimes();
  //   }
  // }, [dateSelected]);

  // const handleButtonClickDate = (index) => {
  //   setDateSelected(dates[index].date);
  //   setSelectedDate(true);
  // };