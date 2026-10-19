<template lang="pug">
q-page.limitPageContent
  div.text-center.text-secondary.absolute-center(style="top: 35%;")
    q-icon(name="engineering", size="100px")
    h2.text-bold Page under construction
    q-btn(
      color="accent",
      label="Go to Home",
      @click="$router.push('/')"
    )
</template>

<script setup></script>

<style lang="scss" scoped></style>
