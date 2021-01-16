<template lang="pug">
.img-container
  .bg-container(:style="{ 'background-image': `url('${src}')` }" :class="containerClass")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class ContainImageContainer extends Vue {
  @Prop() private src!: string;
  @Prop({ default: "contain" }) private sizing!: "contain" | "cover";

  get containerClass() {
    return {
      contain: this.sizing === "contain",
      cover: this.sizing === "cover"
    };
  }
}
</script>

<style lang="scss" scoped>
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-bottom: 8px;

  .bg-container {
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    &.contain {
      background-size: contain;
    }
    &.cover {
      background-size: cover;
    }
  }
}
</style>
