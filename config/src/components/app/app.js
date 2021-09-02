import React from 'react';
import style from './app.module.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 123
    }
  }
  changeName = name => {
    this.setState({
      name
    })
  }
  render() {
    return (
      <div className="app">
        <div className={style.test} onClick={this.changeName.bind(this, 321)}>{this.state.name}</div>
        <Child name={this.state.name} changeName={this.changeName}>
          <div>321</div>
        </Child>
      </div>
    )
  }
}

class Child extends React.Component {
  render() {
    return (
      <div className="child">
        <div className={style.child} onClick={this.props.changeName}>{this.props.name}</div>
        {this.props.children}
      </div>
    )
  }
}

export default App;
