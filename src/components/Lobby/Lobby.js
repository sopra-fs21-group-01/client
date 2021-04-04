import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import  User  from '../shared/models/User';
import  Lobby  from '../shared/models/Lobby';


const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Userdata = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Data = styled.div`
  font-weight: lighter;
  margin-left: 5px;
  color: #06c4ff;
`;

const DataName = styled.div`
  font-weight: bold;
`;

class ProfilePage extends React.Component {
  constructor() {
    super();
    this.state = {
      lobby: null
    };
  }

  back() {
    this.props.history.push('/login');
    // localStorage.removeItem('id');
  }

  deleteLobby(){
  const address = localStorage.getItem("address");
  const id = address.split("/")[1]
  api.delete('/lobby/'+id)}


  edit(){

    }

  async componentDidMount() {
    try {

    // takes the uri address and extracts the id
    const address = localStorage.getItem("address");
    const id = address.split("/")[1]

    const response = await api.get('/lobby/'+id);


    // Get the returned users and update the state.
     const thisLobby = new Lobby(response.data);

     this.setState({ lobby: thisLobby });

    } catch (error) {
      alert(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
    }
  }

  render() {

    return (
      <Container>
        <h2>Profile Page</h2>
        <p>Click edit to change data:</p>
        {!this.state.lobby ? (
          <Spinner />
        ) : (
          <div>
            <Userdata>


                  <PlayerContainer key={this.state.lobby.name}>
                  <DataName> Lobbyname: </DataName> <Data>{this.state.lobby.name} </Data>
                  </PlayerContainer>

                  <PlayerContainer>
                  <DataName> Host: </DataName> <Data>{this.state.lobby.host} </Data>
                  </PlayerContainer>


             </Userdata>
                <Button
                  width="30%"
                  onClick={() => {
                    this.deleteLobby();
                  }}
                >
                  Delete Lobby
                </Button>
                <span>&nbsp;&nbsp;</span>
            <Button
              width="30%"
              onClick={() => {
                this.back();
              }}
            >
              Back
            </Button>
            <span>&nbsp;&nbsp;</span>


          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(ProfilePage);