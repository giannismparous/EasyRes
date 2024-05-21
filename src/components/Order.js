import React, { useEffect, useState } from 'react';
import '../styles/Reservations.css';
import { useParams, useNavigate} from 'react-router-dom';
import { fetchMenu, fetchOrder, updateOrder } from './firebase.utils';
import '../styles/Order.css';

const Order = () => {

    const navigate = useNavigate();

    const { collectionKey, selectedDate, reservationId, printerIp, printerPort} = useParams();
    const [menuMap, setMenuMap] = useState({});
    const [order, setOrder] = useState({});
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const [orderItemsCounter,setOrderItemsCounter] = useState(0);

    useEffect(() => {

        const getMenuMapFromServer = async (collectionKey) => {
            try {
                const response = await fetchMenu(collectionKey);

                const menuItemsMap = {};

                // Keep track of unique category names
                const uniqueCategoriesSet = new Set();

                response.forEach(category => {
                    category.items.forEach(item => {
                        menuItemsMap[item.id] = { name: item.name, price: item.price, category: category.category, ingredients: item.ingredients };
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
                setOrderItemsCounter(response.order_items.length)
                console.log("Order fetched:");

            } catch (error) {
                console.error("Error checking document: ", error);
            }

        };

        getOrderFromServer(collectionKey,selectedDate,reservationId);
        getMenuMapFromServer(collectionKey);

    }, [collectionKey,selectedDate,reservationId]); // Empty dependency array ensures that the effect runs only once when the component is mounted

    const handleAddToOrder = (itemId) => {
        const selectedMenuItem = menuMap[itemId];
        const orderItemId=orderItemsCounter+1;
        const newOrderItem = {
            order_item_id: orderItemId,
            menu_item_id: itemId,
            quantity: 1,
            ingredients: [] // Pass ingredients to the order item
        };

        setOrder(prevOrder => ({
            ...prevOrder,
            order_items: [...prevOrder.order_items, newOrderItem]
        }));

        setOrderItemsCounter(orderItemId)

    };

    const handleIncreaseQuantity = (orderItemId) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            order_items: prevOrder.order_items.map(item => {
                if (item.order_item_id === orderItemId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        }));
    };

    const handleDecreaseQuantity = (orderItemId) => {
        setOrder(prevOrder => ({
            ...prevOrder,
            order_items: prevOrder.order_items
                .map(item => {
                    if (item.order_item_id === orderItemId) {
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
            navigate('/reservations/sample-restaurant');
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
    
        handlePrint(printContent);
        // const printWindow = window.open('', '_blank');
        // printWindow.document.write(printContent);
        // printWindow.document.close(); // Close the document stream
        // printWindow.print();
        // printWindow.close();
    };

    function handlePrint(printContent) {
        console.log(printContent)
        if (window.ReactNativeWebView) {
            const data = {
                html: printContent,
                printerIp: printerIp,
                printerPort: printerPort
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
        } else {
            console.error('ReactNativeWebView not available');
            console.log(printerIp)
            console.log(printerPort)
        }
    }
    
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


    const handleIngredientCheckboxChange = (event, orderItemId, ingredient) => {
        const isChecked = event.target.checked;
        setOrder(prevOrder => ({
            ...prevOrder,
            order_items: prevOrder.order_items.map(item => {
                if (item.order_item_id === orderItemId) {
                    const updatedIngredients = isChecked 
                        ? [...item.ingredients, ingredient] // Add the ingredient
                        : item.ingredients.filter(ing => ing.name !== ingredient.name); // Remove the ingredient
    
                    return { 
                        ...item,
                        ingredients: updatedIngredients
                    };
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
                                const orderedItems = order.order_items.filter(orderItem => orderItem.menu_item_id === parseInt(itemId));
                                return (
                                    <li key={itemId} className='order-menu-item-section'>
                                        <div className='order-menu-item'>
                                            <div className='order-menu-quantity'>
                                                <button className="add-button" onClick={() => handleAddToOrder(parseInt(itemId))}>+</button>
                                            </div>
                                            <p>{item.name}</p>
                                            <p>{item.price}</p>
                                        </div>
                                        {orderedItems.map((orderedItem, index) => (
                                            <div key={index} className="ordered-menu-item">
                                                <span className="quantity">
                                                    <button className="remove-more-button" onClick={() => handleDecreaseQuantity(parseInt(orderedItem.order_item_id))}>-</button>
                                                    {orderedItem.quantity}
                                                    <button className="add-more-button" onClick={() => handleIncreaseQuantity(parseInt(orderedItem.order_item_id))}>+</button>
                                                </span>
                                                <div className='order-menu-item-ingredients'>
                                                    {item.ingredients.map((ingredient, index) => (
                                                        <React.Fragment key={index}>
                                                            <span>{ingredient.name}</span>
                                                            {ingredient.price>0 && <span>(+{ingredient.price}&#x20AC;)</span>}
                                                            <input
                                                                type="checkbox"
                                                                value="ingredient"
                                                                defaultChecked={orderedItem.ingredients.some(
                                                                    orderedIngredient => orderedIngredient.name === ingredient.name
                                                                )}
                                                                onChange={(event) => handleIngredientCheckboxChange(event, orderedItem.order_item_id, ingredient)}
                                                            />
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Notes"
                                                    value={orderedItem ? orderedItem.notes : ''}
                                                    onChange={(e) => handleNotesChange(parseInt(itemId), e.target.value)}
                                                    className='notes-input'
                                                />
                                            </div>
                                        ))}
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
