var variables_state = false;
function variables_tap() {
    if( variables_state ) {
        EDITOR.width_ratio = 0.979;
        resize( );
        document.getElementById("variables-tap").style.width = "0px";
        document.getElementById("variables-tap").style.overflow = "hidden";
        document.getElementById("variables-tap-button").style.right = "0px";
        variables_state = false;
    }
    else {
        EDITOR.width_ratio = 0.7;
        resize( );
        document.getElementById("variables-tap").style.width = "30%";
        document.getElementById("variables-tap").style.overflow = "auto";
        document.getElementById("variables-tap-button").style.right = "calc(30% - 20px)";
        variables_state = true;
    }
}
