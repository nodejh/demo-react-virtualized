import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Demo1 from './components/Demo1';
import Demo2 from './components/Demo2';
import Demo3 from './components/Demo3';
import './App.css';
import 'react-virtualized/styles.css';

function Home() {
  return (
    <div>
      <div>
        <h2> Demo1: 虚拟列表，滚动加载获取数据，Loading 效果</h2>
        <p>固定高度、宽度的虚拟列表，并且具有一个底部的 Loading 效果</p>
      </div>
      <div>
        <h2>
          Demo2: 虚拟列表，滚动加载获取数据，每个 Item 单独的 Loading 效果
        </h2>
        <p>固定高度、宽度的虚拟列表，列表中每一项都可以有 Loading 效果</p>
      </div>
      <div>
        <h2>Demo3: 虚拟列表，滚动加载获取数据，Loading 效果，自动高度、宽度</h2>
        <p>
          很多时候列表并不是固定宽高，这个 demo 就是这种情况。通过 AutoSizer
          给列表一个自动的宽度和高度。
        </p>
      </div>
      <div>
        <h4>相关链接：</h4>
        <p>
          <a href="https://github.com/bvaughn/react-virtualized">
            {' '}
            React Virtualized{' '}
          </a>
        </p>
        <p>
          <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/README.md">
            {' '}
            React Virtualized Doc{' '}
          </a>
        </p>
        <p>
          <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/usingAutoSizer.md">
            AutoSizer 文档
          </a>
        </p>
        <p>
          <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md">
            List 文档
          </a>
        </p>
        <p>
          <a href="https://github.com/bvaughn/react-virtualized/blob/master/docs/InfiniteLoader.md">
            InfiniteLoader 文档
          </a>
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/demo1/">Demo1</Link>
            </li>
            <li>
              <Link to="/demo2/">Demo2</Link>
            </li>
            <li>
              <Link to="/demo3/">Demo3</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Home} />
        <Route path="/demo1/" exact component={Demo1} />
        <Route path="/demo2/" exact component={Demo2} />
        <Route path="/demo3/" exact component={Demo3} />
      </div>
    </Router>
  );
}

export default App;
