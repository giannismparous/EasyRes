import React, { useState } from 'react';
import { Stage, Layer, Circle, Text } from 'react-konva';
import '../styles/MapComponent.css'; // Import CSS file

const MapComponent = ({ tables, unavailableTables, setTables, setUnavailableTables }) => {
  
    const radius = 50;

    const [updatedTables, setUpdatedTables] = useState(tables);
    const [updatedUnavailableTables, setUpdatedUnavailableTables] = useState(unavailableTables);

    const handleDragEnd = (index, event) => {
        const { x, y } = event.target.attrs;
        const updatedTable = { ...updatedTables[index], x, y };
        const newTables = [...updatedTables];
        newTables[index] = updatedTable;
        setUpdatedTables(newTables);
        setTables(newTables);
    };

    const handleTableClick = (tableId) => {
        const tempUpdatedUnavailableTables = updatedUnavailableTables.includes(tableId)
            ? updatedUnavailableTables.filter(id => id !== tableId) // Remove tableId if already in unavailableTables
            : [...updatedUnavailableTables, tableId]; // Add tableId if not in unavailableTables

        setUpdatedUnavailableTables(tempUpdatedUnavailableTables);
        setUnavailableTables(tempUpdatedUnavailableTables);
    };

    return (
        <div className='map'>
            <Stage width={window.innerWidth} height={window.innerHeight-100}>
            <Layer>
                {updatedTables.map((table, index) => (
                  <React.Fragment key={table.id}>
                    <Circle
                      x={table.x}
                      y={table.y}
                      radius={radius}
                      fill={updatedUnavailableTables.includes(table.id) ? 'red' : 'blue'} // Change fill color dynamically
                      draggable // Make tables draggable
                      onDragMove={(event) => {
                        const { x, y } = event.target.position();
                        const newTables = [...updatedTables];
                        newTables[index] = { ...newTables[index], x, y };
                        setUpdatedTables(newTables);
                        setTables(newTables); // Update tables in ParentComponent
                      }}
                      onDragEnd={(event) => handleDragEnd(index, event)}
                      onClick={() => handleTableClick(table.id)}
                      onTap={() => handleTableClick(table.id)}
                    />
                    <Text
                      x={table.x - 5} // Adjust text position to center
                      y={table.y - 5}
                      text={table.id.toString()} // Display table id
                      fill="white"
                    />
                  </React.Fragment>
                ))}
            </Layer>
            </Stage>
        </div>
    );
};

export default MapComponent;
