<template lang="pug">
#app
  router-view
</template>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Customize Bulma


// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

// Custom Definitions
body {
  min-height: 100vh;
  background: url('assets/seamless_paper_texture.png');
  background-repeat: repeat;
}

#app {
}

.container-custom {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
}

.fullwidth-button {
  width: 100%;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
}
</style>
