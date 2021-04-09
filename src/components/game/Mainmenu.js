import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { withRouter } from 'react-router-dom';

const Container = styled(BaseContainer)`
  color: black;
  text-align: center;
`;

const TitelContainer = styled.div`
  font-family: "Monospace", sans-serif;
  text-transform: uppercase;
  color: black;
  font-weight: bold;
  font-size: 40px;
  margin-bottom: -60px;
`;

const TitelContainer2 = styled.div`
  font-family: "Monospace", sans-serif;
  color: black;
  font-weight: bold;
  font-size: 20px;
`;


const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  cursor: pointer;
`;

class Mainmenu extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null
    };
  }

  async logout() {
    try {
      let userToken = localStorage.getItem("token");
      const requestBody = JSON.stringify({
        token: userToken
      });
    
      const response = await api.put('/logout', requestBody);
      // Logout successfully worked --> navigate to the route /login in the AppRouter and remove token

      localStorage.removeItem('token');
      
      console.log(this.props)
      console.log(this.props.history)
      
      this.props.history.push('/login');
    } catch (error) {
      alert(`Something went wrong during the logout: \n${handleError(error)}`);
    }
    // if there's still a token in localstorage after terminating the server before login out
    finally {
      localStorage.removeItem('token');
      this.props.history.push('/login');
    }
  }

  join() {
    this.props.history.push('/game/join');
  }

  create() {
    this.props.history.push('/game/lobby');
  }

  profile() {
    this.props.history.push('/game/profile');
  }

  render() {
    return (
      <Container>
        <TitelContainer>
          <h2>UNO Online</h2>
        </TitelContainer>
        <TitelContainer2>
          <h1>Multiplayer Game</h1>
        </TitelContainer2>
          <div>
            <ButtonContainer>
              <Button
              width="100%"
              onClick={() => {
                this.join();
              }}
              >
              Join Game
              </Button>
            </ButtonContainer>

            <ButtonContainer>
              <Button
              width="100%"
              onClick={() => {
                this.create();
              }}
              >
              Create Lobby
              </Button>
            </ButtonContainer>

            <ButtonContainer>
              <Button
              width="100%"
              onClick={() => {
                this.profile();
              }}
              >
              Profile
              </Button>
            </ButtonContainer>
      
            <Button2
              width="80%"
              onClick={() => {
                this.logout();
              }}
            >
              Logout
            </Button2>
          </div>
        
      </Container>
    )
  }
}

export default withRouter(Mainmenu);
