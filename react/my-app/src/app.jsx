import React from 'react'
import Todo from 'r-page/todo/index.jsx';
import {Provider} from 'react-redux'
import store from './redux/store';

const app = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <Todo></Todo>
      </div>
    </Provider>
  )
}

export default app
