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
import yellow_1 from '../../views/Images/CardDesigns/standard/yellow/1.png';
import yellow_2 from '../../views/Images/CardDesigns/standard/yellow/2.png';
import yellow_3 from '../../views/Images/CardDesigns/standard/yellow/3.png';
import yellow_4 from '../../views/Images/CardDesigns/standard/yellow/4.png';
import yellow_5 from '../../views/Images/CardDesigns/standard/yellow/5.png';
import yellow_6 from '../../views/Images/CardDesigns/standard/yellow/6.png';
import yellow_7 from '../../views/Images/CardDesigns/standard/yellow/7.png';
import yellow_8 from '../../views/Images/CardDesigns/standard/yellow/8.png';
import yellow_9 from '../../views/Images/CardDesigns/standard/yellow/9.png';
import yellow_DrawTwo from '../../views/Images/CardDesigns/standard/yellow/+2.png';
import yellow_Reverse from '../../views/Images/CardDesigns/standard/yellow/reverse.png';
import yellow_Skip from '../../views/Images/CardDesigns/standard/yellow/skip.png';
import blue_1 from '../../views/Images/CardDesigns/standard/blue/1.png';
import blue_2 from '../../views/Images/CardDesigns/standard/blue/2.png';
import blue_3 from '../../views/Images/CardDesigns/standard/blue/3.png';
import blue_4 from '../../views/Images/CardDesigns/standard/blue/4.png';
import blue_5 from '../../views/Images/CardDesigns/standard/blue/5.png';
import blue_6 from '../../views/Images/CardDesigns/standard/blue/6.png';
import blue_7 from '../../views/Images/CardDesigns/standard/blue/7.png';
import blue_8 from '../../views/Images/CardDesigns/standard/blue/8.png';
import blue_9 from '../../views/Images/CardDesigns/standard/blue/9.png';
import blue_DrawTwo from '../../views/Images/CardDesigns/standard/blue/+2.png';
import blue_Reverse from '../../views/Images/CardDesigns/standard/blue/reverse.png';
import blue_Skip from '../../views/Images/CardDesigns/standard/blue/skip.png';
import green_1 from '../../views/Images/CardDesigns/standard/green/1.png';
import green_2 from '../../views/Images/CardDesigns/standard/green/2.png';
import green_3 from '../../views/Images/CardDesigns/standard/green/3.png';
import green_4 from '../../views/Images/CardDesigns/standard/green/4.png';
import green_5 from '../../views/Images/CardDesigns/standard/green/5.png';
import green_6 from '../../views/Images/CardDesigns/standard/green/6.png';
import green_7 from '../../views/Images/CardDesigns/standard/green/7.png';
import green_8 from '../../views/Images/CardDesigns/standard/green/8.png';
import green_9 from '../../views/Images/CardDesigns/standard/green/9.png';
import green_DrawTwo from '../../views/Images/CardDesigns/standard/green/+2.png';
import green_Reverse from '../../views/Images/CardDesigns/standard/green/reverse.png';
import green_Skip from '../../views/Images/CardDesigns/standard/green/skip.png';
import red_1 from '../../views/Images/CardDesigns/standard/red/1.png';
import red_2 from '../../views/Images/CardDesigns/standard/red/2.png';
import red_3 from '../../views/Images/CardDesigns/standard/red/3.png';
import red_4 from '../../views/Images/CardDesigns/standard/red/4.png';
import red_5 from '../../views/Images/CardDesigns/standard/red/5.png';
import red_6 from '../../views/Images/CardDesigns/standard/red/6.png';
import red_7 from '../../views/Images/CardDesigns/standard/red/7.png';
import red_8 from '../../views/Images/CardDesigns/standard/red/8.png';
import red_9 from '../../views/Images/CardDesigns/standard/red/9.png';
import red_DrawTwo from '../../views/Images/CardDesigns/standard/red/+2.png';
import red_Reverse from '../../views/Images/CardDesigns/standard/red/reverse.png';
import red_Skip from '../../views/Images/CardDesigns/standard/red/skip.png';
import back from '../../views/Images/CardDesigns/standard/Back.png';
import wild from '../../views/Images/CardDesigns/standard/wild.png';
import wild_WildFour from '../../views/Images/CardDesigns/standard/wild_four.png';

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

window.onunload = () => {
  window.localStorage.clear()
}

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
            convertedHand: null,
            
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
      try {
      
      const userid = localStorage.getItem('id')
      const response = await api.get(`users/${userid}/hands`);
      const hand = new Hand(response.data);
      this.playerHand = hand.cards;
      } catch(error){
        alert(`Something went wrong during the fetch of the game information data: \n${handleError(error)}`);
    }
      var i;
      var cardarray = [];
      for (i = 0; i< (this.playerHand.length); i++) {
          var str = this.playerHand[i].split('/');
          var value = str[0];
          var color = str[1];
          cardarray.push([color,value]);
          
        }
      var cardtransformed = [];
      for (let j = 0; j < cardarray.length ; j++){
                color = cardarray[j][0];
                value = cardarray[j][1];
                switch(color) {
                  case "Yellow" : 
                    cardtransformed[j] = "yellow_" + value;
                    break;  
                  case "Wild" :
                    cardtransformed[j] = "wild_" + value;
                    break;
                  case "Blue" :
                    cardtransformed[j] = "blue_" + value;
                    break;          
                  case "Red" :
                    cardtransformed[j] = "red_" + value;
                    break;     
                  case "Green" :
                    cardtransformed[j] = "green_" + value;
                    break;                 
                }
            }
      this.setState({ convertedHand: cardtransformed});
      //console.log(cardarray); 
      console.log(this.state.convertedHand); 
    }

    render() {
      return (
      <Container2>
        <Container>
  
          <TitelContainer>
            <h2>Lets start the game</h2>
          </TitelContainer>
          {!this.state.convertedHand ? (
            <Spinner />
            ) : (
          <div style={{ backgroundImage: `url(${UnoTable}) `}}>
          <img src={UnoTable} />

   
          <img src={window[this.state.convertedHand[0]]}/>


          </div>)}


  
        </Container>
      </Container2>
      )
    }
    
}

export default withRouter(Game)
