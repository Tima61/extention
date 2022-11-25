function openLinkList(linkList) {
  for (var i = 0; i < linkList.length; i++) {
    window.open(linkList[i], "_blank");
  }
}
var linkList = JSON.parse(
  decodeURI(window.location.href.split("urls=")[1].replaceAll('"', ""))
);
openLinkList(linkList);
window.close();
