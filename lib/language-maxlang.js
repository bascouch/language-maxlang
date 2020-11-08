'use babel'

import MaxlangView from './language-maxlang-view';
import { CompositeDisposable } from 'atom';

const osc = require('node-osc');
let editor, client = null;
let host = "localhost";
let port = 51312;

export default {

  maxlangView: null,
//  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.maxlangView = new MaxlangView(state.maxlangViewState);
/*    this.modalPanel = atom.workspace.addModalPanel({
      item: this.maxlangView.getElement(),
      visible: false});*/

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable;

    // Register command that toggles this view
    return this.subscriptions.add(atom.commands.add('atom-workspace', {
      'maxlang:init': () => this.init(),
      'maxlang:startmaxlang' : () => this.startmaxlang(),
      'maxlang:oscsend' : () => this.oscsend(),
      'maxlang:startfromlabel' : () => this.startfromlabel(),
      'maxlang:stoptmaxlang' : () => this.stoptmaxlang(),
      'maxlang:Loadmaxlang' : () => this.loadmaxlang(),
      'maxlang:nextevent' : () => this.nextevent()
    }));
  },

  deactivate() {
//    this.modalPanel.destroy();
    this.subscriptions.dispose();
    return this.maxlangView.destroy();
  },

  serialize() {
    return {
      maxlangViewState: this.maxlangView.serialize()
    };
  },

  init() {
    if (!client)
    {
      client = new osc.Client(host, port);
      console.log('Maxlang OSC transmission activated\n host: %s, port: %d',host, port);
    }
  },

  oscsend() {
    if (!client)
      this.init();
    editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const selection = editor.getSelectedText();
      if (selection)
      {
        client.send('/maxlang/cmd', 'playstring', selection);
      }
      else
      {
        const line = editor.lineTextForBufferRow(
          editor.getCursorBufferPosition().row);
          client.send('/maxlang/cmd', 'playstring', line);
      }
    }
    console.log('Sent to Maxlang!');
  },

  startmaxlang() {
    if (!client)
      this.init();
    client.send('/maxlang/cmd', 'start');
  },

  stoptmaxlang() {
    if (!client)
      this.init();
    client.send('/maxlang/cmd', 'stop');
  },

  loadmaxlang() {
    if (!client)
      this.init();
    editor = atom.workspace.getActiveTextEditor();
    client.send('/maxlang/cmd', 'score', editor.getPath());
  },

  startfromlabel() {
    if (!client)
      this.init();
    editor = atom.workspace.getActiveTextEditor();
    client.send('/maxlang/cmd', 'startfromlabel');
  },

  nextevent() {
    if (!client)
      this.init();
    editor = atom.workspace.getActiveTextEditor();
    client.send('/maxlang/cmd', 'nextevent');
  },


};
//compare with previous implementation
