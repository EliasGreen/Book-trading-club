const React = require('react');
const Link = require('react-router-dom').Link
// style for BOOK
const style = require('../styles/UserBook');

/* component for displaying books in user library */
class UserBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img_url: this.props.img_url,
      bookname: this.props.bookname
    };
  }
  render() {
    return(
      <div className="book">
        <img src={this.state.img_url} alt="book pic" className="img-user"/>
        <div className="bookname">{this.state.bookname}</div>
      </div>
    );
  }
}
module.exports = UserBook;