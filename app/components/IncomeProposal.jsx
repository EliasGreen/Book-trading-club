const React = require('react');
const Link = require('react-router-dom').Link
// style for BOOK
const style = require('../styles/IncomeProposal');
// react-bootstrap
const {Button} = require('react-bootstrap');

/* component for displaying book */
class IncomeProposal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: this.props.nickname,
      bookname1: this.props.bookname1,
      bookname2: this.props.bookname2
    };
  }
  render() {
    return(
      <div className="proposal">
        <div className="bookname">{this.state.bookname1}</div>
        <div className="arrow">&#10136;</div>
        <div className="bookname">{this.state.bookname2}</div>
        <div className="nickname">From {this.state.nickname}</div>
        <Button className="btn">Accept</Button>
        <Button className="btn">Refuse</Button>
      </div>
    );
  }
}
module.exports = IncomeProposal;