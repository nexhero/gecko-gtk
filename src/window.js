import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio'
import {removeEnv, open_default_terminal} from './utils.js'
export const GeckoEnvItem = GObject.registerClass({
  GTypeName:'GeckoEnvItem',
  Template: 'file://' + GLib.get_current_dir() + '/src/templates/geck_env_item.ui',
  InternalChildren:['GeckoEnvItemLabel','GeckoEnvItemButton']
}, class GeckoEnvItem extends Gtk.Grid {
  constructor(label,params = {}) {
    super(params);
    this._GeckoEnvItemLabel.set_label(label)


    const env_group = new Gio.SimpleActionGroup()
    this.insert_action_group("env",env_group)

    const openTerminalAction = new Gio.SimpleAction({ name: 'open_terminal' });
    openTerminalAction.connect('activate', () => {
      open_default_terminal(label)
      print(`Opening terminal for ${label}`);
    });

    const removeAction = new Gio.SimpleAction({ name: 'remove' });
    removeAction.connect('activate', async() => {
      await removeEnv(label)
      print(`Removed ${label}`);
    });

    env_group.add_action(openTerminalAction)
    env_group.add_action(removeAction)
  }

});

export const GeckoGtkWindow = GObject.registerClass({
  GTypeName:'GeckoGtkWindow',
  Template: 'file://' + GLib.get_current_dir() + '/src/window.ui',
  InternalChildren:['env_list']
}, class GeckoGtkWindow extends Adw.ApplicationWindow {
  _init(params = {}) {
    super._init(params);

  }
  addEnvItem(envName) {
    const env_item = new GeckoEnvItem(envName);
    this._env_list.append(env_item);
  }
});
