const dialog = remote.dialog;

var saveAs = () => {
  storage.get('code-savefile', (error, data) => {
    options = {};

    if('filename' in data) {
      options.defaultPath = data.filename;
    }

    dialog.showSaveDialog(options, (fileName) => {
        if(fileName === undefined) {
            console.log("You didn't save the file");
            return;
        }

        storage.set(
            'code-savefile',
            {'filename' : fileName},
            (error) => {
                if (error) alert(error);
            }
        );

        var code_value = code_mirror.getValue();
        // fileName is a string that contains the path and filename created in the save file dialog.
        fs.writeFile(
            fileName,
            code_value,
            (error) => {
                if(error){
                    alert("An error ocurred creating the file "+ err.message)
                }
            }
        );

        this.setClean();
        this.current_file = fileName;
        this.updateWindowTitle(fileName);
    });
  });
};

ipcRenderer.on('file-new', () => {
    storage.set('code-savefile', {}, (error) => { if (error) alert(error); });
    this.current_file = '';
    code_mirror.getDoc().setValue("");
});

// Handling file saving through IPCRenderer
ipcRenderer.on('file-save', () => {
    storage.get('code-savefile', (error, data) => {
        if(error){
            saveAs();
            return;
        }
        if('filename' in data){
            var fileName = data.filename;

            if (fileName === undefined){
                console.log("You didn't save the file");
                return;
            }

            storage.set(
                'code-savefile',
                {'filename' : fileName},
                (error) => {
                    if (error) alert(error);
                }
            );

            var code_value = code_mirror.getValue();
            // fileName is a string that contains the path and filename created in the save file dialog.
            fs.writeFile(fileName, code_value, (err) => {
                if(err){
                    alert("An error ocurred creating the file "+ err.message)
                }
            });
            this.setClean();
            this.current_file = fileName;
            this.updateWindowTitle(fileName);
        }
        else {
            saveAs();
        }
    });
});

ipcRenderer.on('file-save-as', saveAs);

// Handling file opening through IPCRenderer
ipcRenderer.on('file-open', () => {
    storage.get('code-savefile', (error, data) => {
        if (error) alert(error);

        var options = {'properties': ['openFile']};

        if ('filename' in data) {
            options.defaultPath = data.filename;
        }

        dialog.showOpenDialog(options, (fileName) => {
            if (fileName === undefined){
                console.log("You didn't open the file");
                return;
            }

            storage.set(
                'code-savefile',
                {'filename' : fileName[0]},
                (error) => {
                    if (error) alert(error);
                }
            );

            // fileName is a string that contains the path and filename created in the save file dialog.
            fs.readFile(fileName[0], 'utf-8', (err, data) => {
                if(err){
                    alert("An error ocurred while opening the file "+ err.message)
                }
                code_mirror.getDoc().setValue(data);
            });
            this.current_file = fileName[0];
        });
    });
});
