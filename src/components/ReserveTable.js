import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ReserveTable.css'; // Import your CSS file
import { addNewReservation, fetchInfoForTableReservation, fetchReservationTimes, fetchReservationTimesMapForCustomer, getCurrentDate, updateTableSchedules } from './firebase.utils';
import { ClockLoader } from 'react-spinners';

const ReserveTable = () => {

    const {collectionKey, reservationDate, reservationStartTimeIndex, reservationEndTimeIndex, tableNumber, people } = useParams();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [name, setName] = useState("");
    const [reservationTimesFetched, setReservationTimesFetched] = useState();
    const [bookedReservation, setBookedReservation] = useState();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [notes, setNotes] = useState('');
    const [smokes, setSmokes] = useState(false);

    const handleSmokesCheckboxChange = () => {
        setSmokes(!smokes);
    };

    useEffect(() => {

        const fetchData = async (collectionKey) => {
            try {

                const response = await fetchInfoForTableReservation(collectionKey);
                setStartTime(response[0][reservationStartTimeIndex]);
                setEndTime(response[0][reservationEndTimeIndex]);
                setName(response[1]);
                setReservationTimesFetched(true);

            } catch (error) {

                console.error('Error fetching reservation times:', error);
                
            }
        };

        fetchData(collectionKey); // Fetch reservation times when component mounts
    }, [reservationStartTimeIndex, reservationEndTimeIndex, tableNumber, collectionKey]); // Run effect when these parameters change

    const handleYesClick = async () => {
        try {
            console.log(collectionKey)
            console.log(reservationDate)
            console.log(tableNumber)
            console.log(reservationStartTimeIndex)
            console.log(reservationEndTimeIndex)
            console.log(people)
            // Call updateTableSchedule with the appropriate parameters
            await addNewReservation(collectionKey, reservationDate, parseInt(reservationStartTimeIndex), parseInt(reservationEndTimeIndex), parseInt(tableNumber), fullName, phone, email, notes, parseInt(people), smokes);
            // Optionally, you can redirect the user to a confirmation page or do other actions upon successful reservation
            console.log('Table reserved successfully!');
            setBookedReservation(true);
        } catch (error) {
            console.error('Error reserving table:', error);
            // Handle error here
        }
    };

    const handleNoClick = () => {
        const data = {
            eventName: 'BookingReservationDeclined',
          };
          window.parent.postMessage(data, '*');
    };

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
    };

    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    };
    
    return (
        <div className="reservation-container">
            <meta name="description" content="Reserve a table now."/>
            <meta name='robots' content='noindex'/>
            <div className="reservation-details-reserve-table">
                {!reservationTimesFetched && !bookedReservation && 
                <div className='loading-container'>
                    <ClockLoader type="Grid" color="#007bff" size={80} />
                </div>}
                {reservationTimesFetched && !bookedReservation && (
                    <>
                        <h2>Reservation Details</h2>
                        <p>Restaurant Name: {name}</p>
                        <p>Reservation Time: {`${startTime} - ${endTime}`}</p>
                        <p>Table Number: {tableNumber}</p>
                        <p className='names-container'>
                            <label htmlFor="fullName">Full Name:</label>
                            <input type="text" id="fullName" className='name-input' value={fullName} onChange={handleFullNameChange} />
                        </p>
                        <p className='info-container'>
                            <label htmlFor="userPhone">Phone:</label>
                            <input type="text" id="userPhone" value={phone} onChange={handlePhoneChange} />
                            <label htmlFor="userEmail">Email:</label>
                            <input type="email" id="userEmail" value={email} onChange={handleEmailChange} />
                        </p>
                        <p className='notes-container'>
                            <label htmlFor="userNotes">Notes:</label>
                            <input type="text" id="userNotes" value={notes} onChange={handleNotesChange} />
                        </p>
                        <label>
                            <input type="checkbox" name="smokes" checked={smokes} onChange={handleSmokesCheckboxChange} />
                            Smokes
                        </label>
                        <p className="confirmation-text">Are you sure you want to reserve?</p>
                        <div className="button-container">
                            <button className="yes-button" onClick={handleYesClick} disabled={fullName.trim() === "" || (phone.trim() === "" && email.trim() === "")}>Yes</button>
                            <button className="no-button" onClick={handleNoClick}>No</button>
                        </div>
                    </>
                )}
                {bookedReservation && <p>Thank you for booking!</p>}
            </div>
        </div>
    );
    };

export default ReserveTable;