<template>
<div>
  <b-card bg-variant="info" text-variant="white" header="Info" class="text-center">
    <div class="text-center"> 
      <b-alert v-if="this.msg" show variant="warning"> {{ this.msg }}</b-alert>
      Answer Is : {{ this.data.answer}}
    </div>
    <b-button @click.stop="StartGame" variant="warning">Start A New Game</b-button>
  </b-card>
</div>
</template>


<script>
import router from "../router";
export default {
    name: "ShowResult",
    props: ["data", "msg"],
    methods: {
      StartGame() {
        router.push({ name: "StartGame" });
      }
    }
  };
</script>