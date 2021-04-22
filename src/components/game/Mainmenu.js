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
      
      console.log(this.props) // TODO für was sind diese beiden console.log?
      console.log(this.props.history)
      
      this.props.history.push('/login');
    } catch (error) {
      alert(`Something went wrong during the logout: \n${handleError(error)}`);
    }
    // if there's still a token in localstorage after terminating the server before login out
    finally {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      this.props.history.push('/login');
    }
  }

  join() {
    this.props.history.push('/lobbyJoinSelection');
  }

  async create() {

    try {

        // get the host name of the user that creates the lobby

        const requestBody = JSON.stringify({
          host: localStorage.getItem('username'),
          });
        const response = await api.post('/lobbies', requestBody);

        const path = response.data;
        const path_ending = path.split("/")[1];
        localStorage.setItem('lobbyID', path_ending);

        this.props.history.push('/game/lobby');

    } catch (error) {
          alert(`Something went wrong during lobby creation: \n${handleError(error)}`);
        }
  }

  profile = (id) => {
      this.props.history.push(`/game/profile/${id}`);
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
                this.profile(localStorage.getItem('id'));
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
