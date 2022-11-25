//<секция с тегами
let value = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.method) {
    case "set":
      value = message.value;
      sendResponse({ value: null });
      break;
    case "get":
      sendAfterSet();
      break;
    case "clear":
      value = "";
      sendResponse({ value: null });
      break;
    case "ready":
      sendResponse({ download: "download" });
      break;
  }
  return true;

  async function sendAfterSet() {
    for (let i = 0; i < 10; i++) {
      if (value != "") {
        sendResponse({ value: value });
        return;
      }
      await new Promise((s) => setTimeout(s, 1000));
    }
    value = "Error: Document information could not be obtained.";
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "Chapter 6",
    title: "Показать кол-во символов …",
    type: "normal",
    contexts: ["selection"],
  });
});

chrome.runtime.onMessage.addListener(() => {
  chrome.contextMenus.onClicked.addListener((text, tab) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: countText,
      },
      (e) => {}
    );
  });
});

function countText() {
  document.body.addEventListener("mousemove", MouseMove, false);
  function MouseMove(j) {
    document.querySelector("#searchMenuId");

    document.onclick = function (e) {
      if (!e.path.includes(document.querySelector("#searchMenuId")))
        document.querySelector("#searchMenuId").remove();
    };

    if (document.querySelector("#searchMenuId")) {
      document.querySelector("#searchMenuId").remove();
    }
    var searchMenu = document.createElement("div");
    var selection = document.getSelection();
    const size = window
      .getComputedStyle(selection.anchorNode.parentElement, null)
      .getPropertyValue("font-size");
    const family = window
      .getComputedStyle(selection.anchorNode.parentElement, null)
      .getPropertyValue("font-family");
    const color = window
      .getComputedStyle(selection.anchorNode.parentElement, null)
      .getPropertyValue("color");
    searchMenu.id = "searchMenuId";
    var text = selection.toString();
    with (searchMenu.style) {
      position = "fixed";
      left = j.clientX + "px";
      top = j.clientY + 20 + "px";
      zIndex = 0xffffffff;
      backgroundColor = "#F6F6F6";
      border = "1px solid #666";
      padding = "4px";
      lineHeight = "normal";
      padding = "5px 10px";
    }
    document.body.appendChild(searchMenu);

    var defCatMenu = document.createElement("div");
    defCatMenu.id = "defCatMenuId";
    defCatMenu.style.borderBottom = "4px solid #F6F6F6";
    searchMenu.appendChild(defCatMenu);

    catMenu = defCatMenu;

    let textCount = 0;

    let textCountSpace = 0;

    let counter = 1;
    let totalWords;

    let selText = decodeURI(text);

    textCount = selText;
    textCount = textCount.length;

    textCountSpace = selText;
    textCountSpace = textCountSpace.replace(/\s/g, "");
    textCountSpace = textCountSpace.length;

    selText.replaceAll(/\s/g, function (a) {
      counter++;
    });

    totalWords = counter;

    var submenuAr = [
      {
        text: "символов с пробелами",
        value: textCount,
      },
      {
        text: "символов без пробелов",
        value: textCountSpace,
      },
      {
        text: "слов",
        value: totalWords,
      },
      {
        text: "Размер шрифта",
        value: size,
      },
      {
        text: "Цвет текста",
        value: color,
      },
      {
        text: "Шрифт",
        value: family,
      },
    ];

    for (let i = 0; i < submenuAr.length; i++) {
      var menuItem = document.createElement("div");
      var value = document.createElement("p");
      value.textContent = submenuAr[i].value;
      value.style.margin = "0";
      value.style.fontSize = "24px";
      value.style.fontWeight = "Bold";
      value.style.width = "45%";

      var text = document.createElement("p");
      text.textContent = submenuAr[i].text;
      text.style.margin = "0";
      text.style.fontSize = "16px";
      text.style.marginLeft = "5px";
      text.style.width = "55%";

      with (menuItem.style) {
        display = "flex";
        padding = "12px 0";
        justifyContent = "space-between";
      }
      if (i < 3) {
        menuItem.style.borderBottom = "1px solid #000";
      } else {
        menuItem.style.padding = "2.5px 0";
        value.style.fontSize = "14px";
        text.style.fontSize = "14px";
        menuItem.style.flexDirection = "row-reverse";
        value.style.fontWeight = "Normal";
        text.style.fontWeight = "Bold";
      }

      if (i == 3) {
        menuItem.style.paddingTop = "10px";
      }

      menuItem.appendChild(value);
      menuItem.appendChild(text);

      catMenu.appendChild(menuItem);
    }

    document.body.removeEventListener("mousemove", MouseMove, false);
  }
}

//секция с тегам>
