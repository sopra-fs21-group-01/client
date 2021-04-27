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
import UnoTable from '../../views/Images/UnoTable.png';
import PlayerList from '../shared/models/PlayerList';
import Player from '../../views/Player';
import Hand from '../shared/models/Hand';
import GameEntity from '../shared/models/GameEntity';
import blue4 from '../../views/Images/CardDesigns/standard/blue/4.png';

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

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

class Game extends React.Component{
    constructor() {
        super();
        this.state = {
            opponentList: null,
            playerHand: null,
            id: localStorage.getItem("LobbyID"),
            gamemode: null,
            host: null,
            cardStack: null,
            
            // TODO eventuell noch gamedirection für frontend per getrequest holen
        };
    }


  async componentDidMount(){
    try {
        const lobbyId = localStorage.getItem('lobbyId');
        const response = await api.get(`lobbies/${lobbyId}`);

        // get opponents
        const opponentList = new PlayerList(response.data);
        var playerIndex = (opponentList.playerList).indexOf(localStorage.getItem('username'))
        opponentList.playerList.splice(playerIndex, 1); // remove main player 
        this.setState({opponentList: JSON.stringify(opponentList.playerList)});
        localStorage.setItem('opponentList', JSON.stringify(opponentList.playerList));
        
        // get player's hand
        this.getHand();

    }  catch (error) {
        alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

    /** async componentDidMount(){

    const gameId = localStorage.getItem('lobbyId');

    // get players and starting hand
    try {

    const playerListResponse = await api.get("/game/"+gameId+"/kickOff");

    this.setState({opponentList: playerListResponse.data})

    }

      // call every second
      try { setInterval(async() => {



          {

          ;
          }
           }, 10000);}
           catch (error) {
                     alert(`Something went wrong when updating the game: \n${handleError(error)}`);
                   }
           } */

  

    
    

    async fetchData(){
        try{
            const response = await api.get("game"+this.id);
            const game = new GameEntity(response.data);
            this.players = game.playerList;
            this.gamemode = game.gamemode;
            this.host = game.host;
            this.cardStack = game.cardStack;

        }catch(error){
            alert(`Something went wrong during the fetch of the game information data: \n${handleError(error)}`);
        }
    }

    async deleteGame(){
        try{
            await api.delete("game/"+this.id+"deletion")
        }catch(error){
            alert(`Something went wrong during the deletion of the game: \n${handleError(error)}`);
        }
    }
    async playCard(ID, color, value){
        const requestBody = JSON.stringify({
                playerId: ID,
                color: color,
                value: value,
        });
        const response = await api.put("/game/"+this.id+"/playerTurn", requestBody);
    }
    async getHand(){
      
      const userid = localStorage.getItem('id')
      const response = await api.get(`users/${userid}/hands`);
      const hand = new Hand(response.data);
      this.playerHand = hand.cards;
      
      var i;
      var cardarray = [];
      for (i = 0; i< (this.playerHand.length); i++) {
          var str = this.playerHand[i].split('/');
          var value = str[0];
          var color = str[1];
          cardarray.push([color,value]);
          
        
   
        }
      for (let j = 0; j < cardarray.length ; j++){
                color = cardarray[j][0];
                switch(color) {
                  case "Blue" :
                    value = cardarray[j][1];
                    switch(value) {
                      case "1" :
                         // show corresponding card
                      case "2" :
                        //  show corresponding card
                      case "3" :
                        // show corresponding card
                      //usw
                    }
                }
            }
    
    console.log(cardarray); 
    }

    render() {
      return (
      <Container2>
        <Container>
  
          <TitelContainer>
            <h2>Lets start the game</h2>
          </TitelContainer>


          <div style={{ backgroundImage: `url(${UnoTable}) `}}>
          <img src={UnoTable} />
          </div>

        
        </Container>
      </Container2>
      )
    }
    
}

export default withRouter(Game)
