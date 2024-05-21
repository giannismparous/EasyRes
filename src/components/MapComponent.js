import React, { useState, useRef } from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';
import '../styles/MapComponent.css'; // Import CSS file

const MapComponent = ({ tables, unavailableTables, currentTablesReservations, setTables, setUnavailableTables }) => {

  const states = [
    { id: 4, title: "Arrived" },
    { id: 5, title: "Ordered" },
    { id: 6, title: "Paid" },
  ];

  const radius = 50;

  const [updatedTables, setUpdatedTables] = useState(tables);
  const [updatedUnavailableTables, setUpdatedUnavailableTables] = useState(unavailableTables);
  const [showPopup, setShowPopup] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const [reservationDetails, setReservationDetails] = useState({
    name: '',
    phone: '',
    email: '',
    table_id: '',
    people: '',
    reservation_id: '',
    state: '',
    smokes: false,
    notes: '',
  });
  const [isEditReservation, setIsEditReservation] = useState(false);

  const longPressTimeout = useRef(null);
  const initialPosition = useRef(null);
  const finalPosition = useRef(null);

  const handleDragEnd = (index, event) => {
    const { x, y } = event.target.attrs;
    const updatedTable = { ...updatedTables[index], x, y };
    const newTables = [...updatedTables];
    newTables[index] = updatedTable;
    setUpdatedTables(newTables);
    setTables(newTables);
  };

  const handleTableClick = (table) => {
    const tableReservations = currentTablesReservations.filter(reservation => reservation.table_id === table.id);
    const stateReservation = tableReservations.find(reservation => reservation.state === 4 || reservation.state === 5);
    
    if (stateReservation) {
      setIsEditReservation(true);
      setReservationDetails({
        name: stateReservation.name || '',
        phone: stateReservation.phone || '',
        email: stateReservation.email || '',
        table_id: table.id,
        people: stateReservation.people || '',
        reservation_id: stateReservation.reservation_id || '',
        state: stateReservation.state || '',
        smokes: stateReservation.smokes || false,
        notes: stateReservation.notes || '',
      });
      setShowPopup(true);
    } else {
      const tempUpdatedUnavailableTables = updatedUnavailableTables.includes(table.id)
        ? updatedUnavailableTables.filter(id => id !== table.id)
        : [...updatedUnavailableTables, table.id];

      setUpdatedUnavailableTables(tempUpdatedUnavailableTables);
      setUnavailableTables(tempUpdatedUnavailableTables);
    }
  };

  // const handleTableDoubleClick = (table) => {
  //   const tableReservations = currentTablesReservations.filter(reservation => reservation.table_id === table.id);
  //   const stateReservation = tableReservations.find(reservation => reservation.state === 4 || reservation.state === 5);

  //   if (!stateReservation) {
  //     setIsEditReservation(false);
  //     setReservationDetails({
  //       name: '',
  //       phone: '',
  //       email: '',
  //       table_id: table.id,
  //       people: '',
  //       reservation_id: '',
  //       state: '',
  //       smokes: false,
  //       notes: '',
  //     });
  //     setShowPopup(true);
  //   }
  // };

  const handleMouseDown = (event, table) => {
    initialPosition.current = { x: table.x, y: table.y };
    setIsLongPress(false);
    longPressTimeout.current = setTimeout(() => {

      const tableReservations = currentTablesReservations.filter(reservation => reservation.table_id === table.id);
      const stateReservation = tableReservations.find(reservation => reservation.state === 4 || reservation.state === 5);

      if (stateReservation){

      }
      else {
        setIsLongPress(true);
        setIsEditReservation(false);
        setReservationDetails({
          name: '',
          phone: '',
          email: '',
          table_id: table.id,
          people: '',
          reservation_id: '',
          state: '',
          smokes: false,
          notes: '',
        });
        setShowPopup(true);
      }

    }, 1000); // 1 second long press
  };

  const handleMouseUp = (event, table) => {
    clearTimeout(longPressTimeout.current);
    finalPosition.current = { x: table.x, y: table.y };

    const tableReservations = currentTablesReservations.filter(reservation => reservation.table_id === table.id);

    if (!isLongPress && (initialPosition.current.x === finalPosition.current.x && initialPosition.current.y === finalPosition.current.y)) {
      handleTableClick(table);
    }
  };

  const handleMouseMove = (event, table) => {
    if (initialPosition.current) {
      const { x, y } = event.target.position();
      const movedTooMuch = Math.abs(initialPosition.current.x - x) > 5 || Math.abs(initialPosition.current.y - y) > 5;
      if (movedTooMuch) {
        clearTimeout(longPressTimeout.current);
      }
    }
  };

  const handleReservationChange = (event) => {
    const { name, value, type, checked } = event.target;
    setReservationDetails(prevDetails => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 

  const saveReservation = () => {
    // Save the reservation details to the state or send to backend
    // Assuming `currentTablesReservations` is updated via props
    // Add or update reservation logic here
    setShowPopup(false);
  };

  return (
    <div>
      <div className='map'>
        <Stage width={window.innerWidth} height={window.innerHeight - 100}>
          <Layer>
            {updatedTables.map((table, index) => {
              // Check if the table has any current reservations with state 4 or 5
              const tableReservations = currentTablesReservations.filter(reservation => reservation.table_id === table.id);
              const stateReservation = tableReservations.find(reservation => reservation.state === 4 || reservation.state === 5);
              const stateNumber = stateReservation ? stateReservation.state : null;
              return (
                <React.Fragment key={table.id}>
                  <Circle
                    x={table.x}
                    y={table.y}
                    radius={radius}
                    fill={
                      stateNumber === 4 // State number 4 represents "Arrived"
                        ? 'blue'
                        : stateNumber === 5 // State number 5 represents "Ordered"
                        ? 'green'
                        : stateNumber === 6 // State number 6 represents "Paid"
                        ? 'orange'
                        : updatedUnavailableTables.includes(table.id) // Default color if not arrived, ordered or paid
                        ? 'red'
                        : 'black'
                    }
                    draggable // Make tables draggable
                    onDragMove={(event) => {
                      handleMouseMove(event, table);
                      const { x, y } = event.target.position();
                      const newTables = [...updatedTables];
                      newTables[index] = { ...newTables[index], x, y };
                      setUpdatedTables(newTables);
                      setTables(newTables); // Update tables in ParentComponent
                    }}
                    onDragEnd={(event) => handleDragEnd(index, event)}
                    onMouseDown={(event) => handleMouseDown(event, table)}
                    onMouseUp={(event) => handleMouseUp(event, table)}
                    onMouseMove={(event) => handleMouseMove(event, table)}
                    onTouchStart={(event) => handleMouseDown(event, table)}
                    onTouchEnd={(event) => handleMouseUp(event, table)}
                    onTouchMove={(event) => handleMouseMove(event, table)}
                    // onDblClick={() => handleTableDoubleClick(table)}
                    // onDblTap={() => handleTableDoubleClick(table)}
                  />
                  <Text
                    x={table.x - 5} // Adjust text position to center
                    y={table.y - 5}
                    text={table.id.toString()} // Display table id
                    fill="white"
                  />
                  {stateNumber && (
                    <Text
                      x={table.x - 20} // Adjust text position to center
                      y={table.y + 10}
                      text={states.find(state => state.id === stateNumber).title} // Display state number
                      fill="yellow"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
      </div>
      {showPopup && (
        <div className='map-table-popup-window' onClick={() => setShowPopup(false)}>
          <div className='map-table-popup-window-container' onClick={(e) => e.stopPropagation()}>
            {isEditReservation ? (
              <>
                <p>Reservation Info</p>
                <label>
                  State:
                  <select
                    name="state"
                    value={reservationDetails.state}
                    onChange={handleReservationChange}
                  >
                    <option value="4">Arrived</option>
                    <option value="5">Ordered</option>
                    <option value="6">Paid</option>
                  </select>
                </label>
                <label>
                  Notes:
                  <textarea
                    name="notes"
                    value={reservationDetails.notes}
                    onChange={handleReservationChange}
                  />
                </label>
              </>
            ) : (
              <>
                <p>New Reservation</p>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={reservationDetails.name}
                    onChange={handleReservationChange}
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    name="phone"
                    value={reservationDetails.phone}
                    onChange={handleReservationChange}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={reservationDetails.email}
                    onChange={handleReservationChange}
                  />
                </label>
                <label>
                  Table ID:
                  <input
                    type="text"
                    name="table_id"
                    value={reservationDetails.table_id}
                    readOnly
                  />
                </label>
                <label>
                  People:
                  <input
                    type="number"
                    name="people"
                    value={reservationDetails.people}
                    onChange={handleReservationChange}
                  />
                </label>
                <label>
                  Reservation ID:
                  <input
                    type="text"
                    name="reservation_id"
                    value={reservationDetails.reservation_id}
                    readOnly
                  />
                </label>
                <label>
                  Smokes:
                  <input
                    type="checkbox"
                    name="smokes"
                    checked={reservationDetails.smokes}
                    onChange={handleReservationChange}
                  />
                </label>
                <label>
                  Notes:
                  <textarea
                    name="notes"
                    value={reservationDetails.notes}
                    onChange={handleReservationChange}
                  />
                </label>
              </>
            )}
            <button onClick={saveReservation}>Save</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
