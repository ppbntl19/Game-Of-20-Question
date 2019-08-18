<template>
  <div class="container">
    <div>
      <b-card title="The Game Of 20 Question" border-variant="success"  align="center">
        <component :is="theComponent" v-bind="game_state"></component>
        <hr>
        <b-card-group deck>
          <b-card header="Question History" bg-variant="success" text-variant="white" class="text-center">
            <b-list-group  v-for="question in game_state.data.questions">
              <b-list-group-item href="#">  {{ question.Q }} -  {{ question.A }} </b-list-group-item>
            </b-list-group>
          </b-card>

          <b-card header="Guesses History" bg-variant="danger" text-variant="white"  class="text-center">
            <b-list-group  v-for="guess in game_state.data.guesses">
              <b-list-group-item href="#"> {{ guess.G }} - {{ guess.A }} </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-card-group>
      </b-card>
    </div>
  </div>
</template>

<script>
import router from "../router";
import Waiting from "./Waiting";
import AskQuestion from "./AskQuestion";
import Response from "./Response";
import ShowResult from "./ShowResult";
export default {
  name: "Game",
  data() {
    return {
      is_guesser: localStorage.guesser == 'true' ? true : false,
      theComponent: localStorage.guesser == 'true' ? AskQuestion : Waiting,
      game_state: {
        data: {},
        msg: "waiting for opponent",
        action_type: ''
      }
    };
  },
  created: function() {
    //Get updated game state
    if (localStorage.game_id) {
      this.$socket.emit('GameUpdate', {
        "data": {
          "game_id": localStorage.game_id
        }
      });
    } else {
      router.push({
        name: "home"
      });
    }
  },
  sockets: {
    connect() {
      console.log('connected to chat server');
    },
    GameUpdate(response) {
      console.log(response, this.game_state)
      //Update state
      this.game_state.data = response.data;
      //Get New Question /Guess if avaiable
      if (response.data.questions && response.data.questions.length && response.data.questions[response.data.questions.length - 1]) {
        this.game_state.data.new_question = response.data.questions[response.data.questions.length - 1]['A'] ? '' : response.data.questions[response.data.questions.length - 1]['Q'];
      }
      //Get New Question /Guess if avaiable
      if (response.data.guesses.length && response.data.guesses[response.data.guesses.length - 1]) {
        //Get Last guess
        this.game_state.data.new_guess = response.data.guesses[response.data.guesses.length - 1]['A'] ? '' : response.data.guesses[response.data.guesses.length - 1]['G'];
      }
      //Check if game alredy finished  show result
      if (!this.game_state.data.is_game_active && response.action_type != "on_finish") {
        //Show a message
        this.game_state.msg = "This game is alredy finished";
        this.theComponent = ShowResult;
        return;
      }

      // Check if question is over
      if (response.data.questions && response.data.questions.length == 20) {
        if (this.is_guesser) {
          this.game_state.msg = "You lost this game.";
        } else {
          this.game_state.msg = "You are the winner";
        }
        this.theComponent = ShowResult;
        //Update game state
        this.game_state.action_type = "on_finish";
        this.game_state.data.is_game_active = false;
        this.$socket.emit('GameUpdate', this.game_state);
        //return
        return
      }

      //Update game state
      if (response.action_type == "on_join") {
        this.game_state.msg = "Great! Opponent joined.waiting for first question";
        this.theComponent = this.is_guesser ? AskQuestion : Waiting;
      } else
        //Update game state
        if (response.action_type == "on_question") {
          this.game_state.msg = "Waiting for answer...";
          this.theComponent = this.is_guesser ? Waiting : Response;
        } else
          //Update game state
          if (response.action_type == "on_guess") {
            if (this.game_state.data.answer == this.game_state.data.new_guess) {
              if (this.is_guesser) {
                this.game_state.msg = "You are the winner.";
              } else {
                this.game_state.msg = "You lost this game.";
                //Update game state
                this.game_state.action_type = "on_finish";
                this.game_state.data.is_game_active = false;
                this.$socket.emit('GameUpdate', this.game_state);
              }
              this.theComponent = ShowResult;
            } else {
              this.game_state.msg = "Wrong Guess! Try more";
              this.theComponent = this.is_guesser ? AskQuestion : Waiting;
            }
          } else
            //On response  render
            if (response.action_type == "on_response") {
              this.game_state.msg = "Waiting for next question";
              this.theComponent = this.is_guesser ? AskQuestion : Waiting;
            }
    }
  }
};
</script>