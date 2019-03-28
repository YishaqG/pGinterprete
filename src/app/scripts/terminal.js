ipcRenderer.on('interpreter-run', () => {
    if( this.current_file.length > 0 ) {
        ptyProcess.write(`\n`);
        ptyProcess.write(`\n`);
        ptyProcess.write(`clear\n`);
        ptyProcess.write(`./main.py -in="${this.current_file}"\n`);
    }
    else {
        alert("Abre o guarda un archivo antes de correr el interprete.")
    }
});
