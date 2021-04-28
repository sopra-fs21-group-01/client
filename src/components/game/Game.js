import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { Button3 } from '../../views/design/Button3';
import '../../views/design/Card.css';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { Spinner } from '../../views/design/Spinner';
import Lobby from '../shared/models/Lobby';
import UnoTable from '../../views/Images/UnoTable.png';
import PlayerList from '../shared/models/PlayerList';
import Player from '../../views/Player';
import Hand from '../shared/models/Hand';
import GameEntity from '../shared/models/GameEntity';

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
const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: 5px;
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
            id: null,
            gamemode: null,
            host: null,
            cardStack: null,
            convertedHand: null,
            userid: null,
            currentplayer: null,
            currentcolor: null,
            currentvalue: null,

            
            // TODO eventuell noch gamedirection für frontend per getrequest holen
        };
        this.userid = localStorage.getItem("id");
        this.id = localStorage.getItem("lobbyId");
    }
    

      async componentDidMount(){
        this.updateInterval = setInterval(()=> (this.checkStatus(), 5000));
        try {
            const response = await api.get(`lobbies/${this.id}`);


            // get opponents
            const opponentList = new PlayerList(response.data);
            var playerIndex = (opponentList.playerList).indexOf(localStorage.getItem('username'))
            opponentList.playerList.splice(playerIndex, 1); // remove main player
            this.setState({opponentList: JSON.stringify(opponentList.playerList)});
            localStorage.setItem('opponentList', JSON.stringify(opponentList.playerList));

            // get player's hand
            this.getHand();
            this.fetchData();
            console.log(this.currentvalue);
            console.log(this.currentcolor);
        }  catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }
    async checkStatus(){
        try {
            this.getHand();
            this.fetchData();
        }
        catch (error) {
            alert(`Something went wrong when fetching currentplayer: \n${handleError(error)}`);
        }
    }
    componentWillUnmount(){
        clearInterval(this.updateInterval)
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
            const response = await api.get("game/"+this.id+"/kickOff");
            const game = new GameEntity(response.data);
            this.gamemode = game.gamemode;
            this.host = game.host;
            this.currentplayer = game.currentPlayer;
            this.currentcolor = game.currentColor;
            this.currentvalue = game.currentValue;


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
    async playCard(card){
        if(this.currentplayer == this.userid) {
            var str = card.split('/');
            var color = str[0];
            var value = str[1];
            const requestBody = JSON.stringify({
                playerId: this.userid,
                color: color,
                value: value,
            });
            const response = await api.put("game/" + this.id + "/playerTurn", requestBody);
            this.getHand();
            this.fetchData();
        }
    }
    async getHand(){
      try {
      const response = await api.get(`users/${this.userid}/hands`);
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
                    cardtransformed[j] = "Yellow/" + value;
                    break;  
                  case "Wild" :
                    cardtransformed[j] = "Wild/" + value;
                    break;
                  case "Blue" :
                    cardtransformed[j] = "Blue/" + value;
                    break;          
                  case "Red" :
                    cardtransformed[j] = "Red/" + value;
                    break;     
                  case "Green" :
                    cardtransformed[j] = "Green/" + value;
                    break;                 
                }
            }
      this.setState({ convertedHand: cardtransformed});
      //console.log(cardarray);console.log(this.state.convertedHand[0]);
    }
    /* <div style={{ backgroundImage: `url(${UnoTable}) `}}>
                <img src={UnoTable} style={{width: '100%'}} />
          </div>

     */
    drawCard() {

    }
    render() {
      return (
      <Container2>
        <Container>
  
          <TitelContainer>
            <h2>Lets start the game</h2>
          </TitelContainer>
            <section className="content card">
              {!this.state.convertedHand ? (
                <Spinner />
                ) : (
                  (this.state.convertedHand).map(i => (
                      <div className="card-hghlght card">
                      <img src={require(`../../views/Images/CardDesigns/standard/${i}.png`).default} onClick={async () => this.playCard(i)} alt={"Image not loaded"} />
                      </div>
                  ))
              )}

            </section>
            {!this.currentcolor && !this.currentvalue ?(
                <Spinner/>
                ) : (
                <div className="card">
                    <img src={require(`../../views/Images/CardDesigns/standard/${this.currentcolor}/${this.currentvalue}.png`).default}/>
                </div>
            )
            }

            <Button
                onClick={() =>{
                    this.drawCard();
            }}>
            draw card
            </Button>
        </Container>
      </Container2>
      )
    }


}

export default withRouter(Game)
