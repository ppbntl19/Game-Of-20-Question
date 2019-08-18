<template>
<div class="container">
<div>
  <b-card title="The Game Of 20 Question" border-variant="success"  align="center">
    <b-card-text>
      Twenty Questions is a spoken parlor game which encourages deductive reasoning and creativity.
      It originated in the United States and was played widely in the 19th century.
      It escalated in popularity during the late 1940s when it became the format for a successful weekly radio quiz program.
      <b-link href="https://en.wikipedia.org/wiki/Twenty_Questions">WikiPedia</b-link>
    </b-card-text>

    <b-card-text>The objective of Twenty Questions is quite simple: guess the person, place or thing in 20 questions or less! This game is a stationary game, and also a good car game .</b-card-text>

    <b-button @click.stop="StartGame" variant="warning">Start A New Game</b-button>
    <b-button  @click.stop="joinGame" variant="success">Join A Game</b-button>
  </b-card>
</div>
</div>

</template>

<script>
  import router from "../router";
  export default {
    name: 'Home',
    data() {
      return {
        game_state: {
          msg: 'Welcome to the Game Of 20 Question'
        }
      };
    },
    methods: {
      StartGame() {
        router.push({ name: "StartGame" });
      },
      joinGame() {
        router.push({ name: "JoinGame" });
      }
    }
  };
</script>
