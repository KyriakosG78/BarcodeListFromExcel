//Name the list title 
const $source = document.getElementById('inputTitle');
const $result = document.getElementById('printTitle');

const typeHandler = function(e) {
  $result.innerHTML = e.target.value;
}

$source.addEventListener('input', typeHandler)
$source.addEventListener('propertychange', typeHandler) 

//Add date to bottom
document.getElementById('date').innerHTML = Date("DD-MM-YYYY");

//excel barcode functions
document.getElementById('uploadedFile').addEventListener('change', handleFileSelect, false);

function handleFileSelect(evt) {
  var files = evt.target.files;
  var xl2json = new ExcelToJSON();
  xl2json.parseExcel(files[0]);
}

class ExcelToJSON {
    constructor() {
        this.parseExcel = function (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var data = e.target.result;

                var workbook = XLSX.read(data, {
                    type: 'binary'
                });

                workbook.SheetNames.forEach(function (sheetName) {
                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    var json_object = JSON.stringify(XL_row_object);

                    buildHtmlTable(JSON.parse(json_object), '#excelDataTable')

                    var table = document.getElementById('excelDataTable');
                    var targetTDs = table.querySelectorAll('tr > td:first-child');

                    //Chanche first column to svg image barcode
                    for (var i = 0; i < targetTDs.length; i++) {
                        var td = targetTDs[i];
                        td.innerHTML = '<svg class="barcode" jsbarcode-value="' + td.innerHTML + '" jsbarcode-height="35" jsbarcode-width="2"</svg>';
                    }
                    //Init all barcode clases to 
                    JsBarcode(".barcode").init();

                });
            };

            reader.onerror = function (ex) {
                console.log(ex);
            };

            reader.readAsBinaryString(file);
        };
    }
}

// Builds the HTML Table out of myList.
function buildHtmlTable(myList, selector) {
  var columns = addAllColumnHeaders(myList, selector);

  for (var i = 0; i < myList.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = myList[i][columns[colIndex]];

      if (colIndex == 0) {

      };

      if (cellValue == null) cellValue = "";

      row$.append($('<td/>').html(cellValue));
    }

    $(selector).append(row$);
  }
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(myList, selector) {
  var columnSet = [];
  var headerTr$ = $('<tr/>');

  for (var i = 0; i < myList.length; i++) {
    var rowHash = myList[i];
    for (var key in rowHash) {
      if ($.inArray(key, columnSet) == -1) {
        columnSet.push(key);
        headerTr$.append($('<th/>').html(key));
      }
    }
  }
  $(selector).append(headerTr$);

  return columnSet;
}