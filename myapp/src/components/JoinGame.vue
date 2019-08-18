<template>
  <div class="container">
    <div>
      <b-card title="The Game Of 20 Question" sub-title="Join Game" border-variant="success" align="center">
        <b-alert v-if="game_state.msg" show variant="warning"> {{ game_state.msg }}</b-alert>
        <b-form  @submit="JoinGame">
          <b-form-group
            id="input-group-game_id"
            label="Enter Game Id:"
            label-for="game_id"
            description="Please enter a valid game id to join exising or create a mew game."
          >
            <b-form-input
              id="game_id"
              v-model="game_state.data.game_id"
              type="text"
              required
              placeholder="Enter Game Id"
            ></b-form-input>
          </b-form-group>
          <div>
            <b-button type="submit" variant="primary"> Enter </b-button>
          </div>
        </b-form>
      </b-card>
    </div>
  </div>
</template>

<script>
import router from "../router";
export default {
  name: "JoinGame",
  data() {
    return {
      game_state: {
        msg: "",
        data: {
          game_id: '',
          guesser: true
        },
        action_type: ''
      }
    };
  },
  sockets: {
    connect() {
      console.log('connected to chat server');
    },
    GameUpdate(response) {
      if (response.action_type == "on_join") {
        //Set game guesser localstate
        localStorage.guesser = true;
        //Save game state in local stoarge
        localStorage.game_id = this.game_state.data.game_id;
        router.push({
          name: "Game",
          component: "Game"
        });
      }
    },
    GameError(response) {
      localStorage.guesser = false;
      this.game_state.msg = response.msg;
    }
  },
  methods: {
    JoinGame(evt) {
      evt.preventDefault();
      //Move to next page
      this.game_state.action_type = "on_join";
      this.$socket.emit('GameUpdate', this.game_state);
    }
  }
};
</script>