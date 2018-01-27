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
      <div className="book-all">
        <img src={this.state.img_url} alt="book pic" className="img-all"/>
        <div className="bookname-all">{this.state.bookname}</div>
        <div className="exchange-btn-all" onClick={() => this.props.showModal(this.props.bookname, this.props.nickname)}>Exchange</div>
        <div className="nickname-all">Added by {this.state.nickname}</div>
      </div>
    );
  }
}
module.exports = Book;