<template>
  <section class="k-info-section">
    <k-headline class="k-info-section-headline">{{ headline }}</k-headline>
    <k-box :theme="theme">
      <k-text v-html="text" />
    </k-box>
  </section>
</template>

<script>
export default {
  props: {
    headline: String,
    text: String,
    theme: String
  }
};
</script>

<style lang="scss">
.k-info-section-headline {
  margin-bottom: .5rem;
}
</style>
