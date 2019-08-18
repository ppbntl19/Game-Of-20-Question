var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
var Game = new Schema({
  username: {
    type: String,
    unique: true
  },
  game_id: {
    type: String,
    unique: true
  },
  answer: {
    type: String
  },
  guesses: [{
    G: String,
    A: String
  }],
  hinter: {
    type: Boolean
  },
  guesser: {
    type: Boolean
  },
  is_game_active: {
    type: Boolean
  },
  questions: [{
    Q: String,
    A: String
  }]

}, {
  collection: 'Game'
});

module.exports = mongoose.model('Game', Game);