
ipcRenderer.on('interpreter-run', () => {
    if( this.current_file.length > 0 ) {
        ptyProcess.write(`\n`);
        ptyProcess.write(`\n`);
        ptyProcess.write(`clear\n`);
        ptyProcess.write(`./main.py -in="${this.current_file}" -fw -i\n`);
    }
    else {
        alert("Abre o guarda un archivo antes de correr el interprete.")
    }
});

var terminal_state = false;
function terminal_tap() {
    if( terminal_state ) {
        document.getElementById("term-tap-button").style.bottom = "0px";
        document.getElementById("term-tap").style.height = "0";
        terminal_state = false;
        EDITOR.height_ratio = 0.971;
        TERMINAL.height_ratio = 0;
        resize( );
    }
    else {
        document.getElementById("term-tap-button").style.bottom = "35.6%";
        document.getElementById("term-tap").style.height = "100%";
        terminal_state = true;
        EDITOR.height_ratio = 0.615;
        TERMINAL.height_ratio = 0.4;
        resize( );
    }
}
