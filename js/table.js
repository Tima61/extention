var tableToExcel = (function () {
  var uri = "data:application/vnd.ms-excel;base64,",
    template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    base64 = function (s) {
      return window.btoa(unescape(encodeURIComponent(s)));
    },
    format = function (s, c) {
      return s.replace(/{(\w+)}/g, function (m, p) {
        return c[p];
      });
    };
  return function (table, name) {
    var linkList = JSON.parse(
      decodeURI(window.location.href.split("urls=")[1].replaceAll('"', ""))
    );
    let tableEl = document.createElement("table");
    for (let i = 0; i < linkList.length; i++) {
      let trEl = document.createElement("tr");
      for (const key in linkList[i]) {
        let tdEl = document.createElement("td");
        tdEl.textContent = linkList[i][key];
        trEl.appendChild(tdEl);
      }
      tableEl.appendChild(trEl);
    }
    var ctx = {
      worksheet: name || "Worksheet",
      table: tableEl.innerHTML,
    };
    window.location.href = uri + base64(format(template, ctx));
    setTimeout(() => {
      window.close()
    }, 250);
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  tableToExcel();
});
