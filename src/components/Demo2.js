import React from 'react';
import {InfiniteLoader, List} from 'react-virtualized';

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCount: 1000,
      list: [],
      loadedRowCount: 0, // 当前已经加载完毕的列表数量
      loadedRowsMap: {}, // 列表索引 -> 是否正在加载 的映射。如 { 1: 2 }，表示列表第一项已经加载完毕
      loadingRowCount: 0, // 当前正在加载的列表数量
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
        <div style={{border: '1px solid #ddd', padding: 5, background: '#ddd'}}>
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

    // 更新每一项的加载状态，已经加载中的数量
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

        // 更新每一项的加载状态，已经加载中、加载完成的数量，以及列表的数据
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
    return (
      <div>
        <div>
          <p>
            加载中: {loadingRowCount}, 加载完成: {loadedRowCount}{' '}
          </p>
        </div>
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
              style={{ border: '1px solid blue' }}
            />
          )}
        </InfiniteLoader>
      </div>
    );
  }
}

export default App;
