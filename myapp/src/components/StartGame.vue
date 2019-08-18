<template>
  <div class="container">
    <div>
      <b-card title="The Game Of 20 Question" sub-title="Create Game" border-variant="success"  align="center">
        <b-alert v-if="game_state.msg" show variant="warning"> {{ game_state.msg }}</b-alert>
        <b-form @submit="StartGame">
          <label for="username">Username</label>
          <div>
            <b-input id="username" type="text" v-model.trim="game_state.data.username" required autofocus />
          </div>
          <div>
            <label for="game_id">Game ID</label>
            <div>
              <b-input id="game_id" type="text" v-model.trim="game_state.data.game_id" required />
            </div>
          </div>
          <div>
            <label for="answer">Type the your mystery word</label>
            <div>
              <b-input id="answer" type="text" v-model.trim="game_state.data.answer" required />
            </div>
          </div>
          <div>
            <b-button class="mt-1" type="submit" variant="primary">Enter</b-button>
          </div>
        </b-form>
      </b-card>
    </div>
  </div>
</template>

<script>
import router from "../router";
export default {
  name: "StartGame",
  data() {
    return {
      game_state: {
        data: {
          username: '',
          game_id: '',
          answer: '',
          is_game_active: true,
          hinter: true
        },
        msg: '',
        action_type: ''
      }
    };
  },
  sockets: {
    connect() {
      console.log('connected to chat server');
    },
    StartGame(response) {
      if (response.action_type == "on_start") {
        //Save Game ID
        localStorage.game_id = this.game_state.data.game_id;
        //Set game owner localstate
        router.push({
          name: "Game"
        });
      }
    },
    GameError(response) {
      this.game_state.msg = response.msg;
    }
  },
  methods: {
    StartGame(evt) {
      evt.preventDefault();
      //Move to next page
      this.game_state.action_type = "on_start";
      this.$socket.emit('StartGame', this.game_state);
    }
  }
};
</script>