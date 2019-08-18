<template>
<div>
  <b-card bg-variant="info" text-variant="white" header="Info" class="text-center">
    <div class="text-center">
      <b-button variant="primary" class="text-center" disabled>
        <b-spinner small label="Text Centered" type="grow"></b-spinner>
        {{ this.msg }}
      </b-button>
    </div>
  </b-card>
</div>
</template>


<script>
  export default {
    name: "Waiting",
    props: ["data", "msg"]
  };
</script>