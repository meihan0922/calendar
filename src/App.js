import React, { Component } from 'react';
import './main.scss';
import './App.scss';
// import Travel_calendar from './stories/TravelCalendar.stories';
import Calendar from './components/Calendar/Calendar';

class App extends Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();
    }
  state = {
      destory: 1,
  }

  switch = () => {
      this.child.current.switch();
  }

  nextMonth = () =>{
      this.child.current.nextMonth();
  }

  prevMonth = () => {
      this.child.current.prevMonth();
  }

  inputData = (inputData) => {
      this.child.current.inputData(inputData);
  }

  resetData = (resetData) => {
      this.child.current.resetData(resetData);
  }

  destory = () => {
      this.setState({
          destory: 0,
      });
  }

  alive = () => {
      this.setState({
          destory: 1,
      });
  }

  render() {
      return (
          <div className="App">
              <div className="travel_calendar">
                  { this.state.destory ? <Calendar
                      ref={this.child}
                      initYearMonth='201512'
                      // 資料來源的輸入接口 [ array | string ] 如果是 string的話，請輸入網址
                      dataSource='../public/json/data1.json'
                      // {[
                      //   {
                      //     "guaranteed": true,
                      //     "date": "2017/07/24",
                      //     "price": 35502,
                      //     "availableVancancy": 26,
                      //     "totalVacnacy": 325,
                      //     "status": "截止"
                      //   },
                      // {string} 報名(#24a07c) | 後補(#24a07c) | 預定(#24a07c) | 截止(#ff7800) | 額滿(#ff7800) | 關團(#ff7800)

                      // ]}
                      dataKeySetting={{
                          // 保證出團 'guaranteed', 'certain',
                          'guaranteed': 'guaranteed',
                          // 狀態 'status', 'state',
                          'status': 'status',
                          // 可賣團位 'availableVancancy', 'onsell',
                          'available': 'availableVancancy',
                          // 團位 'totalVacnacy', 'total',
                          'total': 'totalVacnacy',
                          // 價格
                          'price': 'price',
                      }}
                      alive={this.alive}
                      destory={this.destory}
                  /> : ''}
              </div>
          </div>
      );
  }
}

export default App;
