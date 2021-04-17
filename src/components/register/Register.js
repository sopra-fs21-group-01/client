import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { Link } from "react-router-dom";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 5px;
  margin-bottom: 20px;
  background: rgba(240, 229, 204, 0.3);
  color: black;
`;

const Label = styled.label`
  font-family: "Monospace", sans-serif;
  color: black;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  cursor: pointer;
`;

const ButtonContainer2 = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const TitelContainer = styled.div`
  font-family: "Monospace", sans-serif;
  text-transform: uppercase;
  color: black;
  font-weight: bold;
`;



/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Register extends React.Component {
  /**
   * If you donâ€™t initialize the state and you donâ€™t bind methods, you donâ€™t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      username: null,
      email: null,
      password: null
    }
  }
  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */
  async register() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password

      });
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // username posted to localstorage for later use in Lobby creation
      localStorage.setItem('username', user.username);

      
      alert("successfully registered!")
      this.props.history.push(`/login`);
    
    } catch (error) {
      alert(`Something went wrong during the registration: \n${handleError(error)}`);
    }
  }

  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */
  componentDidMount() {}

  render() {
    return (
      <BaseContainer>
        <FormContainer>
          <TitelContainer>
            <h1>Register</h1>
          </TitelContainer>
          <Form>
            <Label>Username</Label>
            <InputField
              onChange={e => {
                this.handleInputChange('username', e.target.value);
              }}
            />
            <Label>Email</Label>
            <InputField
              onChange={e => {
                this.handleInputChange('email', e.target.value);
              }}
            />
            <Label>Password</Label>
            <InputField
              type="password"
              onChange={e => {
                this.handleInputChange('password', e.target.value);
              }}
            />
            <ButtonContainer>
              <Button
                disabled={!this.state.username || !this.state.password}
                width="60%"
                onClick={() => {
                  this.register();
                }}
              >
                Register
              </Button>
            </ButtonContainer>
            <ButtonContainer2>
              <Link to="/login"><Button2
              width="100%"
              >
                Already got an account? Login Here
              </Button2>
              </Link>
            </ButtonContainer2>
          </Form>
        </FormContainer>
      </BaseContainer>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Register);
