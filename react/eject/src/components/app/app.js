import React from 'react';
import style from './app.module.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 123
    }
  }
  changeName(name) {
    this.setState({
      name
    })
  }
  render() {
    return (
      <div className="app">
        <div className={style.test} onClick={this.changeName.bind(this,321)}>{this.state.name}</div>
        <Child name={this.state.name} render={name=><Child2 name={name}></Child2>}></Child>
      </div>
    )
  }
}

class Child extends React.Component {
  render() {
    return (
      <div className="child">
        <div className={style.child}>{this.props.name}</div>
        {this.props.render(this.props.name)}
      </div>
    )
  }
}

class Child2 extends React.Component {
  render() {
    return (
      <div className="child2">
        <div className={style.child2}>{this.props.name}</div>
      </div>
    )
  }
}

export default App;
