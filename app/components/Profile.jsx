const React = require('react');
const ReactDOM = require('react-dom');
const Link = require('react-router-dom').Link
// style for BOOK
const style = require('../styles/Profile');
// other components and etc
const Header = require('./Header');
const IncomeProposal = require('./IncomeProposal');
const OutcomeProposal = require('./OutcomeProposal');
// react-bootstrap
const {Grid, Row, Col, FormControl, ControlLabel, FormGroup, HelpBlock, Tabs, Tab} = require('react-bootstrap');

/* component for user profile */
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: "",
      city: "",
      street: ""
    };
    this.cityChanged = this.cityChanged.bind(this);
    this.streetChanged = this.streetChanged.bind(this);
  }
  /****************************/
  // Handlers
  /****************************/
  cityChanged(event) {
      const value = event.target.value;
          this.setState({
            ["city"]: value
           });
     console.log(this.state.city);
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
    console.log(this.state.street);
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
          if(response.isLogedIn == true) {
             that.setState({
            ["nickname"]: response.nickname,
            ["city"]: response.city,
            ["street"]: response.street
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
                        <div className="proposals-container">
                          <IncomeProposal bookname1={"Book Wow Yee"} bookname2={"ExchangeBook!23"} nickname={"Petruha"}/>
                          <IncomeProposal bookname1={"Baer"} bookname2={"Numbers"} nickname={"Alena"}/>
                          <IncomeProposal bookname1={"Glory"} bookname2={"E9090"} nickname={"Borodina"}/>
                        </div>
                      </Tab>
                      <Tab eventKey={2} title="Outcome">
                        <div className="proposals-container">
                          <OutcomeProposal bookname1={"Book dsfdsWow Yee"} bookname2={"ExchangeBook!23"} nickname={"Petruha"}/>
                          <OutcomeProposal bookname1={"Baer"} bookname2={"Numbers"} nickname={"Aledfsdna"}/>
                          <OutcomeProposal bookname1={"Glory"} bookname2={"E9090"} nickname={"Borodsfdina"}/>
                        </div>
                      </Tab>
                    </Tabs>
                  </Col>
                  <Col xs={12} md={8} className="right-col">
                    <code>&lt;{'Col xs={12} md={8}'} /&gt;</code>
                  </Col>
                </Row>
              </Grid>
          </div>
        </div>
    );
  }
}
module.exports = Profile;