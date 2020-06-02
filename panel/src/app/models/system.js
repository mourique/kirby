export default (Vue, store) => ({
  async install(values) {
    const user = await Vue.$api.system.install(values);
    await store.dispatch("user/current", user);
    return user;
  },
  async load(reload = false) {
    // reuse cached system info
    if (reload === false) {
      if (
        store.state.system.info.isReady &&
        store.state.user.current
      ) {
        return store.state.system.info;
      }
    }

    // reload the system info
    try {
      const info = await Vue.$api.system.info({ view: "panel" });

      store.dispatch("system/info", {
        isReady: info.isInstalled && info.isOk,
        ...info
      });

      if (info.languages) {
        store.dispatch("languages/install", info.languages);
      }

      store.dispatch("translation/install", info.translation);
      store.dispatch("translation/activate", info.translation.id);

      if (info.user) {
        store.dispatch("user/current", info.user);
      }
    } catch (error) {
      store.dispatch("system/info", {
        isBroken: true,
        error: error.message
      });
    } finally {
      return store.state.system.info;
    }
  },
  async register(registration) {
    await Vue.$api.system.register(registration);
    await store.dispatch("system/register", registration.license);
    store.dispatch("notification/success", Vue.$t("license.register.success"));
  }
});