<template>
  <p>State: {{ connected }}</p>
</template>

<script>
import { state } from "../helper/socket";

export default {
  name: "ConnectionState",

  computed: {
    connected() {
      return state.connected;
    },
  },
};
</script>
