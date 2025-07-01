#!/usr/bin/env -S gjs --module

import Gtk from 'gi://Gtk?version=4.0';
import Adw from 'gi://Adw';

import {GeckoGtkWindow} from './window.js'
import {listEnv} from './utils.js'

const app = new Adw.Application({ application_id: 'org.ninewinds.gecko' });


app.connect('activate', () => {
    const win = new GeckoGtkWindow({ application: app });
    win.present();

    listEnv().then((r)=>{
        for (const e of r) {
            win.addEnvItem(e)
        }
    })
});

app.runAsync([]).catch(err=>console.log(err))
