import React, { useEffect, useState } from 'react';
import {fetchDateInfoForCustomer, fetchDatesAvailability, fetchInfoForCustomer, fetchSchedulesTimes, fetchTablesAvailability, getCurrentDate, getDateRange } from './firebase.utils';
import '../styles/Reserve.css'; // Import CSS file for styling
import { ClockLoader } from 'react-spinners';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';

const Reserve = () => {

  const navigate = useNavigate();

  const { collectionKey, mode } = useParams();
 
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
          setTablesSmokeFriendlyMap(tablesSmokeFriendlyMap);
          setDaysToShow(getNextDays(response[3]).filter(date => !response[1].includes(date)));
          setMaxCapacity(response[4]);
          setMaxReservationDurationIndexNumber(parseInt(response[5]));
          setTablesSmokeFriendlyMap(response[6]);
          setLoading(false);

        }
        catch (error) {

          console.error("Error checking document: ", error);

        }

      };


    getInfoFromServer(collectionKey);
    
  }, [collectionKey]);

  const handleDateButtonClick = (date) => {

    setChoosingTime(true);
    setSelectedDate(date);
    getDateInfoFromServer(collectionKey, date);
    
  };

  const handleTimeButtonClick = (timeIndex) => {

    setChoosingTime(false);
    setChoosingCapacity(true);
    setSelectedTimeIndex(parseInt(timeIndex));
    
  };

  const handleCapacityButtonClick = (capacity) => {

    setSelectedCapacity(capacity);

  };

  const handleSmokingChange = (e) => {
    setSmokes(e.target.value === 'option1'); // If 'option1' is selected, set smokes to true, otherwise false
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

    if (smokes===true){
      for (const tableId in tablesSmokeFriendlyMap) {
        if (redTables.includes(tableId))continue;
        if (tablesSmokeFriendlyMap.hasOwnProperty(tableId)) {
            const smokeFriendly = tablesSmokeFriendlyMap[tableId];
            if (smokeFriendly === false) {
              redTables.push(parseInt(tableId));
            }
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

    if (parseInt(mode) === 1){

      const data = {
        eventName: 'ReservationTimeSelected',
        redTables: redTables,
        collectionKey: collectionKey,
        date: selectedDate,
        startIndex: selectedTimeIndex,
        endIndex: selectedTimeIndex+maxReservationDurationIndexNumber,
        people: selectedCapacity
      };
      
      window.parent.postMessage(data, '*');

    }
    else if (parseInt(mode) === 2){

      const availableTables = [];
      const size = Object.keys(tablesCapacityMap).length;

      // Iterate through tablesCapacityMap to find available tables

      
      for (let i = 1; i <= size; i++) {
        // If the table id is not in the redTables array (i.e., it's available)
        if (!redTables.includes(i)) {
          availableTables.push(i); // Add the table id to availableTables array
        }
      }

      // If there are available tables
      if (availableTables.length > 0) {
        // Randomly select a table id from availableTables array
        const randomTableId = availableTables[Math.floor(Math.random() * availableTables.length)];
        console.log("Randomly selected available table id:", randomTableId);
        navigate(`/reserve/${collectionKey}/${selectedDate}/${selectedTimeIndex}/${selectedTimeIndex + maxReservationDurationIndexNumber}/${randomTableId}`);

      } else {
        console.log("No available tables.");
        // Handle the case when no tables are available
      }

    }

    

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
  const [tablesSmokeFriendlyMap, setTablesSmokeFriendlyMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysToShow,setDaysToShow] = useState(0);
  const [choosingTime, setChoosingTime] = useState(false);
  const [maxCapacity, setMaxCapacity] = useState(false);
  const [choosingCapacity, setChoosingCapacity] = useState(false);
  const [unavailableTimesIndexes, setUnavailableTimesIndexes] = useState([]);
  const [selectedDate,setSelectedDate] = useState("");
  const [selectedTimeIndex,setSelectedTimeIndex] = useState(0);
  const [selectedCapacity,setSelectedCapacity] = useState(1);
  const [smokes,setSmokes] = useState(false);
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
                    {!choosingTime && choosingCapacity && (
                      <div className='reserve-container'>
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
                        <h2>Do you smoke?</h2>
                        <form>
                          <input type="radio" id="option1" name="smoking" value="option1" onChange={handleSmokingChange} checked={smokes}/>
                          <label htmlFor="option1">Yes</label><br />
                          <input type="radio" id="option2" name="smoking" value="option2" onChange={handleSmokingChange} checked={!smokes}/>
                          <label htmlFor="option2">No</label><br />
                        </form>
                        <button className='ok-button' onClick={() => handleOkButtonClick(mode)}>OK</button>
                      </div>
                    )}
                  </>
              )}
    </div>
  );
};

export default Reserve;