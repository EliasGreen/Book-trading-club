const React = require('react');
const Link = require('react-router-dom').Link
// style for MAIN
const style = require('../styles/Main');
// other components and etc
const Header = require('./Header');

/* the main page that showed when user is not loged in */
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div>
        <Header/>
        <h1>Hello World!</h1>
      </div>
    );
  }
};

module.exports = Main;