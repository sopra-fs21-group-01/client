import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { Button3 } from '../../views/design/Button3';
import { withRouter } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

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
   
  async closeLobby() {
  try {await api.delete("/lobbies/"+localStorage.getItem('lobbyID'))}
  catch (error) {
            alert(`Something went wrong during lobby deleting: \n${handleError(error)}`);
          }
    this.props.history.push('/game');
    }

  invite() {
    // Create invitation code
    }

  render() {
    return (
    <Container2>
      <Container>
        <TitelContainer>
          <h2>Lobby</h2>
        </TitelContainer>
          <div>
            <ButtonContainer>
              <Button
              width="100%"
              onClick={() => {
                this.invite();
              }}
              >
              Invite Players
              </Button>
            </ButtonContainer>

            <Dropdown>

                <Dropdown.Toggle variant="success" id="dropdown-basic">
                Game Mode
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Standard</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Special 1</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Special 2</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <ButtonContainer>
              <Button3
              width="100%"
              onClick={() => {
                this.create();
              }}
              >
              Start Game
              </Button3>
            </ButtonContainer>

            <Button2
              width="80%"
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