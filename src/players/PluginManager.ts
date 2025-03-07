import { IPlayer } from "./IPlayer";

class PluginManager {
  private static pluginFactories: { [key: string]: () => IPlayer } = {};

  static registerPlugin(name: string, factory: () => IPlayer) {
    this.pluginFactories[name] = factory;
  }

  static getPlugin(name: string): IPlayer | undefined {
    return this.pluginFactories[name] ? this.pluginFactories[name]() : undefined;
  }

  static getAvailablePlugins(): string[] {
    return Object.keys(this.pluginFactories);
  }
}

export default PluginManager;