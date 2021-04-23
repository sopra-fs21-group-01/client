import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { withRouter } from 'react-router-dom';
import { Spinner } from '../../views/design/Spinner';
import LobbyView from '../../views/LobbyView';
import Lobby from '../shared/models/Lobby';


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

const Lobbies = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const LobbyContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  cursor: pointer;
`;

class LobbyJoinSelection extends React.Component {
  constructor() {
    super();
    this.state = {
      lobbies: null
    };
  }

  async join(id) {

    try {

        // get the host name of the user that creates the lobby

        const requestBody = JSON.stringify({
          playerName: localStorage.getItem('username'),
          });
        await api.put('/lobbies/'+id+'/joinedLobbies', requestBody);

        this.props.history.push('/game/waitingRoom');

    } catch (error) {
          alert(`Something went wrong during lobby joining: \n${handleError(error)}`);
        }
  }


  async componentDidMount() {
    try {
      const response = await api.get('/lobbies');

      const lobby = new Lobby(response.data);

      // Get the returned users and update the state.
      this.setState({ lobbies: response.data });

      // See here to get more data.
      console.log(response);
    } catch (error) {
      alert(`Something went wrong while fetching the lobbies: \n${handleError(error)}`);
    }
  }

// uses Lobby from Views, declars Lobbyname there if it should be shown
  render() {
    return (
      <Container>
        <TitelContainer>
          <h2>UNO Lobbies</h2>
        </TitelContainer>
          {!this.state.lobbies ? (
            <Spinner />
            ) : (
         <div>
            <Lobbies>
              {this.state.lobbies.map(lobby => {
                return (
                  <LobbyContainer key={lobby.id}>
                    <LobbyView lobby={lobby} />
                     <Button
                     width= "100%"
                     onClick={()=> {
                     localStorage.setItem('lobbyId', lobby.id);
                     this.join(lobby.id)}}>
                    Join Lobby
                   </Button>
                   <span>&nbsp;&nbsp;</span>
                  </LobbyContainer>
                );
              })}
            </Lobbies>
            <Button
              width="100%"
              onClick={() => {
             this.props.history.push('/game')
              }}
            >
              Back
            </Button>
          </div>)}
      </Container>
    )

}
}
export default withRouter(LobbyJoinSelection);
