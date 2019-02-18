import React, { Component } from 'react';
// import { storiesOf } from '@storybook/react';
import '../App.scss';
import Calendar from '../components/Calendar/Calendar.js';

class TravelCalendar extends Component {
    render() {
        return (
            <div className="travel_calendar">
                <Calendar
                    initYearMonth='201807'
                    // 資料來源的輸入接口 [ array | string ] 如果是 string的話，請輸入網址
                    dataSource='./data1.json'
                    // {[
                    //   {
                    //       "guaranteed": true,
                    //       "date": "2016/12/15",
                    //       "price": "234567",
                    //       "availableVancancy": 0,
                    //       "totalVacnacy": 20,
                    //       "status": "報名" // {string} 報名(#24a07c) | 後補(#24a07c) | 預定(#24a07c) | 截止(#ff7800) | 額滿(#ff7800) | 關團(#ff7800)
                    //   }
                    // ]}

                />
            </div>
        );
    }
}
storiesOf('Calendar', module).add('default', () => (
    <TravelCalendar />
));
