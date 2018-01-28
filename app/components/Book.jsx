const React = require('react');
const Link = require('react-router-dom').Link
// react-bootstrap
const {OverlayTrigger, Popover} = require('react-bootstrap');
// style for BOOK
const style = require('../styles/Book');

/* component for displaying book */
class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      img_url: this.props.img_url,
      nickname: this.props.nickname,
      bookname: this.props.bookname,
      tooltip: <Popover id="popover" title="User location">
                            <div>
                            Street: 
                           </div>
                           <div>
                             City: 
                           </div>
                        </Popover>
    };
  }
  /***********************/
  componentWillMount() {
    //get street and city of user by nickname
    let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/get-street-city-by-nick', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      
      let body = 'nickname=' + encodeURIComponent(this.props.nickname);


      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        let street = response.street;
        let city = response.city;
        if(response.street.length == 0)  street = "not specified";
        if(response.city.length == 0)  city = "not specified";
           that.setState({
          ["tooltip"]: <Popover id="popover" title="User location">
                            <div>
                            Street: {street}
                           </div>
                           <div>
                             City: {city}
                           </div>
                        </Popover>
           });
        }
  }
  /***********************/
  render() {
    return(
      <div className="book-all">
        <img src={this.state.img_url} alt="book pic" className="img-all"/>
        <div className="bookname-all">{this.state.bookname}</div>
        <div className="exchange-btn-all" onClick={() => this.props.showModal(this.props.bookname, this.props.nickname)}>Exchange</div>
         <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="bottom"
            overlay={this.state.tooltip}
          >
              <div className="nickname-all">Added by {this.state.nickname}</div>
          </OverlayTrigger>
      </div>
    );
  }
}
module.exports = Book;