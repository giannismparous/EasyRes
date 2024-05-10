import React, { useEffect, useState } from 'react';
import '../styles/Reservations.css';
import { useParams, useNavigate} from 'react-router-dom';
import { fetchMenu, fetchOrder, updateOrder } from './firebase.utils';
import '../styles/Order.css';

const Order = () => {

    const navigate = useNavigate();

    const { collectionKey, selectedDate, reservationId} = useParams();
    const [menuMap, setMenuMap] = useState({});
    const [order, setOrder] = useState({});
    const [uniqueCategories, setUniqueCategories] = useState([]);


    useEffect(() => {

        const getMenuMapFromServer = async (collectionKey) => {
            try {
                const response = await fetchMenu(collectionKey);

                const menuItemsMap = {};

                // Keep track of unique category names
                const uniqueCategoriesSet = new Set();

                response.forEach(category => {
                    category.items.forEach(item => {
                        menuItemsMap[item.id] = { name: item.name, price: item.price, category: category.category };
                        uniqueCategoriesSet.add(category.category); // Add category name to set
                    });
                });

                setMenuMap(menuItemsMap);
                setUniqueCategories(Array.from(uniqueCategoriesSet)); // Convert set to array

            } catch (error) {
                console.error("Error checking document: ", error);
            }
        };

        const getOrderFromServer = async (collectionKey,selectedDate,reservationId) => {

            try {
                const response = await fetchOrder(collectionKey,selectedDate,parseInt(reservationId));
                setOrder(response);
                console.log("Order fetched:");
                console.log(response);

            } catch (error) {
                console.error("Error checking document: ", error);
            }

        };

        getOrderFromServer(collectionKey,selectedDate,reservationId);
        getMenuMapFromServer(collectionKey);

    }, [collectionKey,selectedDate,reservationId]); // Empty dependency array ensures that the effect runs only once when the component is mounted

    const handleAddToOrder = (itemId) => {
        
        const newOrderItem = { menu_item_id: itemId, quantity: 1 };
        
        console.log(order);
        
        setOrder(prevOrder => ({
            ...prevOrder,
            order_items: [...prevOrder.order_items, newOrderItem]
        }));

        console.log(newOrderItem);

    };

    const handleIncreaseQuantity = (itemId) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            order_items: prevOrder.order_items.map(item => {
                if (item.menu_item_id === itemId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        }));
    };

    const handleDecreaseQuantity = (itemId) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            order_items: prevOrder.order_items
                .map(item => {
                    if (item.menu_item_id === itemId) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                })
                .filter(item => item.quantity > 0) // Remove items with quantity 0
        }));
    };

    const sendOrder = async () => {

        try {
            console.log("Sending order:", order);
            const response = await updateOrder(collectionKey,selectedDate,order);
            console.log("Response:");
            console.log(response);
            printOrderSummary(); // Print order summary after sending order
            navigate('/sample_restaurant/reservations');
        } catch (error) {
            console.error("Error sending order: ", error);
            // Handle errors, e.g., display an error message to the user
        }
    };

    const printOrderSummary = () => {
        let printContent = `
            <html>
                <head>
                    <title>Order Summary</title>
                    <style>
                        /* Define styles for printing */
                        @media print {
                            body {
                                font-size: 12pt;
                            }
                            .order-summary {
                                margin-bottom: 20px;
                            }
                            .order-item {
                                margin-bottom: 10px;
                            }
                            .order-item p {
                                margin: 0;
                            }
                            .total-price {
                                font-weight: bold;
                            }
                        }
                    </style>
                </head>
                <body>
                    <h1>Order Summary</h1>
                    <div class="order-summary">
                        <h2>Ordered Items:</h2>
        `;
    
        // Append each ordered item
        order.order_items.forEach(item => {
            const menuItem = menuMap[item.menu_item_id];
            printContent += `
                <div class="order-item">
                    <p>${item.quantity} x ${menuItem.name}: $${(menuItem.price * item.quantity).toFixed(2)}</p>
                    <p>Notes: ${item.notes || "N/A"}</p>
                </div>
            `;
        });
    
        // Calculate and append total price
        let totalPrice = order.order_items.reduce((total, item) => {
            const menuItem = menuMap[item.menu_item_id];
            return total + menuItem.price * item.quantity;
        }, 0);
        printContent += `
                        <div class="total-price">
                            <p>Total Price: $${totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
    
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close(); // Close the document stream
        printWindow.print();
        printWindow.close();
    };
    
    const handleNotesChange = (itemId, notes) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            order_items: prevOrder.order_items.map(item => {
                if (item.menu_item_id === itemId) {
                    return { ...item, notes: notes };
                }
                return item;
            })
        }));
    };

    return (
        <div className='order-page'>
            {uniqueCategories.map((category, index) => (
                <div key={index} className="category-section">
                    <h2>{category}</h2>
                    <ul>
                        {Object.entries(menuMap).map(([itemId, item]) => {
                            if (item.category === category) {
                                const orderedItem = order.order_items.find(orderItem => orderItem.menu_item_id === parseInt(itemId));
                                return (
                                    <li key={itemId} className='order-menu-item'>
                                        <div className='order-menu-quantity'>
                                            {orderedItem ? (
                                                <span className="quantity">
                                                    <button className="remove-more-button" onClick={() => handleDecreaseQuantity(parseInt(itemId))}>-</button>
                                                    {orderedItem.quantity}
                                                    <button className="add-more-button" onClick={() => handleIncreaseQuantity(parseInt(itemId))}>+</button>
                                                </span>
                                            ) : (
                                                <button className="add-button" onClick={() => handleAddToOrder(parseInt(itemId))}>+</button>
                                            )}
                                        </div>
                                        <p>{item.name}</p>
                                        {orderedItem && (<input
                                        type="text"
                                        placeholder="Notes"
                                        value={orderedItem ? orderedItem.notes : ''}
                                        onChange={(e) => handleNotesChange(parseInt(itemId), e.target.value)}
                                        className='notes-input'
                                        />)}
                                    </li>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </ul>
                </div>
            ))}
            <button className="send-order-button" onClick={sendOrder}>Send Order</button>
        </div>
    );
};

export default Order;
