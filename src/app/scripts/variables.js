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

let table = document.getElementById("variables-table");
let tbody = table.getElementsByTagName("tbody")[0];
function nextOperation(){
  if(var_operations.length > 0)
  {
    let operation = var_operations.shift();
    if( operation[0] == "CREATE" ){
      let row = tbody.insertRow(0);
      row.setAttribute("id", operation[2]["id"]);

      let cell = row.insertCell(0);
      cell.innerHTML = operation[2]["id"];

      cell = row.insertCell(1);
      cell.innerHTML = operation[1];

      cell = row.insertCell(2);
      cell.innerHTML = operation[2]["value"]["type"];

      cell = row.insertCell(3);
      cell.innerHTML = operation[2]["value"]["value"];

      cell = row.insertCell(4);
      cell.innerHTML = operation[2]["value"]["value"];

    }else if( operation[0] == "UPDATE" ){
      let cells = table.rows.namedItem( operation[2]["id"] ).cells;
      cells[3].innerHTML = cells[4].innerHTML;
      cells[4].innerHTML = operation[2]["value"]["value"];
    }else if( operation[0] == "DELETE" ){
      var rowIndex = table.rows.namedItem( operation[2]["id"] ).rowIndex;
      table.deleteRow( rowIndex );
    }
  }
}
