/**
 *
 * HomePage
 *
 */
import React from 'react';

/* eslint-disable react/prefer-stateless-function */
export default class HomePage extends React.PureComponent {
  test = () => {
    console.log('hello'); /* eslint-disable no-console */
  };
  render() {
    return (
      <div>
        I am Homepage cool dude!!!!!!!!!!!!!
        <button onClick={this.test}>CLick</button>
      </div>
    );
  }
}
