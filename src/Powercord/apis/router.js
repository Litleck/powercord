const { API } = require('powercord/entities');

module.exports = class Router extends API {
  constructor () {
    super();
    this.routes = [];
    this.changeListeners = [];
  }

  startAPI () {
    powercord.on('loaded', () => {
      const oldRoute = DiscordNative.globals.appSettings.get('_POWERCORD_ROUTE');
      if (oldRoute && this.routes.find(c => c.path === oldRoute.split('/_powercord')[1])) {
        // @todo: Redirect to the custom route
      }
      DiscordNative.globals.appSettings.set('_POWERCORD_ROUTE', void 0);
      DiscordNative.globals.appSettings.save();
    });
  }

  registerRoute (path, render) {
    if (this.routes.find(c => c.path === path)) {
      return this.error(`Path ${path} is already registered by another plugin!`);
    }

    this.routes.push({
      path,
      render
    });
    this._change();
  }

  unregisterRoute (path) {
    this.routes = this.routes.filter(c => c.path !== path);
    this._change();
  }

  addChangeListener (listener) {
    this.changeListeners.push(listener);
  }

  removeChangeListener (listener) {
    this.changeListeners = this.changeListeners.filter(l => l !== listener);
  }

  _change () {
    this.changeListeners.forEach(fn => fn());
  }
};
