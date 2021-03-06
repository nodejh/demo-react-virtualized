import React from 'react';
import {InfiniteLoader, List, AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCount: 1000,
      list: [],
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
    };
  }

  isRowLoaded = ({index}) => {
    const {loadedRowsMap} = this.state;
    return !!loadedRowsMap[index]; // STATUS_LOADING or STATUS_LOADED
  };

  rowRenderer = ({key, index, style}) => {
    const {list, loadedRowsMap} = this.state;

    const row = list[index];
    let content;

    if (loadedRowsMap[index] === STATUS_LOADED && row) {
      content = (
        <div style={{border: '1px solid #fff', padding: 5, background: '#ddd'}}>
          {index}: {row.id}, {row.employee_name}
        </div>
      );
    } else {
      content = <div style={{color: 'red'}}>{index}: loading...</div>;
    }

    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  loadMoreRows = ({startIndex, stopIndex}) => {
    const {loadedRowsMap, loadingRowCount} = this.state;
    const increment = stopIndex - startIndex + 1;

    for (var i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING;
    }

    this.setState({
      loadedRowsMap,
      loadingRowCount: loadingRowCount + increment,
    });

    // 异步加载数据
    const url = 'http://dummy.restapiexample.com/api/v1/employees';
    return fetch(`${url}?startIndex=${startIndex}&stopIndex=${stopIndex}`)
      .then(response => {
        return response.json();
      })
      .then(res => {
        // 数据加载完成
        const {loadedRowsMap, loadedRowCount, loadingRowCount} = this.state;

        for (var i = startIndex; i <= stopIndex; i++) {
          loadedRowsMap[i] = STATUS_LOADED;
        }

        const data = res.slice(0, increment).map(o => ({
          ...o,
          id: Math.round(Math.random() * 2000) + o.id,
        }));

        this.setState({
          list: this.state.list.concat(data),
          loadingRowCount: loadingRowCount - increment,
          loadedRowCount: loadedRowCount + increment,
          loadedRowsMap,
        });
      });
  };

  render() {
    const {totalCount, loadingRowCount, loadedRowCount} = this.state;

    // 使用 AutoSizer 可以自动给 AutoSizer 设置高度和宽度
    // 详情: https://github.com/bvaughn/react-virtualized/blob/master/docs/usingAutoSizer.md
    return (
      <div>
        <div>
          <p>
            加载中: {loadingRowCount}, 加载完成: {loadedRowCount}{' '}
          </p>
        </div>

        <div
          style={{position: 'fixed', top: 150, left: 0, right: 0, bottom: 0}}
        >
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={totalCount}
          >
            {({onRowsRendered, registerChild}) => (
              <AutoSizer>
                {({height, width}) => (
                  <List
                    height={height}
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    rowCount={totalCount}
                    rowHeight={50}
                    rowRenderer={this.rowRenderer}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        </div>
      </div>
    );
  }
}

export default App;
