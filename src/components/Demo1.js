import React, {Fragment} from 'react';
import {InfiniteLoader, List} from 'react-virtualized';

// 假设每页 10 条数据
const pageSize = 10;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0, // 列表的总数
      list: [], // 已经从接口中获取到的列表的数据
      loading: false, // 是否处于加载状态
    };
  }

  componentDidMount() {
    // 初始化数据
    return fetch(`http://dummy.restapiexample.com/api/v1/employees`)
      .then(response => {
        return response.json();
      })
      .then(res => {
        const data = res.slice(0, pageSize).map(o => ({
          ...o,
          id: Math.round(Math.random() * 2000) + o.id,
        }));

        this.setState({
          loading: false,
          list: this.state.list.concat(data),
          total: 1000,
        });
      });
  }

  /**
   * 当前行是否已经加载完成
   * @param {number} index - 当前行的索引。即 state.list 的数组索引
   * @return {boolean} 当前行是否已经加载完成
   */
  isRowLoaded = ({index}) => {
    const {list} = this.state;
    return !!list[index];
  };

  /**
   * 渲染每一行
   * @param {string} key - row key
   * @param {number} index - row index
   * @param {object} style - row style
   * @return {object} react node
   */
  rowRenderer = ({key, index, style}) => {
    const {list} = this.state;

    const row = list[index];
    let content = null;

    // 如果当前行有数据，则渲染对应的数据。否则渲染 null
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

  /**
   * 动态加载数据
   * @param {number} startIndex - 从列表的哪一项开始加载数据。和 list.length 的值相等
   * @param {number} stopIndex - 列表的截止数据
   * @return {object} Promise
   */
  loadMoreRows = ({startIndex, stopIndex}) => {
    this.setState({
      loading: true,
    });

    // 如果接口只支持 pageNumber / pageSize，不支持 startIndex / stopIndex
    // 则前端可以根据 startIndex 和 pageSize 计算当前的 pageNumber
    // 每次滚动后，startIndex 总是最新的 list.length 的值
    const pageNumber = parseInt(startIndex / pageSize) + 1;

    // 异步加载数据，这里使用了一个测试接口
    const url = 'http://dummy.restapiexample.com/api/v1/employees';
    // URL 参数：
    // - startIndex 为了展示当前的 startIndex
    // - stopIndex 为了展示当前的 stopIndex
    // - pageNumber
    // - pageSize

    return fetch(
      `${url}?startIndex=${startIndex}&stopIndex=${stopIndex}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    )
      .then(response => {
        return response.json();
      })
      .then(res => {
        // 数据加载完成
        // 这里的 res.slice(0, pageSize) 目的是取出 pageSize 条数据，模拟真实的根据页码获取数据
        // 因为测试的接口每次要返回几十条数据，所以只取一部分用来模拟真实数据
        const data = res.slice(0, pageSize).map(o => ({
          ...o,
          id: Math.round(Math.random() * 2000) + o.id,
        }));

        // 更新 loading 和数据列表 list
        // list 需要使用 concat 等类似操作，将新的数据增量更新到 state.list 中
        this.setState({
          loading: false,
          list: this.state.list.concat(data),
          total: 1000,
        });
      });
  };

  render() {
    const {total, loading} = this.state;
    return (
      <Fragment>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={total} // 列表的总数
        >
          {({onRowsRendered, registerChild}) => (
            <List
              height={200} // 列表的高度
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              rowCount={total} // 列表的总数
              rowHeight={50} // 每一行的高度
              rowRenderer={this.rowRenderer}
              width={300} // 列表的宽度
              style={{ border: '1px solid blue' }}
            />
          )}
        </InfiniteLoader>

        {/* loading 效果 */}
        {loading && <div>loading...</div>}
      </Fragment>
    );
  }
}

export default App;
