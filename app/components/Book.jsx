const React = require('react');
const Link = require('react-router-dom').Link
// style for BOOK
const style = require('../styles/Book');

/* component for displaying book */
class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img_url: this.props.img_url,
      nickname: this.props.nickname,
      bookname: this.props.bookname
    };
  }
  render() {
    return(
      <div className="book">
        <img src={this.state.img_url} alt="book pic" className="img"/>
        <div className="bookname">{this.state.bookname}</div>
        <div className="exchange-btn">Exchange</div>
        <div className="nickname">Added by {this.state.nickname}</div>
      </div>
    );
  }
}
module.exports = Book;