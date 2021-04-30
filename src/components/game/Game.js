import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { Button3 } from '../../views/design/Button3';
import { Button4 } from '../../views/design/Button4';
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
import Back from '../../views/Images/CardDesigns/standard/Back.png';

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
  position: relative;
  cursor: pointer;
  left: -100%;
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
            opponentListId:null,

            
            // TODO eventuell noch gamedirection für frontend per getrequest holen
        };
        this.userid = localStorage.getItem("id");
        this.id = localStorage.getItem("lobbyId");
    }
    

      async componentDidMount(){
        this.updateInterval = setInterval(()=> (this.checkStatus()), 3000);

        try {
            const response = await api.get(`lobbies/${this.id}`);


            // get opponents
            const opponentList = new PlayerList(response.data);
            var playerIndex = (opponentList.playerList).indexOf(localStorage.getItem('username'))
            opponentList.playerList.splice(playerIndex, 1); // remove main player
            this.setState({opponentList: (opponentList.playerList)});
            localStorage.setItem('opponentList', JSON.stringify(opponentList.playerList));


            // get player's hand
            this.getHand();
            this.fetchData();
            console.log(this.opponentListId);
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
            this.opponentListId = game.opponentListHands;

            this.getOpponentHands();



        }catch(error){
            alert(`Something went wrong during the fetch of the game information data: \n${handleError(error)}`);
        }
    }

    getOpponentHands(){

        if(this.opponentListId){
            var j;
            console.log(this.opponentListId);
            for (j = 0; j< (this.opponentListId.length); j++) {
                if(this.opponentListId[j].slice(0,1)== String(this.userid)){
                    this.opponentListId.splice(j,1);
                }
            }

            console.log(this.opponentListId);
            console.log(this.opponentListId[0]);
            console.log(this.opponentListId[0].split(","));
            var i;
            var opponentListNested = [];
            for (i = 0; i< (this.opponentListId.length); i++) {
                var str = this.opponentListId[i].split(',');
                console.log(this.opponentListId);
                var playerId = str[0];
                var username = str[1];
                var nrOfCards = str[2];
                opponentListNested.push([playerId,username,nrOfCards]);

            }
            this.opponentListId =opponentListNested;
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
    async drawCard() {
        const response = await api.put("game/" + this.id + "/drawCard");

    }

    async sayUno() {
        const requestBody = JSON.stringify({
            playerId: this.userid,
        });

        const response = await api.put("game/" + this.id + "/sayUno", requestBody);

    }

    return() {
      this.props.history.push('/game/mainmenu');
    }
    render() {
      return (
      <Container2>
        <Container>
  
          <TitelContainer>
            <h2>Lets start the game</h2>
          </TitelContainer>
            {!this.opponentListId ? (
                <Spinner />
            ) : (
                (this.opponentListId).map(i => (
                    <div>
                        {i[1]}{i[2]}
                        <img src={require(`../../views/Images/Avatar/${i[0]}.png`).default} alt={"Image not loaded"} />
                        </div>
                ))
            )}
          
          <div style={{ backgroundImage: `url(${UnoTable}) `, backgroundRepeat: 'no-repeat', margin: '140px auto' , width: "107%"}}>

          <div style={{display: 'flex', position: 'absolute', top: '55%', left: '49%'}}>
    
            {!this.currentcolor && !this.currentvalue ?(
                <Spinner/>
                ) : (
                <div className="card">
                    <img src={require(`../../views/Images/CardDesigns/standard/${this.currentcolor}/${this.currentvalue}.png`).default}/>
                </div>
            )
            }
          </div>   

          <ButtonContainer>
          <Button2 
            width="20%" 
            onClick={() => {this.return()}}
          >
            Leave
          </Button2>
        </ButtonContainer>
          <div style={{display: 'flex', position: 'absolute', top: '60%', left: '58.7%', zIndex:'+1'}}>
            <Button4
                disabled={this.currentplayer != this.userid}
                onClick={() =>{
                    this.drawCard();
            }}>
            draw card
            </Button4>
            </div>
              <div style={{display: 'flex', position: 'absolute', top: '60%', left: '70%', zIndex:'+1'}}>
                  <Button4
                      onClick={() =>{
                          this.sayUno();

                      }}>
                      UNO
                  </Button4>
              </div>
              <div style={{display: 'flex', position: 'absolute', top: '55%', left: '58%'}}>
            <img src= {Back}></img>
          </div>
          <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
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
          </div>

      
               
          </div>

 
        </Container>
      </Container2>
      )
    }


}

export default withRouter(Game)
