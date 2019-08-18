<template>
<div>
  <b-card title="Ask Your New Question" bg-variant="info" text-variant="white" class="text-center">
    <b-form data-type="question" @submit="GameUpdate">
      <b-form-group id="input-group-new_question" label="Ask question:" label-for="new_question" description="Please enter your question or guess">
        <b-form-input id="new_question" v-model="game_state.new_question" type="text" required placeholder="Is it belong to forest?"></b-form-input>
      </b-form-group>
      <div>
        <b-button type="submit" variant="primary"> Ask Now </b-button>
      </div>
    </b-form>
  </b-card>

  OR
  <hr>

  <b-card title="Guess ?" bg-variant="info" text-variant="white" class="text-center">
    <b-form data-type="guess" @submit="GameUpdate">
      <b-form-group id="input-group-new_guess" label="Any Guess" label-for="new_guess" description="Guess it now ?">
        <b-form-input id="new_guess" v-model="game_state.new_guess" type="text" required placeholder="Lion"></b-form-input>
      </b-form-group>
      <div>
        <b-button type="submit" variant="primary"> Guess It Now </b-button>
      </div>
    </b-form>
  </b-card>
</div>
</template>


<script>
export default {
  name: "AskQuestion",
  props: ["data", "msg"],
  data() {
    return {
      game_state: {
        data: {},
        new_guess: '',
        new_question: '',
        msg: '',
        action_type: ''
      }
    };
  },
  methods: {
    GameUpdate(evt) {
      //Update game state
      evt.preventDefault();
      this.game_state.data = this.data;
      //EMit event
      if (evt.target.dataset.type == "question") {
        this.game_state.action_type = "on_question";
        this.game_state.data.questions.push({
          "Q": this.game_state.new_question,
          "A": ''
        });
        this.$socket.emit('GameUpdate', this.game_state);
      } else if (this.game_state.new_guess) {
        this.game_state.action_type = "on_guess";
        this.game_state.data.guesses.push({
          "G": this.game_state.new_guess,
          "A": ''
        });
        this.$socket.emit('GameUpdate', this.game_state);
      }
    }
  }
};
</script>
