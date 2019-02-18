import React, { Component } from 'react';
import './calendar.scss';
// import 'https://use.fontawesome.com/releases/v5.7.0/css/all.css';

import PropTypes from 'prop-types';

export default class Calendar extends Component {
  static propTypes = {
      dataKeySetting: PropTypes.object,
      data: PropTypes.array,
      initYearMonth: PropTypes.string,
      dataSource: PropTypes.array,
      dataSource: PropTypes.string,
      mode: PropTypes.number,
      btn: PropTypes.string,
      currentPage: PropTypes.number,
      isloaded: PropTypes.number,
  };
  static defaultProps = {
      initYearMonth: '201807',
      dataSource: './data1.json',
      data: [],
      mode: 1,
      btn: '',
      currentPage: 1,
      isloaded: 0,
  };
  dataSource = '';
  pageCount = 8; // 每頁顯示幾筆
  maxTime = null; // data中最大年月
  minTime = null; // data中最小年月
  dataInfo = ''; // 存當月資料
  state = {
      data: [], // 存json撈出來的資料
      initYearMonth: '', // ex:201809
      mode: 1, // 切換模式 0:列表模式 1:月曆模式
      btn: '', // 月曆模式中點擊td的要新增active的id
      currentPage: 1, // 列表模式中目前第幾頁
      isloaded: 0,
  }


  // 判斷initYearMonth符合條件
  reg = (item, time) => {
      const initYearMonth = Number(this.props.initYearMonth);
      const result = /^[2][0][1-2][0-9]([0][0-9])|([1][0-2])$/.test(initYearMonth);
      if (result) {
      // console.log(item,String(initYearMonth));
          this.checkMonth(item, String(initYearMonth));
      } else {
          time = time.split('/').join('-');
          const year = time.slice(0, 4);
          const month = time.slice(5, 7);
          // console.log(year,month);
          this.checkMonth(item, year + month);
          alert('不符合資料格式');
      }
  }

  componentDidMount() {
      // console.log(typeof(dataSource));
      // console.log(dataSource);
      if (typeof(dataSource) === 'object') {
          const result = this.props.dataSource;
          this.dataSource = result;
          this.info(result);
          this.reg(result, result[0]['date']);
          this.setState({
              data: result,
          });
      } else if (typeof(dataSource) === 'string') {
          fetch(
              this.props.dataSource,
              {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              }
          )
              .then((res) => res.json())
              .then((result) => {
                  this.info(result);
                  this.reg(result, result[0]['date']);
                  this.setState({
                      data: result,
                  });
              })
              .catch((err) => console.log(err));
      } else {
          alert('dataSource必須是陣列或是字串');
      }
  }

  // 判斷有相同日期: 可報名>>保證出團>>最低價

  // 若輸入的年月沒有資料，
  // 就要找相近的年月，若前一個月後一個月都有資料，就顯示資料比數比較多的那一個月
  checkMonth = (data, time) => {
      const initMonth = time;// ex:201705
      const year = initMonth.slice(0, 4);// 取年分2017
      const month = initMonth.slice(4);// 取月份05
      // 如果沒有當月資料
      const boolMonth = data.filter(function(n) {
          const a = (n['date'].indexOf(`${year}/${month}`) > -1);
          return a;
      });
      // console.log(!!boolMonth);
      // 把假年月塞進去，抓出最近的兩筆資料的年月
      if (!!boolMonth) {
          const fake = { 'date': `${year}/${month}/01` };

          data[(data.length + 1)] = fake;
          data.sort(function(a, b) {
              a = new Date(a['date'].split('/').join('-'));
              b = new Date(b['date'].split('/').join('-'));
              return a - b;
          });

          const index = data.indexOf(fake);
          // console.log(index);
          // console.log(data.length);
          if (index === 0) {
              data.splice(index, 1);
              const date = data[0]['date'];
              const month = date.slice(5, 7);
              const year = date.slice(0, 4);
              this.setState({
                  initYearMonth: year + month,
                  isloaded: 1,
              });
          } else if (index === data.length - 2) {
              console.log(index === data.length - 2);
              data.splice(index, 1);
              const date = data[data.length - 2]['date'];
              console.log(date);
              const month = date.slice(5, 7);
              const year = date.slice(0, 4);
              console.log(year);
              console.log(month);
              this.setState({
                  initYearMonth: year + month,
                  isloaded: 1,
              }, ()=>{
                  console.log(this.maxTime);
              });
          } else {
              const pre = String(data[index - 1]['date']);
              const premonth = pre.slice(5, 7);
              const preyear = pre.slice(0, 4);
              const next = String(data[index + 1]['date']);
              const nextmonth = next.slice(5, 7);
              const nextyear = next.slice(0, 4);

              // 計算前後月份的資料量
              const predata = data.filter(function(n) {
                  const a = (n['date'].indexOf(`${year}/${premonth}`));
                  return a;
              });
              const countPreData = predata.length;
              const nextdata = data.filter(function(n) {
                  const a = (n['date'].indexOf(`${year}/${nextmonth}`));
                  return a;
              });
              const countNextData = nextdata.length;
              console.log(year + nextmonth);
              console.log(year + premonth);
              // 把假資料刪掉
              data.splice(index, 1);
              // let setDat='';
              if (preyear === nextyear || (nextyear - preyear === 1 && year === preyear)) {
                  if (month - premonth > nextmonth - month) {
                      this.setState({
                          initYearMonth: year + nextmonth,
                          isloaded: 1,
                      });
                  } else if (month - premonth < nextmonth - month) {
                      this.setState({
                          initYearMonth: year + premonth,
                          isloaded: 1,
                      });
                  } else if (month - premonth === nextmonth - month) {
                      if (countNextData > countPreData) {
                          this.setState({
                              initYearMonth: year + nextmonth,
                              isloaded: 1,
                          }, );
                      } else {
                          this.setState({
                              initYearMonth: year + premonth,
                              isloaded: 1,
                          });
                      }
                  }
              } else if (nextyear - preyear === 1) {
                  if (year === nextyear) {
                      if (nextmonth - month > (12 - premonth + Number(month))) {
                          this.setState({
                              initYearMonth: year + premonth,
                              isloaded: 1,
                          });
                      } else if (nextmonth - month < (12 - premonth + Number(month))) {
                          this.setState({
                              initYearMonth: year + nextmonth,
                              isloaded: 1,
                          });
                      } else {
                          if (countNextData > countPreData) {
                              this.setState({
                                  initYearMonth: year + nextmonth,
                                  isloaded: 1,
                              });
                          } else {
                              this.setState({
                                  initYearMonth: year + premonth,
                                  isloaded: 1,
                              });
                          }
                      }
                  }
              }
          }
      }
  }

  // 抓資料，排序，並抓出最大最小年月
  info(item) {
      const day = item.map((item)=>{
          return item['date'].split('/').join('-');
      });

      day.sort(function(a, b) {
          a = new Date(a).getTime();
          b = new Date(b).getTime();
          return a - b;
      });
      // console.log(day);
      this.minTime = String(day[0]).slice(0, 4) + String(day[0]).slice(5, 7);
      this.maxTime = String(day[day.length - 1]).slice(0, 4) + String(day[day.length - 1]).slice(5, 7);
  }

  // 模式html
  headerCalendar = () => {
      const mode = this.state.mode;
      return (
          <div className="header">
              <a href=""
                  onClick={this.change}>
                  <i className={!mode ? 'far fa-calendar-alt' : 'fas fa-list'}></i>
                  <span className="text">{!mode ? '切換月曆顯示' : '切換列表顯示'}</span>
              </a>
          </div>
      );
  }

  // 切換模式
  switch() {
      let a = this.state.mode;
      a = !a;
      this.setState({
          mode: a,
      });
  }

  // click切換模式
  change = (e) => {
      e.preventDefault();
      this.switch();
      this.setState({
          currentPage: 1,
          btn: '',
      });
  }

  // 數字三位數加逗號
  toThousands = (num) => {
      const result = [];


      let counter = 0;
      num = (num || 0).toString().split('');
      for (let a = num.length - 1; a >= 0; a--) {
          counter++;
          result.unshift(num[a]);
          if (!(counter % 3) && a !== 0) {
              result.unshift(',');
          }
      }
      return result.join('');
  }

  // 表頭月份輪播顯示陣列
  slideAry = () =>{
      let slider = [];
      const initMonth = this.state.initYearMonth;
      const year = Number(initMonth.slice(0, 4));// 取年分2017
      const month = Number(initMonth.slice(4));// 取月份05

      function countYear(a) {
          return new Date(year, month + a, 0).getFullYear();
      }
      function countMonth(a) {
          return new Date(year, month + a, 0).getMonth() + 1;
      }
      // 現在年月
      const currentYM = countYear(0) + ' ' + countMonth(0);
      // 前年月
      const prevprevYM = countYear(-2) + ' ' + countMonth(-2);
      // 去年月
      const prevYM = countYear(-1) + ' ' + countMonth(-1);
      // 明年月
      const nextYM = countYear(1) + ' ' + countMonth(1);
      // 後年月
      const nextnextYM = countYear(2) + ' ' + countMonth(2);

      if ((countYear(0) + '' + countMonth(0)) === String(Number(this.maxTime))) {
          slider = [prevprevYM, prevYM, currentYM];
      } else if ((countYear(0) + '' + countMonth(0)) === String(Number(this.minTime))) {
          slider = [currentYM, nextYM, nextnextYM];
      } else {
          slider = [prevYM, currentYM, nextYM];
      }
      return slider;
  }

  // 表頭月份輪播html
  showMonth = () => {
      const arr = [];
      const initYearMonth = this.state.initYearMonth.slice(0, 4) + ' ' + Number(this.state.initYearMonth.substr(4));
      const time = this.slideAry();
      let monthAry = [];

      // 取得輪播月份，塞到data裡，只要click就會去setState當前年月，就會有左右輪播效果
      const month = time.map((item)=>{
          monthAry = item.split(' ');
          if (Number(monthAry[1]) < 10) {
              monthAry[1] = '0' + monthAry[1];
          }
          return monthAry[0] + monthAry[1];
      });

      for (let i = 0; i < 3; i++) {
          arr.push(
              <li onClick={this.onSetInit}
                  data-init={month[i]}
                  key={'arr' + i}>
                  <a className={time[i] === initYearMonth ? 'activeHeader' : ''}
                      href=""
                      key={'a' + i}>
                      <span className="month"
                          key={'month' + i}>{time[i]}月</span>
                  </a>
              </li>
          );
      }
      const nothing = <li></li>;
      const modeReturn = !!this.state.isloaded ? arr : nothing;
      return modeReturn;
  }

  // click月份輪播會更新月曆
  onSetInit = (e) =>{
      const currentBtn = e.target.dataset.init;
      this.consoleData(e.target);
      this.setState({
          initYearMonth: currentBtn,
          li: '',
          currentPage: 1,
      });
  }

  // click月份輪播會console.log
  consoleData(target) {
      const dataInfo = this.dataInfo;
      (function() {
          console.log(target, dataInfo, window.calendar);
      }());
  }

  // click月份輪播左邊按鈕
  prevMonth = () => {
      const initYearMonth = this.state.initYearMonth;
      const year = Number(initYearMonth.slice(0, 4));// 取年分2017
      const month = Number(initYearMonth.slice(4));// 取月份05
      const currentYear = String(new Date(year, month - 1, 0).getFullYear());
      let currentMonth = String(new Date(year, month - 1, 0).getMonth() + 1);
      if (Number(currentMonth) < 10) {
          currentMonth = '0' + currentMonth;
      }
      if (initYearMonth === this.minTime) {
          return;
      } else {
          this.setState({
              initYearMonth: (currentYear + currentMonth),
              currentPage: 1,
          });
      }
  }

  // //click月份輪播右邊按鈕
  nextMonth = () => {
      const initYearMonth = this.state.initYearMonth;
      const year = Number(initYearMonth.slice(0, 4));// 取年分2017
      const month = Number(initYearMonth.slice(4));// 取月份05
      const currentYear = String(new Date(year, month + 1, 0).getFullYear());
      let currentMonth = String(new Date(year, month + 1, 0).getMonth() + 1);
      if (Number(currentMonth) < 10) {
          currentMonth = '0' + currentMonth;
      }
      if (initYearMonth === this.maxTime) {
          return;
      } else {
          this.setState({
              initYearMonth: (currentYear + currentMonth),
              currentPage: 1,
          });
      }
  }

  // 產生html
  createTable = () => {
      const mode = this.state.mode;
      const week = (
          <thead className={mode ? '' : 'none'}>
              <tr className="week">
                  <th>星期日</th>
                  <th>星期一</th>
                  <th>星期二</th>
                  <th>星期三</th>
                  <th>星期四</th>
                  <th>星期五</th>
                  <th>星期六</th>
              </tr>
          </thead>
      );
      return (
          <table className={mode ? 'calendar' : 'list'}>
              {week}
              <tbody>
                  {!!this.state.isloaded ? this.createTbody() : <tr></tr>}
              </tbody>
          </table>
      );
  }

  // 列表模式換上頁
  onClickPagePrev = (e) =>{
      e.preventDefault();
      const currentPage = this.state.currentPage;
      this.setState({
          currentPage: currentPage - 1,
      });
  }

  // 列表模式換下頁
  onClickPageNext = (e) =>{
      e.preventDefault();
      const currentPage = this.state.currentPage;
      this.setState({
          currentPage: currentPage + 1,
      });
  }

  // 按td新增class用
  onClickBtn = (e) => {
      e.preventDefault();
      const currentClick = e.target;
      const dataId = currentClick.getAttribute('id');
      if (dataId) {
          this.setState({
              btn: dataId,
          }, ()=>{
              this.consoleClickDate(currentClick);
          });
      }
  }

  // click日期會console.log
  consoleClickDate(target) {
      const dataInfo = this.dataInfo;
      console.log(target, dataInfo);
  }

  // 生成tbody
  createTbody = () => {
      const mode = this.state.mode;
      const data = this.state.data;
      const initMonth = this.state.initYearMonth;// ex:201705
      const year = initMonth.slice(0, 4);// 取年分2017
      const month = initMonth.slice(4);// 取月份05
      let table = [];

      // 列表模式:
      let countMonthData = null;
      const pageCount = this.pageCount;// 每頁顯示幾筆
      const currentPage = this.state.currentPage;// 列表模式當前頁
      let totalPage = null;// 總共有幾頁
      let dateData = [];

      // 月曆模式:
      const monthDays = new Date(year, month, 0).getDate();// 每個月天數
      const monthDay = new Date(year, month - 1, 1).getDay();// 每個月第一天星期幾
      const AryDays = [];
      let createTbody = null;

      // 列表模式:篩選當月資料
      dateData = data.filter(function(n) {
          const a = (n['date'].indexOf(`${year}/${month}`) > -1);
          return a;
      });

      this.dataInfo = '';
      const set = new Set();
      const arrcheck = dateData.filter((item) => {
          return !set.has(item.date) ? set.add(item.date) : false;
      });
      dateData = arrcheck;
      // console.log(dateData);
      this.dataInfo = dateData;


      // 列表模式:符合條件的資料有幾筆
      countMonthData = dateData.length;

      // 列表模式:所有頁數
      totalPage = Math.ceil(countMonthData / pageCount);

      // 列表模式:排序
      dateData.sort(function(a, b) {
          a = new Date(a['date'].split('/').join('-'));
          b = new Date(b['date'].split('/').join('-'));
          return a - b;
      });

      // 列表模式:篩出當前頁數資料
      if (countMonthData > pageCount) {
          dateData = dateData.filter(function(n) {
              const i = dateData.indexOf(n);
              const a = (i >= (currentPage - 1) * pageCount && i < currentPage * pageCount);
              return a;
          });
      }
      if (mode) {
      // table.length=0;
      // 月曆模式:AryDays專門放所有的天數，disabled的存0，日期存數字，共42個
          for (let i = 0; i < monthDay - 1; i++) {
              AryDays.push(0);
          }
          for (let i = 0; i < monthDays + 1; i++) {
              AryDays.push(i);
          }
          for (let i = 0; i < 42 - (monthDays + monthDay); i++) {
              AryDays.push(0);
          }
          if (monthDay === 0) {
              AryDays.shift();
          }
          // 月曆模式:分成七個一組存進table裡，等下要產生tr用
          for (let i = 0; i < AryDays.length; i += 7) {
              table.push(AryDays.slice(i, i + 7));
          }
      } else if (!mode) {
      // 列表模式:存data就好，一個tr包8個td
          table = [dateData];
      }
      // 列表模式換頁標籤
      const dataPageBtn = (
          <td className={!mode ? 'pageCounter' : 'pageCounter none'}>
              <a href=""
                  className={currentPage === 1 ? 'visibility' : ''}
                  onClick={this.onClickPagePrev}>
                  <span className="arrowLeft"></span>
          上一頁
              </a>
              <div className="showPage">
                  <span className="currentPage">{currentPage}</span>
          /
                  <span className="totalPage">{totalPage}</span>
              </div>
              <a href=""
                  className={currentPage === totalPage ? 'visibility' : ''}
                  onClick={this.onClickPageNext}>
          下一頁
                  <span className="arrowRight"></span>
              </a>
          </td>
      );
      createTbody =
        table.map((item, index1)=>{
            return (
                <tr key={index1}>
                    {item.map((day, index2)=>{
                        let $day = '';
                        let booleanDate = null;
                        let dataInfo = '';
                        let listDate = '';
                        let listDay = '';

                        // 如果有資料的話，把資料塞進dataInfo
                        if (mode) {
                            $day = String(day); // 用來填月曆內日期，個位數不用補0

                            // 如果是個位數，補上0，才能丟到new Date裡
                            if (day > 0 && day < 10) {
                                day = '0' + day;
                            }
                            // 判斷json的資料是否有符合對應條件
                            booleanDate = data.filter(function(n) {
                                const a = (n['date'] === `${year}/${month}/${day}`);
                                return a;
                            });

                            if (!!booleanDate[0]) {
                                dataInfo = booleanDate[0];
                            } else {
                                dataInfo = '';
                            }
                        } else if (!mode) {
                            dataInfo = dateData[index2];
                        }
                        // const set = new Set();
                        // const arr = dataInfo.filter(item => {
                        //   return !set.has(item.date) ? set.add(item.date) : false
                        // })
                        // dataInfo = arr;
                        // console.log(dataInfo);

                        if (!mode) {
                            const list = dataInfo['date'].split('/').join('-');
                            const weekDay = new Date(list).getDay();
                            const cnWeekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                            listDay = cnWeekDay[weekDay];
                            listDate = Number(dataInfo.date.slice(8, 10));
                        };


                        const disabled = <td className="disabled"
                            key={'disabled' + index2}></td>;

                        // 取dataKeySetting
                        const guaranteed = this.props.dataKeySetting.guaranteed;
                        const status = this.props.dataKeySetting.status;
                        const available = this.props.dataKeySetting.available;
                        const price = this.props.dataKeySetting.price;
                        const total = this.props.dataKeySetting.total;

                        // {string} 報名(#24a07c) | 後補(#24a07c) | 預定(#24a07c) | 截止(#ff7800) | 額滿(#ff7800) | 關團(#ff7800)
                        const statusStr = dataInfo[status];
                        const statusGreen = (statusStr === '報名' || statusStr === '後補' || statusStr === '預定') ? 'statusGreen' : '';
                        const statusOrange = (statusStr === '截止' || statusStr === '額滿' || statusStr === '關團') ? 'statusOrange' : '';

                        const travelTip = (
                            <div className="details"
                                key={'details' + index2}>
                                {mode ? <span className={!!statusStr ? `${statusGreen}${statusOrange}` : ''}
                                    key={'statusStr' + index2}>{dataInfo[status]}</span> : ''}
                                <span className="sell"
                                    key={'sell' + index2}>可賣:{dataInfo[available]}</span>
                                <span className="group"
                                    key={'group' + index2}>團位:{dataInfo[total]}</span>
                                {mode ? <span className="price"
                                    key={'price' + index2}>${this.toThousands(dataInfo[price])}</span> : ''}
                                {!mode && dataInfo[guaranteed] ? <span className="tip"
                                    key={'tip' + index2}>成團</span> : ''}
                            </div>
                        );

                        const listRight = (
                            <div className="listRight"
                                key={'listRight' + index2}>
                                <span className={!!statusStr ? `${statusGreen} ${statusOrange}` : ''}
                                    key={'listRightstatus' + index2}>{dataInfo[status]}</span>
                                <span className="price"
                                    key={'listRightprice' + index2}>${this.toThousands(dataInfo[price])}</span>
                            </div>
                        );
                        const id = mode ? ((!!booleanDate[0]) ? $day : '') : index2;
                        const showDay = mode ? $day : listDate;
                        const guarant = mode ? (!!booleanDate[0]) : true;

                        const listhtml = (
                            <div className="listDay"
                                key={'listDay' + index2}>
                                <span className="num"
                                    key={`td ${index2}`}>{showDay}</span>
                                <span className="weekday"
                                    key={'weekday' + index2}>{listDay}</span>
                            </div>
                        );

                        const calendarTip = guarant && dataInfo[guaranteed] ? <span className="tip"
                            key={'calendarTip' + index2}>成團</span> : '';
                        const activeClass = mode ? this.state.btn === $day : this.state.btn === String(index2);

                        const days = (
                            <td className={activeClass ? 'currentDays active' : 'currentDays'}
                                onClick={this.onClickBtn}
                                id={id}
                                key={'currentDays' + index2} >
                                <div className="day"
                                    key={'day' + index2}>
                                    {mode ? <span className="num"
                                        key={`td${index2}`}>{showDay}</span> : listhtml}
                                    {mode ? calendarTip : ''}
                                    {guarant ? travelTip : ''}
                                    {mode ? '' : listRight}
                                </div>
                            </td>
                        );

                        if (mode) {
                            return (!day ? disabled : days);
                        } else {
                            return days;
                        }
                    }
                    )}
                    {dataPageBtn}
                </tr>
            );
        });
      return (createTbody);
  }

  inputData(inputData) {
      const inputlength = inputData.length;
      const data = this.state.data;
      for (let i = 0; i < inputlength; i++) {
          data.unshift(inputData[i]);
      }
      this.setState({
          data: data,
      });
  }

  resetData(resetData) {
      this.setState({
          data: resetData,
      });
  }

  render() {
      return (
          <div className="main">
              {this.headerCalendar()}
              <div className="monthHeader">
                  <div className="prev"
                      onClick={this.prevMonth}></div>
                  <ul>
                      {this.showMonth()}
                  </ul>
                  <div className="next"
                      onClick={this.nextMonth}></div>
              </div>
              <div className="create">
                  {this.createTable()}
              </div>
          </div>
      );
  }
}
