const React = require('react');
const ReactDOM = require('react-dom');
const Link = require('react-router-dom').Link
// style for BOOK
const style = require('../styles/Profile');
// other components and etc
const Header = require('./Header');
const UserBook = require('./UserBook');
const IncomeProposal = require('./IncomeProposal');
const OutcomeProposal = require('./OutcomeProposal');
// react-bootstrap
const {Grid, Row, Col, FormControl, ControlLabel, FormGroup, HelpBlock, Tabs, Tab, Form, Button} = require('react-bootstrap');

/* component for user profile */
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
      city: "",
      street: "",
      book_to_add: "",
      user_books: "loading...",
      income: null,
      outcome: null
    };
    this.cityChanged = this.cityChanged.bind(this);
    this.streetChanged = this.streetChanged.bind(this);
    this.bookChanged = this.bookChanged.bind(this);
    this.addBook = this.addBook.bind(this);
  }
  /****************************/
  // Handlers
  /****************************/
  cityChanged(event) {
      const value = event.target.value;
          this.setState({
            ["city"]: value
           });
    // set city in DB
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/set-city', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      let body = 'city=' + encodeURIComponent(value);

      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        console.log(response);
        }
  }
  /**/
  streetChanged(event) {
    const value = event.target.value;
          this.setState({
            ["street"]: value
           });
    // set street in DB
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/set-street', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      let body = 'street=' + encodeURIComponent(value);

      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        console.log(response);
        }
  }
  /**/
  bookChanged(event) {
    const value = event.target.value;
          this.setState({
            ["book_to_add"]: value
           });
  }
  /**/
  addBook() {
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/add-book', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      let body = 'bookname=' + encodeURIComponent(this.state.book_to_add);

      xhr.send(body);

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        console.log(response);
        }
  }
  /**/
  customValidateText(text) {
      return (text.length > 0 && text.length < 17);
    }
  /****************************/
  componentWillMount() {
     // get user nickname
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/is-loged-in', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


      xhr.send();

      xhr.onreadystatechange = function() {
        if (this.readyState != 4) return;
        if (this.status != 200) {
          alert( 'error: ' + (this.status ? this.statusText : 'request has not been set') );
          return;
        }
        let response = JSON.parse(this.responseText);
        let income = response.income.map((e) => {
          return <IncomeProposal bookname1={e.chosenBook} bookname2={e.chosenAnotherUserBook} nickname={e.anotherUserNickname}/>;
        });
        let outcome = response.outcome.map((e) => {
          return <OutcomeProposal bookname1={e.chosenBook} bookname2={e.chosenAnotherUserBook} nickname={e.anotherUserNickname}/>;
        });
        let books = response.books.map((e) => {
          return <UserBook img_url={e.img_url} bookname={e.bookname}/>;
        });
          if(response.isLogedIn == true) {
             that.setState({
            ["nickname"]: response.nickname,
            ["city"]: response.city,
            ["street"]: response.street,
            ["user_books"]: books,
            ["income"]: <div className="proposals-container">
                           {income}
                        </div>,
            ["outcome"]: <div className="proposals-container">
                           {outcome}
                        </div>
           });
          }
        }
  }
  render() {
    return(
        <div>
          <Header/>
          <div className="profile">
              <Grid>
                <Row className="show-grid">
                  <Col xs={6} md={4} className="left-col">
                    <div className="profile-label">Your profile</div>
                    <div className="profile-line"></div>
                    <form className="input-label">
                      <FormGroup
                        controlId="formBasicText"
                      >
                        <ControlLabel>Your nickname</ControlLabel>
                        <FormControl
                          type="text"
                          value={this.state.nickname}
                          readonly
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </form>
                    <div className="profile-line"></div>
                    <form className="input-label">
                      <FormGroup
                        controlId="formBasicText"
                      >
                        <ControlLabel>Your city</ControlLabel>
                        <FormControl
                          type="text"
                          value={this.state.city}
                          placeholder="enter your city"
                          onChange={this.cityChanged}
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </form>
                    <div className="profile-line"></div>
                    <form className="input-label">
                      <FormGroup
                        controlId="formBasicText"
                      >
                        <ControlLabel>Your street</ControlLabel>
                        <FormControl
                          type="text"
                          value={this.state.street}
                          placeholder="enter your street"
                          onChange={this.streetChanged}
                        />
                        <FormControl.Feedback />
                      </FormGroup>
                    </form>
                    
                    <div className="proposal-label">Proposals to exchange</div>
                    <div className="profile-line"></div>
                    <Tabs defaultActiveKey={1} id="uncontrolled-tab" className="tabs">
                      <Tab eventKey={1} title="Income">
                        {this.state.income}
                      </Tab>
                      <Tab eventKey={2} title="Outcome">
                        {this.state.outcome}
                      </Tab>
                    </Tabs>
                  </Col>
                  <Col xs={12} md={8} className="right-col">
                    <div className="library-label">Your library</div>
                     <Form inline className="input-label add-form">
                      <FormGroup
                        controlId="addBookForm"
                      >
                        <FormControl
                          type="text"
                          value={this.state.book_to_add}
                          placeholder="enter book name"
                          onChange={this.bookChanged}
                          style={{"width": "100%"}}
                        />
                         <Button type="button" style={{"width": "100%"}} onClick={this.addBook}>Add book</Button>
                        <FormControl.Feedback />
                      </FormGroup>
                    </Form>
                    <div className="library">
                      {this.state.user_books}
                    </div>
                  </Col>
                </Row>
              </Grid>
          </div>
        </div>
    );
  }
}
module.exports = Profile;