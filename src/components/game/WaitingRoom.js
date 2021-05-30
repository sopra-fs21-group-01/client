import React from 'react';
import styled from 'styled-components';
import {BaseContainer} from '../../helpers/layout';
import {api, handleError} from '../../helpers/api';
import {Button2} from '../../views/design/Button2';
import {withRouter} from 'react-router-dom';
import {Spinner} from '../../views/design/Spinner';
import PlayerList from '../shared/models/PlayerList';


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
            gameID: null,
            playerList: null,
            winnerList: null,
        };
    }

    componentDidMount() {
        this.updateInterval = setInterval(() => (this.checkStatus()), 1000);
    }

    async checkStatus() {
        try {


            console.log(this.state.playerList);
            const id = localStorage.getItem("lobbyId")
            const response = await api.get('/lobbies/' + id);
            const opponentList = new PlayerList(response.data);
            this.setState({playerList: (opponentList.playerList)});
            this.setState({winnerList: (opponentList.winnerList)});

            if (response.data == "") {
                localStorage.removeItem("winnerList");
                this.props.history.push('/game/mainmenu')
                alert(`Host closed the Lobby`);

            }
            if (response.data.inGame == true) {
                this.props.history.push('/game/running')
            }
        } catch (error) {
            alert(`Something went wrong when asking if game is started: \n${handleError(error)}`);
            this.props.history.push('/game/mainmenu')
        }
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval)
    }

    returnToMain() {
        localStorage.removeItem("winnerList");
        this.props.history.push('/game/mainmenu');
    }

    render() {

        return (
            <Container2>
                <Container>
                    <TitelContainer>
                        <h2>Waiting for Game to start</h2>
                        <Spinner/>
                    </TitelContainer>
                    <ButtonContainer>
                    </ButtonContainer>
                    <h1>Player(s):</h1>
                    {!this.state.playerList ? (
                        <Spinner/>
                    ) : (
                        (this.state.playerList).map(player => (<li key={player}>{player}</li>))
                    )}
                <ButtonContainer>
                    <Button2
                        width="20%"
                        onClick={() => {
                            this.returnToMain()
                        }}>
                        Return
                    </Button2>
                </ButtonContainer>
                <div>
                <h1>Rankings from last game:</h1>
                <div>
                <ol>
                    {!this.state.winnerList ? (
                        <text>Play a game to receive a ranking!</text>
                        ) : (
                        (this.state.winnerList).map(player => (<li key={player}>{player}</li>))
                    )}
                </ol>
                </div>
                </div>
                </Container>
            </Container2>
        )
    }
}

export default withRouter(WaitingRoom);
