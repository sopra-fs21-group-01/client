import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { Button3 } from '../../views/design/Button3';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import PlayerList from '../shared/models/PlayerList';
import { Spinner } from '../../views/design/Spinner';

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

class Lobby extends React.Component {
    constructor() {
        super();
        this.state = {
            id: localStorage.getItem('lobbyId'),
            host: localStorage.getItem('username'),
            playerList:null,
            initialCards: null
        };
    }

    componentDidMount(){
      this.updateInterval = setInterval(()=> (this.checkStatus()), 1000);
      }

    async checkStatus(){
    try {
       const id = localStorage.getItem("lobbyId")
            const response = await api.get('/lobbies/'+id);
            const opponentList = new PlayerList(response.data);
            this.setState({playerList: (opponentList.playerList)});
            console.log(this.state.playerList);
            if (response.data.inGame == true)
            {
            this.props.history.push('/game/running')
            }
    }
            catch (error) {
                  alert(`Something went wrong when asking if game is started: \n${handleError(error)}`);
                }
        }
  componentWillUnmount(){
  clearInterval(this.updateInterval)
  }



    async closeLobby() {
    try {
    const lobbyId = localStorage.getItem('lobbyId');
    await api.delete("/lobbies/"+lobbyId)}
    catch (error) {
            alert(`Something went wrong during lobby deleting: \n${handleError(error)}`);
          }
    this.props.history.push('/game');
    }

    invite() {
    // Create invitation code
    }

    async startGame(){
      try{
       const requestBody = JSON.stringify({
              id: localStorage.getItem('lobbyId'),
              host: localStorage.getItem('username'),
              initialCards: this.initialCards,
               });

      const lobbyId = localStorage.getItem('lobbyId');
      await api.post("/game/"+lobbyId+"/kickOff", requestBody)
          const d = new Date();
          const time = d.toLocaleTimeString();
          const message = "NPC/Welcome to the game"
          const requestBody2 = JSON.stringify({
              message: message,
              lobby: localStorage.getItem('lobbyId'),
              timestamp: time,

          });
      await api.post("/chats", requestBody2);
          this.props.history.push('/game/running')
      }catch (error){
          alert(`Something went wrong during the creation of the game: \n${handleError(error)}`);
      }
    }

    render() {
    return (
    <Container2>
      <Container>
        <TitelContainer>
          <h2>Lobby</h2>
        </TitelContainer>
          <div>
            {/* <Dropdown>

                <Dropdown.Toggle variant="success" id="dropdown-basic">
                Game Mode
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Standard</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Special 1</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Special 2</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown> */}

            <ButtonContainer>
              <Button3
              width="100%"
              onClick={() => {
                this.startGame();
              }}
              >
              Start Game
              </Button3>
            </ButtonContainer>

            <h1>Player(s):</h1>

         
              {!this.state.playerList ? (
                <Spinner />
                ) : (
                  (this.state.playerList).map(player => (<li key={player}>{player}</li>))
              )}
         
            <Button2
              width="100%"
              onClick={() => {
                this.closeLobby();
              }}
            >
              Close Lobby
            </Button2>
          </div>

        </Container>
      </Container2>
    )
    }
}

export default withRouter(Lobby);
