<template>
  <section class="k-pages-section">

    <header class="k-section-header">
      <k-headline :link="link">
        {{ headline }} <abbr v-if="min" :title="$t('section.required')">*</abbr>
      </k-headline>

      <k-button-group v-if="add">
        <k-button icon="add" @click="create">{{ $t("add") }}</k-button>
      </k-button-group>
    </header>

    <template>
      <k-collection
        v-if="pages.length"
        :layout="layout"
        :help="help"
        :items="items(pages)"
        :pagination="pagination"
        :sortable="sortable"
        :size="size"
        :data-invalid="isInvalid"
        @change="sort"
        @paginate="paginate"
        @action="action"
      />

      <template v-else>
        <k-empty
          :layout="layout"
          :data-invalid="isInvalid"
          icon="page"
          @click="create"
        >
          {{ empty || $t('pages.empty') }}
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

      <k-page-create-dialog ref="create" />
      <k-page-duplicate-dialog ref="duplicate" />
      <k-page-rename-dialog ref="rename" @success="update" />
      <k-page-url-dialog ref="url" @success="update" />
      <k-page-status-dialog ref="status" @success="update" />
      <k-page-template-dialog ref="template" @success="update" />
      <k-page-remove-dialog ref="remove" @success="update" />
    </template>

  </section>

</template>

<script>
export default {
  props: [
    "empty",
    "headline",
    "help",
    "layout",
    "link",
    "max",
    "min",
    "name",
    "pages",
    "pagination",
    "parent",
    "size",
    "sortable",
  ],
  methods: {
    create() {
      if (this.add) {
        this.$refs.create.open(
          this.link || this.parent,
          this.parent + "/children/blueprints",
          this.name
        );
      }
    },
    action(page, action) {

      switch (action) {
        case "duplicate": {
          this.$refs.duplicate.open(page.id);
          break;
        }
        case "preview": {
          let preview = window.open("", "_blank");
          preview.document.write = "...";

          this.$api.pages
            .preview(page.id)
            .then(url => {
              preview.location.href = url;
            })
            .catch(error => {
              this.$store.dispatch("notification/error", error);
            });

          break;
        }
        case "rename": {
          this.$refs.rename.open(page.id);
          break;
        }
        case "url": {
          this.$refs.url.open(page.id);
          break;
        }
        case "status": {
          this.$refs.status.open(page.id);
          break;
        }
        case "template": {
          this.$refs.template.open(page.id);
          break;
        }
        case "remove": {
          if (this.data.length <= this.min) {
            const number = this.min > 1 ? "plural" : "singular";
            this.$store.dispatch("notification/error", {
              message: this.$t("error.section.pages.min." + number, {
                section: this.headline || this.name,
                min: this.min
              })
            });
            break;
          }

          this.$refs.remove.open(page.id);
          break;
        }
        default: {
          throw new Error("Invalid action");
        }
      }

    },
    items(data) {
      return data.map(page => {
        const isEnabled = page.permissions.changeStatus !== false;

        page.flag = {
          class: "k-status-flag k-status-flag-" + page.status,
          tooltip: isEnabled ? this.$t("page.status") : `${this.$t("page.status")} (${this.$t("disabled")})`,
          icon: isEnabled ? "circle" : "protected",
          disabled: !isEnabled,
          click: () => {
            this.action(page, "status");
          }
        };

        page.options = ready => {
          this.$api.pages
            .options(page.id, "list")
            .then(options => ready(options))
            .catch(error => {
              this.$store.dispatch("notification/error", error);
            });
        };

        page.sortable = page.permissions.sort && this.sortable;
        page.column   = this.column;

        return page;
      });
    },
    sort(event) {
      let type = null;

      if (event.added) {
        type = "added";
      }

      if (event.moved) {
        type = "moved";
      }

      if (type) {
        const element = event[type].element;
        const position = event[type].newIndex + 1 + this.pagination.offset;

        this.$api.pages
          .status(element.id, "listed", position)
          .then(() => {
            this.$store.dispatch("notification/success", ":)");
          })
          .catch(response => {
            this.$store.dispatch("notification/error", {
              message: response.message,
              details: response.details
            });

            this.reload();
          });
      }
    },
    update() {
      this.reload();
      this.$events.$emit("model.update");
    }
  }
};
</script>
