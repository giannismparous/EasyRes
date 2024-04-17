// CalendarYearly.js

import React, { useState, useEffect } from 'react';
import '../styles/CalendarYearly.css'; 
import Calendar from './Calendar';

const CalendarYearly = ({ onDateSelect, selectedDate }) => {

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
                    />
                ))}
            </div>
        </div>
    );
};

export default CalendarYearly;
