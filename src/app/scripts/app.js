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
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
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
xterm.setOption('fontSize', 15);
xterm.setOption('fontWeight', 'normal');
xterm.setOption('fontFamily', 'monospace');

xterm.open( document.getElementById('term-container') );
xterm.fit();

// Setup communication between xterm.js and node-pty
xterm.on('data', (data) => {
    ptyProcess.write(data);
});

const regex = /(CREATE|UPDATE|DELETE):(\w+):(.+)/g;
let var_operations = [];
ptyProcess.on('data', function (data) {
  xterm.write(data);

  let match = regex.exec(data);
  do {
    let {$1, $2, $3} = RegExp;
    if( $1 && $2 && $3){
      $3 = $3.replace(/'/g, '"');
      console.log($1, $2, $3);
      var_operations.push( [$1, $2, JSON.parse($3)] );
      match = regex.exec(data);
      $1, $2, $3 = null;
    }
  } while( match );

});
ptyProcess.write("PS1='> '\n");
ptyProcess.write("clear");


function calculateTerminalHeightRowBase( window_height, height_ratio, font_size ) {
    // https://dev.to/shalvah/i-was-bored-so-i-made-my-website-into-a-node-package-heres-how-2id3
    let testElement = document.createElement('div');
    testElement.innerText = 'a';
    testElement.style.visibility = 'hidden';
    document.querySelector('.term-container').append(testElement);
    testElement.style.fontSize = font_size;
    let fontHeight = testElement.clientHeight + 1;
    testElement.remove();
    return height_ratio > 0 ? Math.floor( window_height/fontHeight*(1-height_ratio) )-2 : 0;
}

function calculateTerminalWidthColumnBase(window_width, width_ratio, font ) {
    // https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
    let ctx = document.createElement("canvas").getContext('2d');
    ctx.font = 'normal 15px monospace';
    let fontWidth = ctx.measureText('a').width;
    return width_ratio > 0 ? Math.floor( window_width/fontWidth ) : 0;
}

var EDITOR = {height_ratio:0.971, width_ratio:0.979};
var TERMINAL = {height_ratio:0, width_ratio:1};
function resize( ) {
    width = $(window).width();
    height = $(window).height();

    code_mirror.setSize(
        width*EDITOR.width_ratio,
        height*EDITOR.height_ratio
    );
    document.getElementById("variables-tap").style.height = (height*EDITOR.height_ratio-1)+"px";

    let terminal_width = calculateTerminalWidthColumnBase( width, TERMINAL.width_ratio, "normal 15px monospace" );
    let terminal_height = calculateTerminalHeightRowBase( height, TERMINAL.height_ratio, "15px" );
    ptyProcess.resize(terminal_width, terminal_height);

    xterm.resize(terminal_width, terminal_height);
    xterm.fit();
}

resize();
let currentWindow = remote.getCurrentWindow().removeAllListeners();
currentWindow.on( 'resize', () => { setTimeout(resize, 100) } );
