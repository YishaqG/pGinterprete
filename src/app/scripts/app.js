const { ipcRenderer, remote } = require('electron');
var fs = remote.require('fs');
const storage = require('electron-storage');

const os = require('os')
var pty = require('node-pty');
var Terminal = require('xterm').Terminal;

var current_file = '';

var code_mirror = CodeMirror(
    document.getElementById("editor"),
    {
        lineNumbers: true
    }
);

// Initialize node-pty with an appropriate shell
const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.cwd()+"/src/engine/",
  env: process.env
});

// Initialize xterm.js and attach it to the DOM
let terminal_container = document.getElementById( 'term-container' );
Terminal.applyAddon(fit);
const xterm = new Terminal({
    width:'100%',
    height:'100%'
});

xterm.open( document.getElementById('term-container') );
xterm.fit();

// Setup communication between xterm.js and node-pty
xterm.on('data', (data) => {
    ptyProcess.write(data);
});

ptyProcess.on('data', function (data) {
    xterm.write(data);
});
ptyProcess.write("export PS1='> '\n");
ptyProcess.write("\n");
ptyProcess.write("\n");
ptyProcess.write("clear\n");


function calculateNumberOfTerminalRows() {
    // https://dev.to/shalvah/i-was-bored-so-i-made-my-website-into-a-node-package-heres-how-2id3
    let testElement = document.createElement('div');
    testElement.innerText = 'h';
    testElement.style.visibility = 'hidden';
    document.querySelector('.term-container').append(testElement);
    testElement.style.fontSize = '14px';
    let fontHeight = testElement.clientHeight + 1;
    testElement.remove();
    return Math.floor( $(window).height()* 0.6/ fontHeight) - 2;
}

function calculateNumberOfTerminalCols() {
    // https://dev.to/shalvah/i-was-bored-so-i-made-my-website-into-a-node-package-heres-how-2id3
    const ctx = document.createElement("canvas").getContext('2d');
    ctx.font = '14px monospace';
    const fontWidth = ctx.measureText('h').width + 1;
    return Math.floor( $(window).width() * 0.8 / fontWidth) + 3;
}

function resize(){
    width = $(window).width();
    height = $(window).height();
    code_mirror.setSize(
        width,
        height*0.6
    );

    xterm.resize(calculateNumberOfTerminalCols(), calculateNumberOfTerminalRows());
    xterm.fit();
}

resize();
let currentWindow = remote.getCurrentWindow().removeAllListeners();
currentWindow.on( 'resize', () => { setTimeout(resize, 100) } );
