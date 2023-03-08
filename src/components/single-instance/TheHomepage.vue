<template>
  <h2>Welcome user</h2>
  <button type="button" @click="logoutUser">Logout</button>
</template>

<script>
import { getAuth } from 'firebase/auth';

export default {
  methods: {
    logoutUser() {
      getAuth().signOut();
    }
  }
};
</script>
