// Получение объекта фотографии
var linkList = JSON.parse(
  decodeURI(window.location.href.split("img=")[1].replaceAll('"', ""))
);

// Создание элемента img с ссылкой на фотографию
let img = document.createElement("img");
img.src = linkList.data;
document.querySelector("body").appendChild(img);

// Создание элемента выделения
var selectedArea = document.createElement("div");
selectedArea.id = "selectedArea";
selectedArea.style.position = "fixed";
selectedArea.style.zIndex = "1300";
selectedArea.style.background = "#000";
selectedArea.style.opacity = "0.3";
var x = null;
var y = null;

// Событие при клике
document.addEventListener("mousedown", mousedown);

function mousedown(e) {
  x = e.clientX;
  y = e.clientY;

  // Добавляет в документ созданный элемент
  if (!document.querySelector("#selectedArea"))
    document.querySelector("body").appendChild(selectedArea);

  // Установка его переменных топ и лефт
  selectedArea.style.top = y + "px";
  selectedArea.style.left = x + "px";

  // Событие при передвижении мышки
  document.addEventListener("mousemove", MouseEventMove, false);
}

function MouseEventMove(j) {
  mousex = j.clientX;
  mousey = j.clientY;

  // Установка его переменных ширины и высоты
  selectedArea.style.width = mousex - x + "px";
  selectedArea.style.height = mousey - y + "px";

  // Задает переменные ширины, высоты, X и Y
  selectedArea.setAttribute("oldw", mousex - x);
  selectedArea.setAttribute("oldh", mousey - y);
  selectedArea.setAttribute("oldx", selectedArea.offsetLeft);
  selectedArea.setAttribute("oldy", selectedArea.offsetTop);
}

// Событие при отжатии клика
document.addEventListener("mouseup", mouseup);

function mouseup() {
  // Удаляет события, чтоб не было повторений
  document.removeEventListener("mousemove", MouseEventMove, false);
  document.removeEventListener("mousedown", mousedown);
  document.removeEventListener("mouseup", mouseup);

  // Создание объекта с переменными
  var selectedMes = {
    x: parseInt(selectedArea.getAttribute("oldx")),
    y: parseInt(selectedArea.getAttribute("oldy")),
    w: parseInt(selectedArea.getAttribute("oldw")),
    h: parseInt(selectedArea.getAttribute("oldh")),
  };
  
  // Создание канваса
  let screenshot = {
    content: document.createElement("canvas"),
    data: "",
  };
  // Отрисовка изображения со страницы
  var image = new Image();
  image.onload = function () {
    var canvas = screenshot.content;
    // Установка ширины и высоты соответсвенно ширине и высоте выделенной области
    canvas.width = selectedMes.w;
    canvas.height = selectedMes.h;
    var context = canvas.getContext("2d");
    // Установка начальной точки (координаты первого клика)
    context.drawImage(image, 0 - selectedMes.x, 0 - selectedMes.y);
    var link = document.createElement("a");
    link.download = "download.png";
    link.href = screenshot.content.toDataURL();
    link.click();
    screenshot.data = "";
  };
  image.src = linkList.data;
  document.querySelector("#selectedArea").remove();
  window.close();
}
