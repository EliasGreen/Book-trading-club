const React = require('react');
const Link = require('react-router-dom').Link
// style for BOOKS
const style = require('../styles/Books');
// other components and etc
const Header = require('./Header');

/* the books page that shows all books */
class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div>
        <Header/>
        <h1>Books</h1>
      </div>
    );
  }
};

module.exports = Books;