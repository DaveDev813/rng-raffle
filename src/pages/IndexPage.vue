<template lang="pug">
q-page.limitPageContent
  h1.text-h5.q-mt-none Primaxis IMS Access
  p.text-body1 Select a client to view bookings, clinics, and languages.
  q-card.q-mt-lg(flat bordered style="max-width: 560px")
    q-card-section
      ClientSelect
</template>

<script setup lang="ts"></script>
