const dateDoc = {
    reservations: [
        {
            name: "KOULA",
            phone: "132134",
            email: "koula@gmail.com",
            start_time_index: 79,
            end_time_index: 81,
            table_id: 8,
            reservation_id: 14,
            completed: true,
        },
        {
            name: "NIKOS",
            phone: "555555",
            start_time_index: 68,
            end_time_index: 73,
            table_id: 8,
            reservation_id: 35,
        },
        {
            name: "ASPASIA",
            phone: "3333333",
            start_time_index: 45,
            end_time_index: 47,
            table_id: 9,
            reservation_id: 15,
            completed: true
        },
        {
            name: "ROULA",
            phone: "11111",
            start_time_index: 6,
            end_time_index: 9,
            table_id: 9,
            reservation_id: 18,
        },
        {
            name: "XRHSTOS",
            phone: "77777",
            start_time_index: 69,
            end_time_index: 74,
            table_id: 9,
            reservation_id: 36,
        },
        {
            name: "SOFIA",
            phone: "39999",
            start_time_index: 28,
            end_time_index: 31,
            table_id: 10,
            reservation_id: 11,
            completed:true
        },
        {
            name: "IWSHF",
            phone: "222222",
            start_time_index: 8,
            end_time_index: 10,
            table_id: 10,
            reservation_id: 21,
            canceled:true,
        },
        {
            name: "AVEL",
            phone: "766767676",
            start_time_index: 23,
            end_time_index: 24,
            table_id: 10,
            reservation_id: 29,
        },
        {
            name: "GIAXBE",
            phone: "11111113",
            start_time_index: 70,
            end_time_index: 72,
            table_id: 10,
            reservation_id: 37,
        },
    ],
    orders: [
        {
            reservation_id: 14,
            order_id:1,
            order_items:[
                {
                    menu_item_id: 2,
                    quantity: 3
                },
                {
                    menu_item_id: 3,
                    quantity: 1
                }
            ]
        },
        {
            reservation_id: 15,
            order_id:2,
            order_items:[
                {
                    menu_item_id: 1,
                    quantity: 5
                },
                {
                    menu_item_id: 3,
                    quantity: 2
                }
            ]
        },
        {
            reservation_id: 11,
            order_id:3,
            order_items:[
                {
                    menu_item_id: 1,
                    quantity: 2
                },
                {
                    menu_item_id: 3,
                    quantity: 1
                }
            ]
        }
    ],
    unavailable_times_indexes: [
        {
            start_time_index:91,
            end_time_index:96
        },
        {
            start_time_index:66,
            end_time_index: 80
        },
        {
            start_time_index:1,
            end_time_index:40
        }
    ],
    unavailable_tables: [2,6],
    unavailable_tables_times_indexes: [
        {
            table_id: 4,
            times_indexes: [
                {
                    start_time_index: 4,
                    end_time_index: 8
                },
                {
                    start_time_index: 10,
                    end_time_index: 20
                }
            ]
        },
        {
            table_id: 8,
            times_indexes: [
                {
                    start_time_index: 30,
                    end_time_index: 60
                },
            ]
        },
    ],
}

export default dateDoc;