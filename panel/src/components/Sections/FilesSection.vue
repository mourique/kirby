<template>

  <section class="k-files-section">

    <header class="k-section-header">
      <k-headline>
        {{ headline }} <abbr v-if="min" :title="$t('section.required')">*</abbr>
      </k-headline>
      <k-button-group v-if="add">
        <k-button icon="upload" @click="upload">{{ $t("add") }}</k-button>
      </k-button-group>
    </header>

    <template v-if="error">
      <k-box theme="negative">
        <k-text size="small">
          <strong>{{ $t("error.section.notLoaded", {name: name}) }}:</strong>
          {{ error }}
        </k-text>
      </k-box>
    </template>

    <template v-else>
      <k-dropzone :disabled="add === false" @drop="drop">
        <k-collection
          v-if="files.length"
          :help="help"
          :items="items(files)"
          :layout="layout"
          :pagination="pagination"
          :sortable="sortable"
          :size="size"
          :data-invalid="isInvalid"
          @sort="sort"
          @paginate="paginate"
          @action="action"
        />
        <template v-else>
          <k-empty
            :layout="layout"
            :data-invalid="isInvalid"
            icon="image"
            @click="if (add) upload()"
          >
            {{ empty || $t('files.empty') }}
          </k-empty>
          <footer class="k-collection-footer">
            <k-text
              v-if="help"
              theme="help"
              class="k-collection-help"
              v-html="help"
            />
          </footer>
        </template>
      </k-dropzone>

      <k-file-rename-dialog ref="rename" @success="update" />
      <k-file-remove-dialog ref="remove" @success="update" />
      <k-upload ref="upload" @success="uploaded" @error="reload" />
    </template>

  </section>
</template>

<script>

export default {
  props: [
    "accept",
    "apiUrl",
    "empty",
    "files",
    "headline",
    "help",
    "layout",
    "link",
    "max",
    "min",
    "pagination",
    "size",
    "sortable",
    "upload"
  ],
  methods: {
    action(file, action) {

      switch (action) {
        case "edit":
          this.$go(file.link);
          break;
        case "download":
          window.open(file.url);
          break;
        case "rename":
          this.$refs.rename.open(file.parent, file.filename);
          break;
        case "replace":
          this.$refs.upload.open({
            url: this.$urls.api + "/" + this.$api.files.url(file.parent, file.filename),
            accept: "." + file.extension + "," + file.mime,
            multiple: false
          });
          break;
        case "remove":
          if (this.data.length <= this.min) {
            const number = this.min > 1 ? "plural" : "singular";
            this.$store.dispatch("notification/error", {
              message: this.$t("error.section.files.min." + number, {
                section: this.headline || this.name,
                min: this.min
              })
            });
            break;
          }

          this.$refs.remove.open(file.parent, file.filename);
          break;
      }

    },
    drop(files) {
      if (this.add === false) {
        return false;
      }

      this.$refs.upload.drop(files, {
        ...this.add,
        url: this.$urls.api + "/" + this.add.api
      });
    },
    items(data) {
      return data.map(file => {
        file.options = ready => {
          this.$api.files
            .options(file.parent, file.filename, "list")
            .then(options => ready(options))
            .catch(error => {
              this.$store.dispatch("notification/error", error);
            });
        };

        file.sortable = this.sortable;
        file.column   = this.column;

        return file;
      });
    },
    replace(file) {
      this.$refs.upload.open({
        url: this.$urls.api + "/" + this.$api.files.url(file.parent, file.filename),
        accept: file.mime,
        multiple: false
      });
    },
    sort(items) {
      if (this.sortable === false) {
        return false;
      }

      items = items.map(item => {
        return item.id;
      });

      this.$api
        .patch(this.apiUrl + "/files/sort", {
          files: items,
          index: this.pagination.offset
        })
        .then(() => {
          this.$store.dispatch("notification/success", ":)");
        })
        .catch(response => {
          this.reload();
          this.$store.dispatch("notification/error", response.message);
        });
    },
    update() {
      this.$events.$emit("model.update");
    },
    upload() {
      if (this.add === false) {
        return false;
      }

      this.$refs.upload.open({
        ...this.add,
        url: this.$urls.api + "/" + this.add.api
      });
    },
    uploaded() {
      this.$events.$emit("file.create");
      this.$events.$emit("model.update");
      this.$store.dispatch("notification/success", ":)");
    }
  }
};
</script>
