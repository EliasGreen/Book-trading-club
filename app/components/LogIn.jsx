const React = require('react');
const Link = require('react-router-dom').Link
// style for BOOKS
const style = require('../styles/LogIn');
// other components and etc
const Header = require('./Header');
// react-bootstrap
const {Form, FormGroup, Col, FormControl, Button} = require('react-bootstrap');


/* the books page that shows all books */
class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
   handleChangeValue(event) {
     const target = event.target;
      const value = target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
  }
  handleSubmit(event) {
      let that = this;
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/log-in', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      
      
      let body = 'email=' + encodeURIComponent(this.state.email) +
      '&password=' + encodeURIComponent(this.state.password);


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
          ["email"]: "Succsess",
          ["password"]: "Succsess"
           });
        }
        else {
          that.setState({
          ["email"]: "Wrong email and/or password"
           });
         }
        }
      event.preventDefault();
     }
  render() {
    return (
      <div>
            <Header/>
            <Form horizontal method="post" action="/login" name="login" onSubmit={this.handleSubmit}>   
              <FormGroup controlId="formHorizontalEmail">
                <Col className="form-label" sm={2}>
                  Email
                </Col>
                <Col sm={10}>
                  <FormControl type="email" name="email" required value={this.state.email} placeholder="Email" onChange={this.handleChangeValue} />
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalPassword">
                <Col className="form-label" sm={2}>
                  Password
                </Col>
                <Col sm={10}>
                  <FormControl type="password" name="password" required value={this.state.password} placeholder="Password" onChange={this.handleChangeValue}/>
                </Col>
              </FormGroup>

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button type="submit">Log in</Button>
                </Col>
              </FormGroup>
          </Form>
        </div>
    );
  }
};

module.exports = LogIn;