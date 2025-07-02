import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio'
import {listEnv,removeEnv, open_default_terminal} from './utils.js'

export const GeckoNewDialog = GObject.registerClass({
  GTypeName:'GeckoNewEnv',
  Template: 'file://' + GLib.get_current_dir() + '/src/templates/geck_new_env.ui',
  InternalChildren:[]
},class GeckoNewDialog extends Adw.Dialog{
  _init(params={}){
    super._init(params)
  }
})

export const GeckoEnvItem = GObject.registerClass({
  GTypeName:'GeckoEnvItem',
  Template: 'file://' + GLib.get_current_dir() + '/src/templates/geck_env_item.ui',
  InternalChildren:['GeckoEnvItemLabel','GeckoEnvItemButton']
}, class GeckoEnvItem extends Gtk.Grid {
  constructor(label,callback=()=>{},params = {}) {
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
      callback()
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

    const app_group = new Gio.SimpleActionGroup()
    this.insert_action_group('app',app_group)
    const newEnvAction = new Gio.SimpleAction({name:'new'})
    newEnvAction.connect('activate',()=>{
      const dialog =  new GeckoNewDialog()
      dialog.set_content_width(300)
      dialog.present(this)
      print(' creating new env')
    })
    app_group.add_action(newEnvAction)

  }
  reset(){
    this._env_list.remove_all()
  }
  listAll(){
    this._env_list.remove_all()
    listEnv().then((r)=>{
        for (const e of r) {
            this.addEnvItem(e)
        }
    })
  }
  addEnvItem(envName) {
    const env_item = new GeckoEnvItem(envName,this.listAll.bind(this));
    this._env_list.append(env_item);
  }
});
