import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button2 } from '../../views/design/Button2';
import { Button3 } from '../../views/design/Button3';
import { Button5 } from '../../views/design/Button5';
import { withRouter } from 'react-router-dom';
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
            initialCards: null,
            disabled: false,
            winnerList: null,
            showMenu: false,
        };
        this.showMenu = this.showMenu.bind(this);

    }

    showMenu(event) {
      event.preventDefault();
      
      this.setState({ showMenu: true }, () => {
        document.addEventListener('click', this.closeMenu);
      });
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
            this.setState({winnerList: (opponentList.winnerList)});
            if (response.data.inGame == true) {
                this.props.history.push('/game/running')
            }
            this.checkPlayerListSize();
        }
            catch (error) {
                  alert(`Something went wrong when asking if game is started: \n${handleError(error)}`);
                }
        }
    componentWillUnmount(){
    clearInterval(this.updateInterval)
    }

    checkPlayerListSize(){
        if(this.state.playerList.length > 1){
            this.setState({disabled: true});
        }
    }

    setCardNumber(number) {
        if (number != null && number == 2) {
            this.setState({initialCards: number});
        }else if(number != null && number == 99){
            let min = Math.ceil(2);
            let max = Math.floor(10)
            number = Math.floor(Math.random()* (max - min + 1) + min) ;
            this.setState({initialCards: number});
        }
        this.setState({ showMenu: false })

    }

    async closeLobby() {
        localStorage.removeItem("winnerList");
        try {
      const lobbyId = localStorage.getItem('lobbyId');
      await api.delete("/lobbies/"+lobbyId)}
      catch (error) {
              alert(`Something went wrong during lobby deleting: \n${handleError(error)}`);}
    this.props.history.push('/game');
    }

    async startGame(){
      try{
       const requestBody = JSON.stringify({
              id: localStorage.getItem('lobbyId'),
              host: localStorage.getItem('username'),
              initialCards: this.state.initialCards,
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

            <div>
              <Button5 onClick={this.showMenu} width= "100%">
                Game Modes
              </Button5>
              
              {
                this.state.showMenu
                  ? (
                    <div className="menu">
                      <Button2 onClick={() => this.setCardNumber(null)}> Standard </Button2>
                      <Button2 onClick={() => this.setCardNumber(2)}> Speed </Button2>
                      <Button2 onClick={() => this.setCardNumber(99)}> Party </Button2>
                    </div>
                  )
                  : (
                    null
                  )
              }
            </div>

            <ButtonContainer>
              <Button3
              disabled={!this.state.disabled}
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
                  localStorage.removeItem("winnerList");
                  this.closeLobby();
              }}
            >
              Close Lobby
            </Button2>
          </div>
          <div style={{position: 'relative', top: '10px'}}>
          <h1>Rankings from last game:</h1>
          <ol>
          {!this.state.winnerList ? (
                <Spinner />
                ) : (
                  (this.state.winnerList).map(player => (<li key={player}>{player}</li>))
              )}
          </ol>
          </div>

        </Container>
      </Container2>
    )
    }

}

export default withRouter(Lobby);
