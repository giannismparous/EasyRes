import React, { useEffect, useState } from 'react';
import '../styles/Calendar.css';

const Calendar = ({ month, year, day, onDateSelect, showEditOpen, unavailableDays: initialUnavailableDays, updateUnavailableDays  }) => {

    const [isMouseDown, setIsMouseDown] = useState(false);
    const [unavailableDays, setUnavailableDays] = useState(initialUnavailableDays);

    const handleDateSelect = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
        const [selectedDay, selectedMonth, selectedYear] = formattedDate.split('-').map(part => parseInt(part, 10));
        const formattedDateString = `${selectedDay}-${selectedMonth}-${selectedYear}`;
        onDateSelect(formattedDateString);
    };

    const isSelectedDay = (dayIndex) => {
        return day === dayIndex;
    }

    const generateDaysArray = () => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    const isCurrentDay = (currentDay) => {
        return currentDay === day;
    };

    useEffect(() => {
        console.log('Props updated: day:', day, 'month:', month, 'year:', year);
    }, [day, month, year]);


    const monthName = new Date(year, month).toLocaleDateString(undefined, { month: 'long' }); // Get the month name

    function chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    const handleMouseDown = (day) => {
        if (showEditOpen) {
            setIsMouseDown(true);
            toggleUnavailableDay(day);
        }
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const toggleUnavailableDay = (day) => {
        const formattedDate = `${day}-${month + 1}-${year}`;
        console.log(formattedDate)
        const index = unavailableDays.indexOf(formattedDate);
        console.log(index)
        if (index !== -1) {
            const updatedUnavailableDays = [...unavailableDays.slice(0, index), ...unavailableDays.slice(index + 1)];
            setUnavailableDays(updatedUnavailableDays);
            updateUnavailableDays(updatedUnavailableDays);
        } else {
            const updatedUnavailableDays = [...unavailableDays, formattedDate];
            setUnavailableDays(updatedUnavailableDays);
            updateUnavailableDays(updatedUnavailableDays);
        }
    };

    const handleMouseEnter = (day) => {
        if (showEditOpen && isMouseDown) {
            toggleUnavailableDay(day);
        }
    };

    return (
        <div className="calendar-container">
            <div className="calendar">
                <div className="calendar-header">
                    {monthName}
                </div>
                <table className="calendar-table">
                    <tbody>
                        {chunkArray(generateDaysArray(), 7).map((week, weekIndex) => (
                            <tr key={weekIndex}>
                                {week.map(day => {
                                    const unavailable = unavailableDays.includes(`${day}-${month + 1}-${year}`);
                                    return (
                                        <td
                                            key={day}
                                            className={`day-box ${isSelectedDay(day) ? 'selected' : ''} ${unavailable ? 'unavailable-day' : ''}`}
                                            onMouseDown={() => handleMouseDown(day)}
                                            onMouseUp={handleMouseUp}
                                            onMouseEnter={() => handleMouseEnter(day)}
                                            onClick={() => {
                                                if (!showEditOpen)handleDateSelect(new Date(year, month, day))}
                                            }
                                        >
                                            {day}
                                        </td>
                                    );
                                })}
                                {/* Fill in empty cells if the week doesn't have 7 days */}
                                {week.length < 7 && (
                                    new Array(7 - week.length).fill(null).map((_, emptyIndex) => (
                                        <td key={`empty-${emptyIndex}`} className="empty-cell"></td>
                                    ))
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Calendar;
