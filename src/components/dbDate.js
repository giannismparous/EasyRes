const dateDoc = {
    reservations: [
        {
            name: "KOULA",
            phone: "+306976757530",
            email: "koula@gmail.com",
            start_time_index: 79,
            end_time_index: 81,
            table_id: 8,
            people: 3,
            reservation_id: 1,
            state: 5,
            smokes:true
        },
        {
            name: "NIKOS",
            phone: "+306989757220",
            start_time_index: 68,
            end_time_index: 73,
            table_id: 8,
            people: 4,
            reservation_id: 2,
            state: 1
        },
        {
            name: "ASPASIA",
            phone: "+306939754537",
            start_time_index: 45,
            end_time_index: 47,
            table_id: 9,
            people: 3,
            reservation_id: 3,
            state: 6
        },
        {
            name: "ROULA",
            phone: "+308756182308",
            start_time_index: 6,
            end_time_index: 9,
            table_id: 9,
            people: 2,
            reservation_id: 4,
            state: 5
        },
        {
            name: "XRHSTOS",
            phone: "+306954623345",
            start_time_index: 69,
            end_time_index: 74,
            table_id: 9,
            people: 2,
            reservation_id: 5,
            state: 6
        },
        {
            name: "SOFIA",
            phone: "+306909095432",
            start_time_index: 28,
            end_time_index: 31,
            table_id: 10,
            people: 5,
            reservation_id: 6,
            state: 5,
            smokes:true
        },
        {
            name: "IWSHF",
            phone: "+306978523094",
            start_time_index: 8,
            end_time_index: 10,
            table_id: 10,
            people: 6,
            reservation_id: 7,
            state: 2
        },
        {
            name: "AVEL",
            phone: "+306973950231",
            start_time_index: 23,
            end_time_index: 24,
            table_id: 10,
            people: 6,
            reservation_id: 8,
            state: 4
        },
        {
            name: "GIAXBE",
            phone: "+306957623012",
            start_time_index: 70,
            end_time_index: 72,
            table_id: 10,
            people: 4,
            reservation_id: 9,
            state: 6
        },
    ],
    orders: [
        {
            reservation_id: 6,
            order_id:1,
            order_items:[
                {
                    menu_item_id: 2,
                    quantity: 3
                },
                {
                    menu_item_id: 3,
                    quantity: 1
                },
                {
                    menu_item_id: 6,
                    quantity: 2
                },
                {
                    menu_item_id: 8,
                    quantity: 3
                }
            ]
        },
        {
            reservation_id: 1,
            order_id:2,
            order_items:[
                {
                    menu_item_id: 1,
                    quantity: 5
                },
                {
                    menu_item_id: 3,
                    quantity: 2
                },
                {
                    menu_item_id: 10,
                    quantity: 4
                },
                {
                    menu_item_id: 20,
                    quantity: 1
                },
                {
                    menu_item_id:22,
                    quantity: 1
                }
            ]
        },
        {
            reservation_id: 4,
            order_id:3,
            order_items:[
                {
                    menu_item_id: 4,
                    quantity: 2
                },
                {
                    menu_item_id: 3,
                    quantity: 9
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