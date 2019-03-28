var exec = require('child_process').exec;

const python_min_version = 3.5

function python3_version() {
    var python_cmd = '';

    exec('python3 -c "import platform; print(platform.python_version())"',
        function(err, stdout, stderr) {
            if( stderr ) {
                alert(`Install python version ${python_min_version} or above.`);
            } else if( parseFloat( stdout ) >= python_min_version ) {
                python_cmd = 'python3';
            } else {
                alert(`Install python version ${python_min_version} or above.`);
            }
    });

    return python_cmd
}

function check_python() {
    var python_cmd = '';

    exec('python -c "import platform; print(platform.python_version())"',
        function(err, stdout, stderr) {
            if( !stderr ) {
                python_cmd = python3_version();
            } else if( parseFloat( stdout ) < python_min_version ) {
                python_cmd = python3_version();
            } else {
                python_cmd = 'python';
            }
    });

    return python_cmd
}

module.exports = check_python
