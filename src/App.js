import React from 'react';
import {List} from 'react-virtualized';
// import logo from './logo.svg';
import Data from './Data';
import DataLoading from './DataLoading';
import DataAutoSizer from './DataAutoSizer';
import './App.css';
import 'react-virtualized/styles.css';

// Grid data as an array of arrays
// const list = [
//   ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */],
//   // And so on...
// ];

const initList = [];

for (let i = 0; i < 10; i++) {
  //   initList.push({
  //     name: `Brian ${i}`,
  //     job: 'Software Engineer',
  //     city: 'San Jose',
  //   });
}

class AppX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: initList,
    };
  }

  render() {
    const {list} = this.state;
    return (
      <div>
        {/* <Data /> */}
        <DataLoading />
        {/* <br />
        <div style={{ position: 'fixed', top: 250, bottom: 0, left: 0, right: 0 }}>
            <DataAutoSizer />
        </div> */}
      </div>
    );
  }
}

export default AppX;
