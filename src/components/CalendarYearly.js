// CalendarYearly.js

import React, { useState, useEffect } from 'react';
import '../styles/CalendarYearly.css'; 
import Calendar from './Calendar';

const CalendarYearly = ({ onDateSelect, selectedDate, showEditOpen, unavailableDays, setUnavailableDays}) => {

    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedDay, setSelectedDay] = useState();

    const handleDateSelect = (date) => {
        onDateSelect(date);
    };

    useEffect(() => {
        const [day, month, year] = selectedDate.split('-').map(part => parseInt(part));
        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedDay(day);
    }, [selectedDate, setSelectedYear, setSelectedMonth, setSelectedDay]);

    const [unavailableDaysByMonth, setUnavailableDaysByMonth] = useState([]);

    useEffect(() => {
        // Initialize an array with 12 empty arrays
        const initialArray = Array.from({ length: 12 }, () => []);

        // Group unavailableDays by month
        const groupedUnavailableDays = unavailableDays.reduce((acc, date) => {
            const [day, month, year] = date.split('-').map(part => parseInt(part));
            acc[month - 1].push(date); // Month is 0-indexed in JavaScript Date object
            return acc;
        }, initialArray);

        setUnavailableDaysByMonth(groupedUnavailableDays);
    }, [unavailableDays]);

    const updateUnavailableDays = (monthIndex, updatedUnavailableDays) => {
        const updatedUnavailableDaysByMonth = [...unavailableDaysByMonth];
        updatedUnavailableDaysByMonth[monthIndex] = updatedUnavailableDays;
        setUnavailableDaysByMonth(updatedUnavailableDaysByMonth);
    };

    useEffect(() => {
        // Function to merge all arrays in unavailableDaysByMonth into a single array
        const mergedUnavailableDays = unavailableDaysByMonth.reduce((acc, month) => acc.concat(month), []);
        // Update unavailableDays with the merged array
        updateMergedUnavailableDays(mergedUnavailableDays);
    }, [unavailableDaysByMonth]);

    const updateMergedUnavailableDays = (mergedUnavailableDays) => {
        // Update unavailableDays with the merged array
        setUnavailableDays(mergedUnavailableDays);
    };

    return (
        <div className="calendar-yearly-container">
            <h2>{selectedYear}</h2>
            <div className="calendar-yearly">
                {[...Array(12).keys()].map(monthIndex => (
                    <Calendar
                        key={`${selectedYear}-${monthIndex}`}
                        month={monthIndex}
                        year={selectedYear}
                        day={monthIndex+1 === selectedMonth ? selectedDay : -1}
                        onDateSelect={handleDateSelect}
                        showEditOpen={showEditOpen}
                        unavailableDays={unavailableDaysByMonth[monthIndex]}
                        updateUnavailableDays={(updatedUnavailableDays) => updateUnavailableDays(monthIndex, updatedUnavailableDays)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CalendarYearly;
