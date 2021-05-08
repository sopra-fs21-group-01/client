import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button4 } from '../../views/design/Button4';
import { ReturnCircle } from '../../views/design/ReturnCircle';
import { UnoButton } from '../../views/design/UnoButton';
import '../../views/design/Card.css';
import { withRouter } from 'react-router-dom';
import { Spinner } from '../../views/design/Spinner';
import UnoTable from '../../views/Images/UnoTable.png';
import PlayerList from '../shared/models/PlayerList';
import Hand from '../shared/models/Hand';
import GameEntity from '../shared/models/GameEntity';
import CurrentPlayer from '../shared/models/CurrentPlayer';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

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
  position: relative;
  height: 100vh;
  width: 100%;
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

const TitelContainer2 = styled.div`
  font-family: "Monospace", sans-serif;
  color: black;
  font-weight: bold;
  font-size: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  position: relative;
  cursor: pointer;
  left: -50%;
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
            currentplayerUN: null,
            currentcolor: null,
            currentvalue: null,
            opponentListId:null,
            disabled : false,
            wishedColor : null,  
            theme: null,

            // TODO eventuell noch gamedirection für frontend per getrequest holen
        };
        this.userid = localStorage.getItem("id");
        this.id = localStorage.getItem("lobbyId");
        this.theme = "standard";
    }
    

      async componentDidMount(){
        this.updateInterval = setInterval(()=> (this.checkStatus()), 300);

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
  
            const response2 =  await api.get("users/"+this.currentplayer+"");
            const currentPlayer = new CurrentPlayer(response2.data);
            this.currentplayerUN = currentPlayer.username;

        }catch(error){
            alert(`Something went wrong during the fetch of the game information data: \n${handleError(error)}`);
        }
        //sets the draw card button to enabled
        if(this.currentplayer == this.userid){
            this.setState({disabled: false},
            );
        }
    }


    // Also checks if an opponent won
    async getOpponentHands(){

        if(this.opponentListId){
            var j;
            for (j = 0; j< (this.opponentListId.length); j++) {
                if(this.opponentListId[j].slice(0,1)== String(this.userid)){
                    this.opponentListId.splice(j,1);
                }
            }
            var i;
            var opponentListNested = [];
            for (i = 0; i< (this.opponentListId.length); i++) {
                var str = this.opponentListId[i].split(',');
                var playerId = str[0];
                var username = str[1];
                var nrOfCards = str[2];
                opponentListNested.push([playerId,username,nrOfCards]);



                if (nrOfCards == 0) {
                  alert(username+ " finished the game!");

                  // If its only two players left, than here it should either push ti lobby or waiting room

                        if (localStorage.getItem('username') == this.host){
                        try {
                              await api.put(`lobbies/${this.id}/resets`);
                         } catch(error){
                         alert(`Something went wrong when trying to reset the lobby: \n${handleError(error)}`);
                           }

                        this.props.history.push('/game/lobby');}

                       else { this.props.history.push('/game/waitingRoom');}

                  }
            }
            this.opponentListId =opponentListNested;
        }

    }

    async deleteGame(){
        try{
            await api.delete("game/"+this.id+"/deletion");
        }catch(error){
            alert(`Something went wrong during the deletion of the game: \n${handleError(error)}`);
        }
    }
    async playCard(card){
        if(this.currentplayer == this.userid) {
            var str = card.split('/');
            var color = str[0];
            var value = str[1];
            if (color == "Wild"){
                this.submit(card);

            }

            else{
                const requestBody = JSON.stringify({
                    playerId: this.userid,
                    color: color,
                    value: value,
                    wishedColor : null,
                });
                const response = await api.put("game/" + this.id + "/playerTurn", requestBody);
                this.getHand();
                this.fetchData();
            }

        }
    }


    async playWildCard(card, wishedColor){

            if(this.currentplayer == this.userid) {

                var str = card.split('/');
                var color = str[0];
                var value = str[1];


                const requestBody = JSON.stringify({
                    playerId: this.userid,
                    color: color,
                    value: value,
                    wishedColor: wishedColor,
                });

                const response = await api.put("game/" + this.id + "/playerTurn", requestBody);
                this.getHand();
                this.fetchData();

            }



    }
submit(card){{
            confirmAlert({
                title: 'Wish a color!',
                buttons: [
                    {
                        label: 'Blue',
                        onClick: () => this.playWildCard(card,"Blue")
                    },
                    {
                        label: 'Red',
                        onClick: () => this.playWildCard(card,"Red")
                    },
                    {
                        label: 'Yellow',
                        onClick: () => this.playWildCard(card,"Yellow")
                    },
                    {
                        label: 'Green',
                        onClick: () => this.playWildCard(card,"Green")
                    }
                ]
            })


        };

    }

    // Also checks if the player won
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
      if (this.playerHand.length == 0) {


      // this part has to be tried / caught
      // probably export this code to another function because this gets overloaded
      // -> could also move the whole if statement in the first try/catch block

        alert("Congratulations, you won!");

        console.log(" the host is" + this.host);
        console.log(localStorage.getItem('username')== this.host);


             // set the isInGame boolean of the Lobby to FALSE!
             if (localStorage.getItem('username')== this.host){
             try {
                   await api.put(`lobbies/${this.id}/resets`);
                   } catch(error){
                     alert(`Something went wrong when trying to reset the lobby: \n${handleError(error)}`);
                 }

             this.props.history.push('/game/lobby');
             this.deleteGame();}

              else {this.props.history.push('/game/waitingRoom');
              this.deleteGame();}

      // implement here, that you are removed from the playerList in the Backend
      // -> new PUT request, takes player ID and game ID

      // If there are only two players, don't do the PUT request, instead push both to the lobby and delete the game

      }
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
 
    }

    async drawCard() {
        if (this.state.disabled) {
            return;
        }

            this.setState({disabled: true});
            const response = await api.put("game/" + this.id + "/drawCard");



    }

    async sayUno() {
        const requestBody = JSON.stringify({
            playerId: this.userid,
        });

        const response = await api.put("game/" + this.id + "/sayUno", requestBody);

    }
    changeTheme() {
      if (this.theme == "standard") {
        this.theme = "dark";
      } else {
        this.theme = "standard";
      }
    }

    returnToMain() {
      this.props.history.push('/game/mainmenu');
    }
    render() {
      return (
      <Container2>
        <Container>

          <TitelContainer>
            <h2>Good Luck & Have Fun!</h2>
          </TitelContainer>
          <TitelContainer2>
              <h1>It's {this.currentplayerUN}'s turn!</h1>
          </TitelContainer2>

          <div style={{display: 'flex', position: 'relative', top: '-162px', left: '-30%'}}>
          <ReturnCircle  
            width="10%" 
            onClick={() => {this.returnToMain()}}
          >
            Leave
          </ReturnCircle>

          </div>
  
          <div style={{ backgroundImage: `url(${UnoTable}) `, backgroundRepeat: 'no-repeat', margin: '90px auto' , width: "100%"}}>

          <div style={{display: 'flex', position: 'relative', top: '160px', left: '42%'}}>
    
            {!this.currentcolor && !this.currentvalue ?(
                <Spinner/>
                ) : (
                <div className="card">
                    <img src={require(`../../views/Images/CardDesigns/${this.theme}/${this.currentcolor}/${this.currentvalue}.png`).default}/>
                </div>
            )
            }
          </div>   
          <div style={{display: 'flex', position: 'relative', top: '180px', left: '72%', zIndex:'+1'}}>
            <Button4
                disabled={this.currentplayer != this.userid || this.state.disabled}
                onClick={() =>{
                    this.drawCard();
                    this.setState({disabled: true});

                }}>
            draw card
            </Button4>
            </div>
              <div style={{display: 'flex', position: 'relative', top: '30px', left: '15%', zIndex:'+1'}}>
                  <UnoButton
                      width = "100%"
                      onClick={() =>{
                          this.sayUno();

                      }}>
                      UNO
                  </UnoButton>
              </div>
              <div style={{display: 'flex', position: 'relative', top: '-100px', left: '70%'}}>
            <img src= {require(`../../views/Images/CardDesigns/${this.theme}/Back.png`).default}></img>
          </div>
          <div style={{display: 'flex', position: 'relative', top: '-550px', left: '10%'}}>
            {!this.opponentListId ? (
                <Spinner />
            ) : (
                (this.opponentListId).map(i => (
                    <div>
                        <div style={{width: '200px', height: '60px'}}>
                        <img src={require(`../../views/Images/Avatar/${i[0]%14}.png`).default} style={{height: '80px', width: '80px'}} alt={"Image not loaded"}/>
                        </div>
                        <br/>
                        {i[1]} <br/>  Cards: {i[2]}
            
                    </div>
                ))
            )}
          </div>
          <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '10vh'}}>
            <section className="content card">
              {!this.state.convertedHand ? (
                <Spinner />
                ) : (
                  (this.state.convertedHand).map(i => (
                      <div className="card-hghlght card">
                      <img src={require(`../../views/Images/CardDesigns/${this.theme}/${i}.png`).default} onClick={async () => this.playCard(i)} alt={"Image not loaded"} />
                      </div>
                  ))
              )}

            </section>
          </div>  
          </div>

          <div style={{display: 'flex', position: 'relative', top: '-15px', left: '43%', zIndex:'+1'}}>
                  <UnoButton
                      width = "100%"
                      onClick={() =>{
                          this.changeTheme();

                      }}>
                      Change Theme
                  </UnoButton>
              </div>

 
        </Container>
      </Container2>
      )
    }


}

export default withRouter(Game)
