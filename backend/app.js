//Libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const Game = require('./src/models/Game.js');
_ = require("underscore");
//server configuration
const port = process.env.PORT || 8080;

//Connection to DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test")
  .then(() => {
    console.log('Backend Started');
  })
  .catch(err => {
    console.error('Backend error:', err.stack);
    process.exit(1);
  });

const io = require('socket.io')(http);
//On new connecion
io.on('connection', socket => {
  //Client connected
  socket.on('connect', data => {
    console.log(io.sockets);
  });

  //Join room
  socket.on('join', data => {
    console.log(data, "join");
    //Keep refrence of room
    socket.room_id = data;
    socket.join(data);
  });
  //Client disconneted
  socket.on('disconnect', data => {
    console.log(socket.id, "leave");
    socket.leave(data.room_id);
    io.to(data.room_id).emit("GameDisconnected");
  });

  //Create a game
  socket.on('StartGame', game_state => {
    //Check exising user
    Game.findOne({
        username: game_state.data.username,
        game_id: game_state.data.game_id
      },
      (error, game) => {
        //Check if game found
        if (!error && game) {
          //Extend game attribute and save
          _.extend(game, game_state.data);
          //Save updated game
          game.save((error, updated_game) => {
            //Start or can be resumed
            if (!error && updated_game) {
              //Create room
              socket.join(updated_game.game_id);
              //Send update to client
              io.to(game.game_id).emit("StartGame", {
                action_type: game_state.action_type,
                data: updated_game
              });
            }
          });
        } else {
          //create game
          const new_game = new Game(game_state.data);
          //Save
          new_game.save((error, created_game) => {
            //Create/join room
            socket.join(new_game.game_id);
            if (!error && created_game) {
              //Return  game state
              io.to(new_game.game_id).emit("StartGame", {
                action_type: game_state.action_type,
                data: new_game
              });
            } else {
              //Create/join room
              socket.join(new_game.game_id);
              //Return game state with error
              io.to(new_game.game_id).emit("GameError", {
                action_type: "on_error",
                data: {},
                msg: "Something Wroing! Choose a diifrent Game ID or try again later"
              });
            }
          });
        }
      }
    );
  });

  //Join game
  socket.on('JoinGame', game_state => {
    //Check exising Game
    Game.findOneAndUpdate({
      game_id: game_state.data.game_id,
      is_game_active: true,
      guesser: false
    }, game_state.data, {
      new: false,
      upsert: false
    }, (error, game) => {
      if (error || !game) {
        socket.join(game_state.data.game_id);
        io.to(game_state.data.game_id).emit("GameError", {
          action_type: "on_error",
          data: {},
          msg: "Something Wrong! Game Not Found Or Not Active"
        });
      }
      else {
        //Check if game found
        socket.join(game.game_id);
        io.to(game.game_id).emit("JoinGame", {
          action_type: game_state.action_type,
          data: game,
          msg: ""
        });
      }
    });
  });

  //All game action will be handle by this event
  socket.on('GameUpdate', game_state => {
    //Save game state
    Game.findOne({
        game_id: game_state.data.game_id,
        is_game_active: true
      },
      (error, game) => {
        if (error || !game) {
          socket.join(game_state.data.game_id);
          io.to(game_state.data.game_id).emit("GameError", {
            action_type: "game_error",
            data: {},
            msg: "Something Wrong! Game Not Found Or Not Active"
          });
        } else {
          //Extend game attribute and save
          _.extend(game, game_state.data);
          //Check if game found
          game.save((error, game) => {
            //Handle error
            socket.join(game.game_id);
            io.to(game.game_id).emit("GameUpdate", {
              action_type: game_state.action_type,
              data: game,
              msg: ""
            });
          });
        }
      }
    );
  });
});


// App Instance
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Execute App
http.listen(port, () => {
  console.log("App's running on: ", port);
});