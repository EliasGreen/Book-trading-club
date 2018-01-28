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
   this.handleRefuse = this.handleRefuse.bind(this);
   this.handleAccept = this.handleAccept.bind(this);
  }
  /****************************/
  // Handlers
  /****************************/
  handleAccept() {
    // post request to create proposals
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/accept-proposal', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      
      let body = 'chosenAnotherUserBook=' + encodeURIComponent(this.state.bookname2) +
      '&chosenBook=' + encodeURIComponent(this.state.bookname1) +
      '&anotherUserNickname=' + encodeURIComponent(this.state.nickname);


      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
          if(response.error == 0) {
             window.location.href = "/profile";
          }
        }
  }
  /****************************/
  handleRefuse() {
    // post request to create proposals
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/refuse-proposal-income', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      
      let body = 'chosenAnotherUserBook=' + encodeURIComponent(this.state.bookname2) +
      '&chosenBook=' + encodeURIComponent(this.state.bookname1) +
      '&anotherUserNickname=' + encodeURIComponent(this.state.nickname);


      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
          if(response.error == 0) {
             window.location.href = "/profile";
          }
        }
  }
  /****************************/
  render() {
    return(
      <div className="proposal">
        <div className="bookname">{this.state.bookname1}</div>
        <div className="arrow">&#10136;</div>
        <div className="bookname">{this.state.bookname2}</div>
        <div className="nickname">From {this.state.nickname}</div>
        <Button className="btn" onClick={this.handleAccept}>Accept</Button>
        <Button className="btn" onClick={this.handleRefuse}>Refuse</Button>
      </div>
    );
  }
}
module.exports = IncomeProposal;