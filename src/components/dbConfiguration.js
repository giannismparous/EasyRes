const configurationDoc = {
    unavailable_times: [
        {
            start_time_index:70,
            end_time_index:80
        },
    ],
    unavailable_tables: [2],
    unavailable_table_times: [
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
    ]
}

export default configurationDoc;