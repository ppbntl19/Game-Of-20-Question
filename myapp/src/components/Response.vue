<template>
  <div>
    <b-card title="New Question" bg-variant="info" text-variant="white"  class="text-center">
      <b-card-text> {{ this.data.new_question }} </b-card-text>
      <b-button @click.stop="GameUpdate" data-value="No" variant="warning">No</b-button>
      <b-button @click.stop="GameUpdate" data-value="Yes" variant="success">Yes</b-button>
    </b-card>
  </div>
</template>

<script>
//v-if="this.data.new_question" 
export default {
  name: "Response",
  props: ["data", "msg"],
  data() {
    return {
      game_state: {
        data: {},
        msg: '',
        action_type: ''
      }
    };
  },
  methods: {
    GameUpdate(evt) {
      console.log(evt, evt.target.dataset.value);
      //Update
      evt.preventDefault();
      //Updaate state
      this.game_state.data = this.data;
      //Set action type
      this.game_state.action_type = "on_response";
      //Set response
      let ans = event.target.dataset.value;
      //Set response
      if (this.game_state.data.new_question) {
        let new_question = this.game_state.data.new_question;
        this.game_state.data.questions[this.game_state.data.questions.length - 1] = {
          "Q": new_question,
          "A": ans
        };
        this.$socket.emit('GameUpdate', this.game_state);
      }
    }
  }
};
</script>
