# UNO card game

## Introduction

In this project we wanted to replicate the UNO card game. UNO is a popular family game, who can be played from a young to an old age. It consists of 108 cards with cards of 4 different colors from the number 0 to 9 and some special cards which are explained as follows:
- **Reverse card**: This card reverses direction of play. Play to the left now passes to the right, and vice versa.
- **Skip card**: The next person in line to play after this card is played loses his/her turn and is "skipped".
- **Wild card**: When you play this card, you may change the color being played to any color (including the current color) to continue play. You may play a Wild card even if you have another playable card in hand.
- **Wild four card**: This card allows you to call the next color played and requires the next player to pick 4 cards from the DRAW pile.
### Game play
The Host of the Lobby first has to decide which gamemode is played and based upon that, each player becomes the selected amount of cards in the beginning of the game.
Now the player who begins has to look at the discard pile if there is for example a Green 7, you must play a Green card or any color with the number 7. Or, you may play any Wild card or a Wild Draw 4 card. If you don't have anything that matches, you must pick a card from the DRAW pile and the next player's turn begins. In case that you are playing your second last card, you have to push the UNO button until your next turn, if you don't press the button you receive a extra card. As soon as you have put down all cards xou win the game. 

## Technologies
For this Project we used the client/server archictecture. And in order to connect both components we used the standardized REST interface.



## High-level components
Our main components from the projects are the Game, Chat, User and Lobby components.
- **Game**: Is our main component where the whole game logic is implented. There exists a game component in the [client](https://github.com/sopra-fs21-group-01/client/blob/master/src/components/game/Game.js)
 where the game is displayed and from which RESTrequests are sent to the game component in the [server](https://github.com/sopra-fs21-group-01/server/blob/master/src/main/java/ch/uzh/ifi/hase/soprafs21/controller/GameController.java)  where the game logic is implemented. 
- **Chat**: Important component to enhance the user experience of the game. It is also the component with the integrated external API. On Client side chat messages are shown and in the backend the messages are saved in the database
- **User**: This component is needed to save and identify the players so that lobbies have the right amount of players and e.g. to display the name of the players during the game. 
- **Lobby**: This component defines how players can join lobbies and which gamemode is selected. It is a crucial preprocessing part for the game component.

## Launch & Deployment
In case someone wants to distribute to this project there are different steps to do for the server and client
### Server
In order to run the server someone needs to have installed Gradle and needs to execute the gradlew.bat file 
#### Build

```bash
./gradlew build
```

#### Run

```bash
./gradlew bootRun
```

#### Test

```bash
./gradlew test
```
#### Development Mode

You can start the backend in development mode, this will automatically trigger a new build and reload the application
once the content of a file has been changed and you save the file.

Start two terminal windows and run:

`./gradlew build --continuous`

and in the other one:

`./gradlew bootRun`

If you want to avoid running all tests with every change, use the following command instead:

`./gradlew build --continuous -xtest`

#### Testing
To run the tests for the backend you can excute the tests which are allocated in the following folder: [Tests](https://github.com/sopra-fs21-group-01/server/tree/master/src/test/java/ch/uzh/ifi/hase/soprafs21)

#### External Dependencies
At the moment the single dependencie which is installed is the external API named: [Funtranslation](https://funtranslations.com/api/). 
**Information**: This API is limited to 5 calls per hour and 60 calls in total per day because of the free usage, in case this game gets released we strongly recommend to access the paid version to avoid the restriction.

#### Release
When you want to release you just have to push you code to github which is automatically connected with [HEROKU](https://dashboard.heroku.com/apps/sopra-fs21-group-01-server) where it gets deployed.

### Client

#### Prerequisites and Installation

For your local development environment you'll need Node.js >= 8.10. You can download it [here](https://nodejs.org). All other dependencies including React get installed with:

#### `npm install`

This has to be done before starting the application for the first time (only once).

#### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console (use Google Chrome!).

#### `npm run test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into an 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

#### `npm run build`
#### Release
When you want to release you just have to push you code to github which is automatically connected with [HEROKU](https://sopra-fs21-group-01-client.herokuapp.com/register) where it gets deployed.

## Illustrations
The workflow of our applications is as follows:
1. Register page: Here you can register yourself by choosing a username, email and password ![Screenshot](/src/views/Images/Screenshots/1.PNG)
2. Login page: After the registration you have to login in with your credentials
3. Main page: Here you can either create a lobby or join one and if you want you can change your credentials. ![Screenshot](/src/views/Images/Screenshots/3.PNG)
4. Create Lobby page: Here you can select the gamemode and start the game as soon as the players have joined the lobby ![Screenshot](/src/views/Images/Screenshots/5.PNG)
5. Game page: This is the main game screen where you play the game, you can chat with each other and check everyone's game status  ![Screenshot](/src/views/Images/Screenshots/7.PNG)
6. Lobby page: After finishing a game a scoreboard gets displayed and there is the option to restart a new game with a different gamemode ![Screenshot](/src/views/Images/Screenshots/10.PNG)






## Roadmap
Some features that could be integrated is to implement a music player which contains files either from a local storage or e.g. from spotify. Another one could be to create more complicated gamemodes as there exists many different rules that could be applied. Last most challenging feature to implement could be to integrate a voice chat, which may cause to extend the current architecture.

## Authors and Acknowledgement
Last we want to thank all the Authors who contributed to this great project and also our TA Jan Willi who helped us in situation where we needed help.
- Claudius Knecht (claudius.knecht@uzh.ch)
- Dean Heizmann (dean.heizmann@uzh.ch)
- Tony Bang (tony.bang@uzh.ch)
- Marco Heiniger (marco.heiniger@uzh.ch)
## License
This Project is licensed under the terms of the [MIT](https://choosealicense.com/licenses/mit/) license and is available for free
