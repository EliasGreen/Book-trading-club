const React = require('react');
const Link = require('react-router-dom').Link
// style for BOOKS
const style = require('../styles/Books');
// react-bootstrap
const {Modal, Button, form, FormGroup, FormControl, ControlLabel, option} = require('react-bootstrap');
// other components and etc
const Header = require('./Header');
const Book = require('./Book');

/* the books page that shows all books */
class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       show: false,
       modal_label: "Choose a book from your library to exchange",
       chosenAnotherUserBook: "",
       chosenBook: "",
       anotherUserNickname: "",
       disabled: true,
       books: "loading...",
       modal_content: "loading..."
    };
    
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleExchange = this.handleExchange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }
   /***********************/
   // handlers
   /***********************/
  handleShowModal(chosenAnotherUserBook, anotherUserNickname) {
    // show Modal
    this.handleShow();
    this.setState({
          ["chosenAnotherUserBook"]: chosenAnotherUserBook,
          ["anotherUserNickname"]: anotherUserNickname
           });
  }
  /***********************/
  // send variables to create proposals
  /***********************/
  handleExchange() {
        // post request to create proposals
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/create-proposals', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      
      let body = 'chosenAnotherUserBook=' + encodeURIComponent(this.state.chosenAnotherUserBook) +
      '&chosenBook=' + encodeURIComponent(this.state.chosenBook) +
      '&anotherUserNickname=' + encodeURIComponent(this.state.anotherUserNickname);


      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        if(response.error == 0) {
           window.location.href = "/books";
           that.setState({
          ["modal_label"]: "Succsess"
           });
        }
        else {
          that.setState({
          ["modal_label"]: "Oops, something went wrong :/ try again pls"
           });
         }
        }
  }
  /***********************/
  handleSelectChange(event) {
    console.log(event.target.value);
     this.setState({
          ["chosenBook"]: event.target.value,
          ["disabled"]: false
           });
  }
  /***********************/
   handleClose() {
    this.setState({ show: false });
  }
  /***********************/
  handleShow() {
     this.setState({
          ["disabled"]: true
           });
    this.setState({ show: true });
  }
   /***********************/
  componentWillMount() {
    // load books
      let that = this;
      let xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/get-all-users-books', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.send();

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        let books = response.books.map((el) => {
          return <Book showModal={that.handleShowModal} bookname={el.bookname} nickname={el.nickname} img_url={el.img_url}/> 
        });
           that.setState({
          ["books"]: <div className="books">
                      {books}     
                    </div>
           });
       }
      // getl user's filtered books
      xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/get-user-filtered-books', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      xhr.send();

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        let options = response.books.map((el) => {
          return <option value={el.bookname} key={el.bookname}>{el.bookname}</option>;
        });
        if(options.length > 0) {
           that.setState({
          ["modal_content"]: <FormControl componentClass="select"
                                placeholder="select"
                                onChange={that.handleSelectChange}>
                                {options}
                              </FormControl>
           });
        }
        else {
           that.setState({
            ["modal_content"]: "You do not have books: add the one before exchanging!"
             });
        }
       }
  }
  render() {
    return (
      <div>
        <Header/>
        {this.state.books}
         <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modal_label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <FormGroup controlId="formControlsSelect">
                <ControlLabel>Select</ControlLabel>
                {this.state.modal_content}
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleExchange} className="btn-modal" disabled={this.state.disabled}>Confirm</Button>
            <Button onClick={this.handleClose} className="btn-modal">Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
};

module.exports = Books;