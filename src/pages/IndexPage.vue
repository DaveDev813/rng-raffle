<template lang="pug">
q-page.index-page
  aside.side-panel(aria-label="Left image carousel")
    q-carousel.side-carousel(
      v-model="leftSlide"
      animated
      infinite
      :autoplay="5000"
      :arrows="false"
      :navigation="false"
      transition-prev="fade"
      transition-next="fade"
    )
      q-carousel-slide.q-pa-none(
        v-for="(image, index) in leftImages"
        :key="image"
        :name="index"
      )
        img.carousel-image.carousel-image--fill(:src="image" :alt="`Left gallery image ${index + 1}`")

  section.center-panel



  aside.side-panel(aria-label="Right image carousel")
    q-carousel.side-carousel(
      v-model="rightSlide"
      animated
      infinite
      :autoplay="5000"
      :arrows="false"
      :navigation="false"
      transition-prev="fade"
      transition-next="fade"
    )
      q-carousel-slide.q-pa-none(
        v-for="(image, index) in rightImages"
        :key="image"
        :name="index"
      )
        img.carousel-image(:src="image" :alt="`Right gallery image ${index + 1}`")
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leftSlide = ref(0);
const rightSlide = ref(0);

const leftImageModules = import.meta.glob<string>(
  '../assets/images/LeftSide/*.{jpg,jpeg,png,webp,avif,gif,svg}',
  { eager: true, query: '?url', import: 'default' },
);
const rightImageModules = import.meta.glob<string>(
  '../assets/images/RightSide/*.{jpg,jpeg,png,webp,avif,gif,svg}',
  { eager: true, query: '?url', import: 'default' },
);

const leftImages = Object.keys(leftImageModules)
  .sort()
  .map((path) => leftImageModules[path]);
const rightImages = Object.keys(rightImageModules)
  .sort()
  .map((path) => rightImageModules[path]);
</script>

<style scoped lang="scss">
.index-page {
  display: grid;
  grid-template-columns: 27% 46% 27%;
}

.side-panel,
.center-panel {
  min-width: 0;
}

.center-panel {
  width: 100%;
  overflow-wrap: anywhere;
}

.side-carousel {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  background: #111;
}

.carousel-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.carousel-image--fill {
  object-fit: cover;
}
</style>
