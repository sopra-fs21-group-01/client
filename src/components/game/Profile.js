import React from "react";
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { withRouter } from 'react-router-dom';
import { api, handleError } from '../../helpers/api';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
`;

const TitelContainer = styled.div`
  font-family: "Monospace", sans-serif;
  text-transform: uppercase;
  color: black;
  font-weight: bold;
  font-size: 30px;
  margin-bottom: -20px;
  
`;

const Container3= styled.div`
  text-transform: uppercase;
  font-family: "Monospace", sans-serif;
  color: black;
  font-weight: bold;
`;

const Container2 = styled.li`
  display: flex;
  border-radius: 6px; 
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin: 5px;
  color: black;
`;

const Container = styled(BaseContainer)`
  display: flex;
  flex-direction: column;
  text-align: center;

`;


class Profile extends React.Component {
    constructor() {
        super();
        this.state = {user: {}}
        };

  async componentDidMount() {
    try {
        const path = this.props.location.pathname.split("/").pop();
        const response = await api.get(`users/${path}`);

        // Get the returned users and update the state.
        this.setState({ user: response.data });

    }  catch (error) {
        alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  editProfile(id){
    this.props.history.push(`/game/edit/${id}`);
  }

  return() {
    this.props.history.push('/game/mainmenu');
  }

  changeTheme() {
      this.props.history.push('/game/theme')
  }

  render() {
    return (
      <Container>
          <TitelContainer>
            <h2>Profile</h2>
          </TitelContainer>          
              <div>
                 
                    <Container2>
                      <Container3>{"Username:"}</Container3>{this.state.user.username}
                    </Container2>
                    <Container2>
                      <Container3>{"Email:"}</Container3>{this.state.user.email}
                    </Container2>
                    <ButtonContainer>
                      <Button
                        width="30%"
                        disabled={localStorage.getItem("token") !== this.state.user.token}
                        onClick={() => {
                            this.editProfile(this.state.user.id);
                        }}
                        >
                        Edit Profile
                      </Button>                    
                    </ButtonContainer>
                    <ButtonContainer>
                      <Button2 
                        width="20%" 
                        onClick={() => {this.return()}}
                      >
                        Return
                      </Button2>
                    </ButtonContainer>
                  
              </div>
      </Container>
    );
  }
}

export default withRouter(Profile);
