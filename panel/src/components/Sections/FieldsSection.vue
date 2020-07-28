<template>
  <section v-if="!isLoading" class="k-fields-section">
    <template v-if="issue">
      <k-headline class="k-fields-issue-headline">Error</k-headline>
      <k-box :text="issue.message" theme="negative" />
    </template>
    <k-form
      :fields="fields"
      :validate="true"
      :value="values"
      :disabled="$store.state.content.status.lock !== null"
      @input="input"
      @submit="onSubmit"
    />
  </section>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    fields: Object,
  },
  computed: {
    values() {
      return this.$store.getters["content/values"]();
    }
  },
  methods: {
    input(values, field, fieldName) {
      this.$store.dispatch("content/update", [
        fieldName,
        values[fieldName]
      ]);
    },
    onSubmit($event) {
      this.$events.$emit("keydown.cmd.s", $event);
    }
  }
};
</script>

<style lang="scss">
.k-fields-issue-headline {
  margin-bottom: 0.5rem;
}
.k-fields-section input[type="submit"] {
  display: none;
}

[data-locked] .k-fields-section {
  opacity: .2;
  pointer-events: none;
}
</style>
