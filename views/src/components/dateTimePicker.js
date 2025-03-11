import React, {useState} from 'react';

import { DateTimePicker } from 'react-datetime-pickers';
import 'react-datetime-pickers/dist/index.css';

const dateTimePicker = () => {
    const [date, setDate] = useState(new Date());

    return (
        <DateTimePicker
            selected={date}
            onChange={setDate}
        />
    );
}

export default dateTimePicker;