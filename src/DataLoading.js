import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {InfiniteLoader, List} from 'react-virtualized';
// import 'react-virtualized/styles.css'; // only needs to be imported once

// 假设每页 10 条数据
const pageSize = 10;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCount: 1000,
      list: [],
    };
  }

  isRowLoaded = ({index}) => {
    const {list} = this.state;
    return !!list[index]; // STATUS_LOADING or STATUS_LOADED
  };

  rowRenderer = ({key, index, style}) => {
    const {list} = this.state;

    const row = list[index];
    let content = null;

    if (row) {
      content = (
        <div style={{border: '1px solid #ddd', padding: 5, background: '#ddd'}}>
          {index}: {row.id}, {row.employee_name}
        </div>
      );
    }

    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  loadMoreRows = ({startIndex, stopIndex}) => {
    this.setState({
      loading: true,
    });
    const pageNumber = parseInt(startIndex / pageSize) + 1;
    // 异步加载数据
    const url = 'http://dummy.restapiexample.com/api/v1/employees';
    return fetch(
      `${url}?startIndex=${startIndex}&stopIndex=${stopIndex}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    )
      .then(response => {
        return response.json();
      })
      .then(res => {
        // 数据加载完成
        const data = res.slice(0, 10).map(o => ({
          ...o,
          id: Math.round(Math.random() * 2000) + o.id,
        }));

        this.setState({
          loading: false,
          list: this.state.list.concat(data),
        });
      });
  };

  render() {
    const {totalCount, loading} = this.state;
    return (
      <Fragment>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={totalCount}
        >
          {({onRowsRendered, registerChild}) => (
            <List
              height={200}
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              rowCount={totalCount}
              rowHeight={50}
              rowRenderer={this.rowRenderer}
              width={300}
            />
          )}
        </InfiniteLoader>
        {loading && <div>loading...</div>}
      </Fragment>
    );
  }
}

export default App;
