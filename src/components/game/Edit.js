import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 10px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.5);
  color: black;
`
;

const Label = styled.label`
  color: black;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const TitelContainer = styled.div`
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  color: black;
`;

class Edit extends React.Component {
    constructor() {
        super();
        this.state = {user: {}}
        };

    handleInputChange(key, value) {
        this.setState({ [key]: value });
    }

    async editUser() {
        try {
            const path = this.props.location.pathname;
            var path_ending = path.match(/\d/g);
            path_ending = path_ending.join("");

            const requestBody = JSON.stringify({
                id: this.state.user.id,
                username: this.state.username,
                password: this.state.password
            });
            const response = await api.put(`users/${this.state.user.id}`, requestBody);
     
            // Get the returned users and update the state.
            this.setState({ user: response.data });
            alert("Changes applied!")
            this.props.history.push(`../profile/${path_ending}`)
        }  catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    // if username is not changed, old username will stay
    async componentDidMount() {
        try{
            const path = this.props.location.pathname;
            var path_ending = path.match(/\d/g);
            const response = await api.get(`users/${path_ending}`); // matches the specific id
            this.setState({ user: response.data });
        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }   
    }
    //returns back to the user profile
    return() { 
        const path = this.props.location.pathname;
        var path_ending = path.match(/\d/g); 
        this.props.history.push(`../profile/${path_ending}`); // pushes back to the specific user
    }

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <TitelContainer>
                        <h2>Edit User Profile </h2>
                    </TitelContainer>
                  
                        <Label>Username</Label>
                        <InputField
                            placeholder={this.state.user.username}
                            onChange={e => {
                                this.handleInputChange("username", e.target.value);
                                localStorage.setItem("username", e.target.value);
                            }}
                        />
                        <Label>Password</Label>
                        <InputField
                            type="password"
                            placeholder={this.state.user.password}
                            onChange={e => {
                                this.handleInputChange("password", e.target.value);
                            }}
                        />
              
                </FormContainer>
                <ButtonContainer>
                    <Button
                        width="30%"
                        onClick={() => {
                            this.editUser() 
                        }}
                    >
                        Save
                    </Button>
                </ButtonContainer>
                <ButtonContainer>
                    <Button2 
                        width="20%"
                        onClick={() => {
                            this.return()
                        }}
                    >
                        Return 
                    </Button2>                   
                </ButtonContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Edit)
