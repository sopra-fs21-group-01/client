import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { Button3 } from '../../views/design/Button3';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { Spinner } from '../../views/design/Spinner';
import Lobby from '../shared/models/Lobby';

const Container2 = styled.div`
  display: flex;
  flex-direction: column;
`;

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
  margin-bottom: -20px;

`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  cursor: pointer;
`;

class WaitingRoom extends React.Component {
  constructor() {
    super();
    this.state = {
      gameID: null
    };
  }

    async componentDidMount(){
// calls the lobby every second to check if the host started the game
    try { setInterval(async() => {
        const id = localStorage.getItem("lobbyId")
        const response = await api.get('/lobbies/'+id);
        const lobby = new Lobby(response.data);

        if (lobby.isInGame)
        {
        this.props.history.push('/game/running');
        }
         }, 10000);}
         catch (error) {
                   alert(`Something went wrong when asking if game is started: \n${handleError(error)}`);
                 }
         }



  render() {
    return (
    <Container2>
      <Container>
        <TitelContainer>
          <h2>Waiting for Game to start</h2>
             <Spinner />
        </TitelContainer>
          <div>

          </div>

        </Container>
      </Container2>
    )
  }
}

export default withRouter(WaitingRoom);
