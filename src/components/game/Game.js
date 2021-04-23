import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import GameEntity from '../shared/models/GameEntity';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { Link } from "react-router-dom";

class Game extends React.Component{
    /** players;
    constructor() {
        super();
        this.state = {
            players: null,
            id: localStorage.getItem("LobbyID"),
            gamemode: null,
            host: null,
            cardStack: null,
            // TODO eventuell noch gamedirection für frontend per getrequest holen

        }
    }

    async fetchData(){
        try{
            const response = await api.get("game"+id);
            const game = new GameEntity(response.data);
            this.players = game.playerList;
            this.gamemode = game.gamemode;
            this.host = game.host;
            this.cardStack = game.cardStack;

        }catch{error}{
            alert(`Something went wrong during the fetch of the game information data: \n${handleError(error)}`);
        }
    }

    async deleteGame(){
        try{
            await api.delete("game/"+id+"deletion")
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
        const response = await api.put("/game/"+id+"playerTurn", requestBody);
    }
    */
}

export default withRouter(Game)
