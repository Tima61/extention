//popup
chrome.runtime.sendMessage({ method: "clear" }, () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getDocumentInfo,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.log("Error: " + chrome.runtime.lastError.message);
        } else {
          chrome.runtime.sendMessage({ method: "get" }, (response) => {
            // Таргетный скриншот
            // document
            //   .getElementById("screenShotWin")
            //   .addEventListener("click", function () {
            //     // Создание фотографии текущей страницы
            //     var screenshot = {
            //       content: document.createElement("canvas"),
            //       data: "",
            //     };
            //     chrome.tabs.captureVisibleTab(
            //       null,
            //       {
            //         format: "png",
            //         quality: 100,
            //       },
            //       function (data) {
            //         screenshot.data = data;
            //         chrome.tabs.query(
            //           {
            //             active: true,
            //             currentWindow: true,
            //           },
            //           function (tabs) {
            //             chrome.runtime.sendMessage(
            //               { method: "ready" },
            //               function (response) {
            //                 if (response.download === "download") {
            //                   // Открытие нового окна с передачей фотографии
            //                   window.open(
            //                     "chrome-extension://" +
            //                       chrome.runtime.id +
            //                       "/screen.html?img=" +
            //                       JSON.stringify(screenshot),
            //                     "_blank"
            //                   );
            //                 }
            //               }
            //             );
            //           }
            //         );
            //       }
            //     );
            //   });

            // Полный скриншот страницы
            document
              .querySelector("#screenShotFull")
              .addEventListener("click", function () {
                chrome.tabs.sendMessage(
                  tabs[0].id,
                  { method: "ready" },
                  function (response) {
                    var screenshot = {
                      content: document.createElement("canvas"),
                      data: "",
                    };

                    chrome.tabs.captureVisibleTab(
                      null,
                      {
                        format: "png",
                        quality: 100,
                      },
                      function (data) {
                        screenshot.data = data;
                        chrome.tabs.query(
                          {
                            active: true,
                            currentWindow: true,
                          },
                          function (tabs) {
                            chrome.runtime.sendMessage(
                              { method: "ready" },
                              function (response) {
                                if (response.download === "download") {
                                  // Создание и загрузка фотографии
                                  var image = new Image();
                                  image.onload = function () {
                                    var canvas = screenshot.content;
                                    // Полная ширина и высота
                                    canvas.width = image.width;
                                    canvas.height = image.height;
                                    var context = canvas.getContext("2d");
                                    // X и Y = 0, т.е. самый верхний угол фотографии
                                    context.drawImage(image, 0, 0);
                                    var link = document.createElement("a");
                                    link.download = "download.png";
                                    link.href = screenshot.content.toDataURL();
                                    link.click();
                                    screenshot.data = "";
                                  };
                                  image.src = screenshot.data;
                                } else {
                                  screenshot.data = "";
                                }
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              });

              //ссылка в новой вкладке по индексации страниц
              document.getElementById('header__indexs-item-yandex').setAttribute("href","https://www.yandex.ru/search/?text=site:" + response.value.url);
              document.getElementById('header__indexs-item-google').setAttribute("href","https://www.google.com/search?q=site:" + response.value.url);

            document.querySelector('p[data-id="title"]').textContent =
              response.value.title;
            if (response.value.titlecount >= 20) {
              document
                .querySelector('span[data-id="titlecount"]')
                .classList.add("yes");
              if (response.value.titlecount >= 120) {
                document
                  .querySelector(
                    '.mainInfo__item--descrition[data-id="main-title"]'
                  )
                  .classList.add("more");
              }
            }

            if (response.value.descriptioncount >= 120) {
              document
                .querySelector('span[data-id="descriptioncount"]')
                .classList.add("yes");
              document
                .querySelector(
                  '.mainInfo__item--descrition[data-id="main-descrition"]'
                )
                .classList.add("more");
            }
            document.querySelector('p[data-id="description"]').textContent =
              response.value.description;

            document.querySelector('p[data-id="keywords"]').textContent =
              response.value.keywords;

            if (response.value.keywords?.length >= 120) {
              document
                .querySelector(
                  '.mainInfo__item--descrition[data-id="main-keywords"]'
                )
                .classList.add("more");
            }

            document.querySelector('p[data-id="h1"]').textContent =
              response.value.h1;

            if (response.value.h1.length >= 120) {
              document
                .querySelector('.mainInfo__item--descrition[data-id="main-h1"]')
                .classList.add("more");
            }

            let moreSpan = document.querySelectorAll(
              ".mainInfo__item--descrition.more span"
            );
            for (let i = 0; i < moreSpan.length; i++) {
              moreSpan[i].addEventListener("click", function () {
                moreSpan[i]
                  .closest(".mainInfo__item--descrition.more")
                  .classList.toggle("active");
              });
            }

            //копирование текста из title и description
            document.getElementById("copy").onclick = function () {
              let copyTextarea = document.createElement("textarea");
              copyTextarea.style.position = "fixed";
              copyTextarea.style.opacity = "0";
              copyTextarea.textContent =
                document.querySelector('p[data-id="title"]').textContent;

              document.body.appendChild(copyTextarea);
              copyTextarea.select();
              document.execCommand("copy");
              document.body.removeChild(copyTextarea);
            };

            document.getElementById("copyd").onclick = function () {
              let copyTextarea = document.createElement("textarea");
              copyTextarea.style.position = "fixed";
              copyTextarea.style.opacity = "0";
              copyTextarea.textContent = document.querySelector(
                'p[data-id="description"]'
              ).textContent;

              document.body.appendChild(copyTextarea);
              copyTextarea.select();
              document.execCommand("copy");
              document.body.removeChild(copyTextarea);
            };

            //первая страница общая информация
            document.querySelector('p[data-id="url"]').textContent =
              response.value.autourl;
            document.querySelector('p[data-id="canonical"]').textContent =
              response.value.canonical;
            document.querySelector('p[data-id="robotsTags"]').textContent =
              response.value.robotsTags;
            document.querySelector('span[data-id="titlecount"]').textContent =
              response.value.titlecount + " символов";
            document.querySelector(
              'span[data-id="descriptioncount"]'
            ).textContent = response.value.descriptioncount + " символов";

            //вторая стрница контент
            document.querySelector('p[data-id="imgOnlyCount"]').textContent =
              "Всего изображений  - " + response.value.imgOnlyCount;
            document.querySelector('p[data-id="altCountTotal"]').textContent =
              "Изображений без alt  - " + response.value.altCountTotal;
            document.querySelector('p[data-id="imgWithOutTitle"]').textContent =
              "Изображений без title  - " + response.value.imgWithOutTitle;
            document.querySelector('p[data-id="videos"]').textContent =
              response.value.videos + " видео";
            document.querySelector('p[data-id="link__in"]').textContent =
              response.value.link__in + " ссылок";
            document.querySelector('p[data-id="link__out"]').textContent =
              response.value.link__out + " ссылок";
            document.querySelector('p[data-id="list"]').textContent =
              response.value.list;
            document.querySelector('p[data-id="table"]').textContent =
              response.value.table;

            //третья страница инструменты
            if (response.value.Robots)
              document
                .querySelector('a[data-id="Robots"]')
                .setAttribute("href", response.value.Robots);
            else {
              document
                .querySelector('a[data-id="Robots"]')
                .removeAttribute("href");
              document
                .querySelector('a[data-id="Robots"]')
                .classList.add("disabled");
            }

            if (response.value.Sitemap)
              document
                .querySelector('a[data-id="Sitemap"]')
                .setAttribute("href", response.value.Sitemap);
            else {
              document
                .querySelector('a[data-id="Sitemap"]')
                .removeAttribute("href");
              document
                .querySelector('a[data-id="Sitemap"]')
                .classList.add("disabled");
            }

            document
              .querySelector('a[data-id="GooglePageSpeed"]')
              .setAttribute(
                "href",
                "https://pagespeed.web.dev/report?utm_source=psi&utm_medium=redirect&url=" +
                  response.value.urlRur
              );
            document
              .querySelector('a[data-id="domains"]')
              .setAttribute(
                "href",
                "https://be1.ru/uznat-poddomeni-saita/?url=" +
                  response.value.urlOrigin
              );
            document
              .querySelector('a[data-id="dubles"]')
              .setAttribute(
                "href",
                "https://be1.ru/dubli-stranic/?url=" + response.value.urlOrigin
              );
            document
              .querySelector('a[data-id="adapt"]')
              .setAttribute(
                "href",
                "http://iloveadaptive.com/ru/url/" + response.value.urlRur
              );
            document
              .querySelector('a[data-id="micro"]')
              .setAttribute(
                "href",
                "https://search.google.com/test/rich-results?hl=ru&url=" +
                  response.value.urlRur
              );
            document
              .querySelector('a[data-id="Semrush"]')
              .setAttribute(
                "href",
                "https://www.semrush.com/analytics/overview/?q=" +
                  response.value.urlOrigin
              );
            document
              .querySelector('a[data-id="reverseLinks"]')
              .setAttribute(
                "href",
                "https://www.semrush.com//analytics/backlinks/overview/?q=" +
                  response.value.urlOrigin
              );
            document
              .querySelector('a[data-id="googleRep"]')
              .setAttribute(
                "href",
                "https://www.google.com/search?q=" +
                  response.value.urlOrigin +
                  "+отзывы"
              );
            document
              .querySelector('a[data-id="yaRep"]')
              .setAttribute(
                "href",
                "https://www.yandex.ru/search/?text=" +
                  response.value.urlOrigin +
                  "+отзывы"
              );
            document
              .querySelector('a[data-id="indexUrl"]')
              .setAttribute(
                "href",
                "https://www.yandex.ru/search/?text=url:" +
                  response.value.urlRur
              );
            document
              .querySelector('a[data-id="webArchive"]')
              .setAttribute(
                "href",
                "http://web.archive.org/web/20220000000000*/" +
                  response.value.urlOrigin
              );

            var linkList = [
              "https://pagespeed.web.dev/report?utm_source=psi&utm_medium=redirect&url=" +
                response.value.urlRur,
              "https://be1.ru/uznat-poddomeni-saita/?url=" +
                response.value.urlOrigin,
              "https://be1.ru/dubli-stranic/?url=" + response.value.urlOrigin,
              "http://iloveadaptive.com/ru/url/" + response.value.urlRur,
              "https://search.google.com/test/rich-results?hl=ru&url=" +
                response.value.urlRur,
              "https://www.semrush.com/analytics/overview/?q=" +
                response.value.urlOrigin,
              "https://www.semrush.com//analytics/backlinks/overview/?q=" +
                response.value.urlOrigin,
              "https://www.google.com/search?q=" +
                response.value.urlOrigin +
                "+отзывы",
              "https://www.yandex.ru/search/?text=" +
                response.value.urlOrigin +
                "+отзывы",
              "http://web.archive.org/web/20220000000000*/" +
                response.value.urlOrigin,
            ];
            if (response.value.Sitemap) {
              linkList.unshift(response.value.Sitemap);
            }
            if (response.value.Robots) {
              linkList.unshift(response.value.Robots);
            }

            let tablelist = response.value.tableImg;

            document
              .querySelector(".openAll")
              .setAttribute(
                "href",
                "chrome-extension://" +
                  chrome.runtime.id +
                  "/full.html?urls=" +
                  JSON.stringify(linkList)
              );
            document
              .querySelector(".content__images--download > a")
              .setAttribute(
                "href",
                "chrome-extension://" +
                  chrome.runtime.id +
                  "/table.html?urls=" +
                  JSON.stringify(tablelist)
              );

            if (response.value.content) {
              for (
                let index = 0;
                index < response.value.content.length;
                index++
              ) {
                document.querySelector('p[data-id="content"]').innerHTML =
                  document.querySelector('p[data-id="content"]').innerHTML +
                  response.value.content[index];
              }
            }

            if (response.value.link__out__inst?.length > 0) {
              document.querySelector("#inst").classList.add("active");
              document
                .querySelector("#inst")
                .setAttribute("href", response.value.link__out__inst[0]);
              document.querySelector("#inst").setAttribute("target", "blank");
            }
            if (response.value.link__out__face?.length > 0) {
              document.querySelector("#face").classList.add("active");
              document
                .querySelector("#face")
                .setAttribute("href", response.value.link__out__face[0]);
              document.querySelector("#face").setAttribute("target", "blank");
            }
            if (response.value.link__out__twitter?.length > 0) {
              document.querySelector("#twitter").classList.add("active");
              document
                .querySelector("#twitter")
                .setAttribute("href", response.value.link__out__twitter[0]);
              document
                .querySelector("#twitter")
                .setAttribute("target", "blank");
            }
            if (response.value.link__out__ok?.length > 0) {
              document.querySelector("#ok").classList.add("active");
              document
                .querySelector("#ok")
                .setAttribute("href", response.value.link__out__ok[0]);
              document.querySelector("#ok").setAttribute("target", "blank");
            }
            if (response.value.link__out__tiktok?.length > 0) {
              document.querySelector("#tiktok").classList.add("active");
              document
                .querySelector("#tiktok")
                .setAttribute("href", response.value.link__out__tiktok[0]);
              document.querySelector("#tiktok").setAttribute("target", "blank");
            }
            if (response.value.link__out__vk?.length > 0) {
              document.querySelector("#vk").classList.add("active");
              document
                .querySelector("#vk")
                .setAttribute("href", response.value.link__out__vk[0]);
              document.querySelector("#vk").setAttribute("target", "blank");
            }
            if (response.value.link__out__zen?.length > 0) {
              document.querySelector("#zen").classList.add("active");
              document
                .querySelector("#zen")
                .setAttribute("href", response.value.link__out__zen[0]);
              document.querySelector("#zen").setAttribute("target", "blank");
            }
            if (response.value.link__out__rutube?.length > 0) {
              document.querySelector("#rutube").classList.add("active");
              document
                .querySelector("#rutube")
                .setAttribute("href", response.value.link__out__rutube[0]);
              document.querySelector("#rutube").setAttribute("target", "blank");
            }
            if (response.value.link__out__youtube?.length > 0) {
              document.querySelector("#youtube").classList.add("active");
              document
                .querySelector("#youtube")
                .setAttribute("href", response.value.link__out__youtube[0]);
              document
                .querySelector("#youtube")
                .setAttribute("target", "blank");
            }
            if (response.value.link__out__telegram?.length > 0) {
              document.querySelector("#telegram").classList.add("active");
              document
                .querySelector("#telegram")
                .setAttribute("href", response.value.link__out__telegram[0]);
              document
                .querySelector("#telegram")
                .setAttribute("target", "blank");
            }
            if (response.value.link__out__whats?.length > 0) {
              document.querySelector("#whats").classList.add("active");
              document
                .querySelector("#whats")
                .setAttribute("href", response.value.link__out__whats[0]);
              document.querySelector("#whats").setAttribute("target", "blank");
            }
            if (response.value.link__out__viber?.length > 0) {
              document.querySelector("#viber").classList.add("active");
              document
                .querySelector("#viber")
                .setAttribute("href", response.value.link__out__viber[0]);
              document.querySelector("#viber").setAttribute("target", "blank");
            }

            document.querySelector('p[data-id="h1count"]').textContent =
              response.value.h1Count;
            document.querySelector('p[data-id="h2"]').textContent =
              response.value.h2Count;
            document.querySelector('p[data-id="h3"]').textContent =
              response.value.h3Count;
            document.querySelector('p[data-id="h4"]').textContent =
              response.value.h4Count;
            document.querySelector('p[data-id="h5"]').textContent =
              response.value.h5Count;
            document.querySelector('p[data-id="h6"]').textContent =
              response.value.h6Count;

            document
              .getElementById("screenf")
              .setAttribute(
                "href",
                "https://mini.s-shot.ru/1280x0/JPEG/1280/Z100/?" +
                  response.value.urlRur
              );

            // Новый сайт для получения иксов, crm и гугл и яндекс индексаций
            var siteDate = "https://api.whois.vu/?q=" + response.value.url;
            fetch(siteDate, {
              method: "GET",
            })
              .then((newresponse) => {
                return newresponse.text();
              })
              .then((newresponse) => {
                let data = JSON.parse(newresponse); //Переобразуем дату в переменную
                date = new Date(data.created * 1000);
                let minusMonth = 0;
                if(new Date().getMonth() < date.getMonth())
                  minusMonth = 1
                globalDate =
                  " " + (new Date().getFullYear() - date.getFullYear() - minusMonth) + " лет";
                let curMonth = new Date().getMonth() * 30;
                globalDate += " " + (curMonth + date.getDate()) + " дней";
                document.querySelector('p[data-id="globalDate"]').textContent =
                  globalDate;
              });

            var siteinfo = "https://a.pr-cy.ru/" + response.value.url + "/";
            fetch(siteinfo, {
              method: "GET",
            })
              .then((newresponse) => {
                return newresponse.text();
              })
              .then((newresponse) => {
                let iks = newresponse
                  .split(
                    "https://webmaster.yandex.ru/sqi/?host=" +
                      response.value.url +
                      ""
                  )[1]
                  .split('noreferrer">')[1]
                  .split("</a>")[0];

                if (iks.includes("<span>"))
                  document.querySelector(
                    'p[data-id="id_response"]'
                  ).textContent = "не найден";
                else
                  document.querySelector(
                    'p[data-id="id_response"]'
                  ).textContent = iks;

                document.querySelector('p[data-id="yandex"]').textContent =
                  newresponse
                    .split(
                      "https://yandex.ru/yandsearch?text=host%3A" +
                        response.value.url +
                        "*%20%7C%20host%3Awww." +
                        response.value.url +
                        "*"
                    )[1]
                    .split('noreferrer">')[1]
                    .split("</a")[0];

                let googleRes = newresponse
                  .split(
                    "https://www.google.com/search?q=site:" +
                      response.value.url +
                      ""
                  )[1]
                  .split('noreferrer">')[1]
                  .split("</a")[0];

                document.querySelector('p[data-id="google"]').textContent =
                  googleRes;

                if (newresponse.split("<h3>CMS</h3>")[1]) {
                  document.querySelector('p[data-id="id_cms"]').textContent =
                    newresponse
                      .split("<h3>CMS</h3>")[1]
                      .split("</div>")[1]
                      .split("</div>")[0];
                } else {
                  document.querySelector('p[data-id="id_cms"]').textContent =
                    "не найдена";
                }
              });

            //диаграмма canvas конетент
            var myCanvas = document.getElementById("myCanvas");
            myCanvas.width = 70;
            myCanvas.height = 70;

            var analysis = document.getElementById("analysis");
            analysis.width = 185;
            analysis.height = 185;

            var myVinyls = {
              alt: response.value.altCountTotal,
              title: response.value.imgWithOutTitle,
            };

            var Piechart = function (options) {
              this.options = options;
              this.canvas = options.canvas;
              this.ctx = this.canvas.getContext("2d");
              this.colors = options.colors;

              this.draw = function () {
                var total_value = 0;
                var color_index = 0;
                for (var categ in this.options.data) {
                  var val = this.options.data[categ];
                  total_value += val;
                }

                var start_angle = Math.PI * 1.5;
                for (categ in this.options.data) {
                  val = this.options.data[categ];
                  var slice_angle = (2 * Math.PI * val) / total_value;

                  drawPieSlice(
                    this.ctx,
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    Math.min(this.canvas.width / 2, this.canvas.height / 2),
                    start_angle,
                    start_angle + slice_angle,
                    this.colors[color_index % this.colors.length]
                  );

                  start_angle += slice_angle;
                  color_index++;
                }

                //drawing a white circle over the chart
                //to create the doughnut chart
                if (this.options.doughnutHoleSize) {
                  drawPieSlice(
                    this.ctx,
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    this.options.doughnutHoleSize *
                      Math.min(this.canvas.width / 2, this.canvas.height / 2),
                    0,
                    2 * Math.PI,
                    "#F6F7FA"
                  );
                }
                start_angle = 1.5 * Math.PI;
                for (categ in this.options.data) {
                  val = this.options.data[categ];
                  slice_angle = (2 * Math.PI * val) / total_value;
                  var pieRadius = Math.min(
                    this.canvas.width / 2,
                    this.canvas.height / 2
                  );
                  var labelX =
                    (this.canvas.width - 6 * val.toString().length) / 2 +
                    (pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
                  var labelY =
                    (this.canvas.height + 2) / 2 +
                    (pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);

                  this.ctx.fillStyle = "white";
                  this.ctx.font = "normal 14px Mont-Bold";
                  if (this.options.doughnutHoleSize) {
                    val = val + " из 10";

                    labelX = this.canvas.width / 2 - val.length * 5;
                    labelY = this.canvas.height / 2 + 5;
                    this.ctx.fillStyle = "black";
                    this.ctx.font = "normal 25px Mont-Bold";
                    if (categ == "end") continue;
                  }

                  if (this.options.fullCheck) {
                    val = val + "%";
                    labelX = this.canvas.width / 2 - val.length * 4;
                    labelY = this.canvas.height / 2 + 5;
                  }

                  if (this.options.doneCheck) {
                    val = "0%";
                    labelX = this.canvas.width / 2 - val.length * 4;
                    labelY = this.canvas.height / 2 + 5;
                  }

                  this.ctx.fillText(val, labelX, labelY);
                  start_angle += slice_angle;
                }
              };
            };
            let imgColors = ["#F3814B", "#52388E"];
            let fullCheck = false;
            let doneCheck = false;

            if (
              myVinyls.alt == response.value.imgOnlyCount &&
              myVinyls.title == response.value.imgOnlyCount &&
              response.value.imgOnlyCount !== 0
            ) {
              myVinyls = {
                full: 100,
              };

              imgColors = ["#DB4437"];
              fullCheck = true;
            }

            if (myVinyls.alt == 0 && myVinyls.title == 0) {
              myVinyls = {
                full: 100,
              };

              imgColors = ["#0F9D58"];
              doneCheck = true;
            }

            var myPiechart = new Piechart({
              canvas: myCanvas,
              data: myVinyls,
              colors: imgColors,
              fullCheck: fullCheck,
              doneCheck: doneCheck,
            });
            myPiechart.draw();

            let analysisResult = 0;

            //https
            if (response.value.urlProt == "https:") analysisResult += 1;

            //ttile
            if (response.value.titlecount >= 20) analysisResult += 1;

            //description
            if (response.value.descriptioncount >= 100) analysisResult += 1;

            //h1
            if (response.value.h1Count == 1) analysisResult += 1;

            //robots meta
            if (
              !response.value.robotsInt ||
              response.value.robotsTags == "index, follow"
            )
              analysisResult += 1;

            //link__in
            if (response.value.link__in >= 3 && response.value.link__in <= 15)
              analysisResult += 0.5;

            //link__out
            if (response.value.link__outForSeo.length < 3) analysisResult += 0.7;

            //Кол-во символов с пробелом
            if (response.value.allCount >= 1300) analysisResult += 0.6;

            //img
            if (response.value.imgOnlyCount >= 4) analysisResult += 0.6;

            //Изображений без alt
            if (response.value.altCountTotal < 3) analysisResult += 0.6;

            //Изображений без title
            if (response.value.titlecount < 3) analysisResult += 0.3;

            //video
            if (response.value.videos >= 1) analysisResult += 0.6;
            //ul ol table
            if (response.value.ulOltable >= 1) analysisResult += 0.6;

            //h2
            if (response.value.h2Count >= 1) analysisResult += 0.3;

            //h3
            if (response.value.h3Count >= 1) analysisResult += 0.2;

            analysisResult = Math.round(analysisResult);

            let graficColor;
            let resSpan = document.getElementById("analysisResult");
            if (analysisResult <= 4) {
              resSpan.classList.add("red");
              resSpan.textContent = "Плохо";
              graficColor = "#DB4437";
            } else if (analysisResult >= 8) {
              resSpan.classList.add("green");
              resSpan.textContent = "Хорошо";
              graficColor = "#0F9D58";
            } else {
              resSpan.classList.add("yellow");
              resSpan.textContent = "Средне";
              graficColor = "#E0A22A";
            }

            var analysis = new Piechart({
              canvas: analysis,
              data: {
                start: analysisResult,
                end: 10 - analysisResult,
              },
              colors: [graficColor, "#ECEDF0"],
              doughnutHoleSize: 0.75,
            });
            analysis.draw();

            const rows = [
              ["name1", "city1", "some other info"],
              ["name2", "city2", "more info"],
            ];

            let csvContent =
              "data:text/csv;charset=utf-8," +
              rows.map((e) => e.join(",")).join("\n");

            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_data.csv");
            document.body.appendChild(link); // Required for FF

            function drawPieSlice(
              ctx,
              centerX,
              centerY,
              radius,
              startAngle,
              endAngle,
              color
            ) {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.arc(centerX, centerY, radius, startAngle, endAngle);
              ctx.closePath();
              ctx.fill();
            }
          });
        }
      }
    );
  });
});
//}

var tabNavs = document.querySelectorAll(".nav-tab");
var tabPanes = document.querySelectorAll(".tab-pane");

for (var i = 0; i < tabNavs.length; i++) {
  tabNavs[i].addEventListener("click", function (e) {
    e.preventDefault();
    var activeTabAttr = e.target.getAttribute("data-tab");

    for (var j = 0; j < tabNavs.length; j++) {
      var contentAttr = tabPanes[j].getAttribute("data-tab-content");

      if (activeTabAttr === contentAttr) {
        tabNavs[j].classList.add("active");
        tabPanes[j].classList.add("active");
      } else {
        tabNavs[j].classList.remove("active");
        tabPanes[j].classList.remove("active");
      }
    }
  });
}

//browser
function getDocumentInfo() {
  // Получение всех приближенных к тегу body элементов
  let allBody = document.querySelectorAll("body > *");
  // Идентификатор хидера и футера по-умолчанию минималные
  var headerId = 0;
  var mobileId = 0;
  var sideId = 0;
  var navId = 0;
  var footerId = allBody.length - 1;
  for (let i = 0; i < allBody.length; i++) {
    var liClasses = [].slice.apply(allBody[i].classList).join(";");
    // Проверка что элемент не является хидером
    if (
      allBody[i].id == "header" ||
      allBody[i].id.includes("header") ||
      allBody[i].tagName == "HEADER" ||
      liClasses.includes("header")
    ) {
      headerId = i;
    }

    // Проверка что элемент не является футером
    if (
      allBody[i].id == "footer" ||
      allBody[i].id.includes("footer") ||
      allBody[i].tagName == "FOOTER" ||
      liClasses.includes("footer")
    ) {
      footerId = i;
    }

    if (
      allBody[i].id == "mobile" ||
      allBody[i].id.includes("mobile") ||
      liClasses.includes("mobile")
    ) {
      mobileId = i;
    }

    if (
      allBody[i].id == "nav" ||
      allBody[i].id.includes("nav") ||
      allBody[i].tagName == "NAV" ||
      liClasses.includes("nav")
    ) {
      navId = i;
    }

    if (
      allBody[i].id == "side" ||
      allBody[i].id.includes("side") ||
      liClasses.includes("side")
    ) {
      sideId = i;
    }
  }

  // Создание элемента body
  let newBody = document.createElement("body");
  for (let i = 0; i < allBody.length; i++) {
    // Проверка что id находится между хидером и футером
    if (
      i > headerId &&
      i < footerId &&
      i !== mobileId &&
      i !== sideId &&
      i !== navId
    ) {
      // Клонирование в новый body всех элементов
      newBody.appendChild(allBody[i].cloneNode(true));
    }
  }

  let title = document.title;
  let tableAr = [];
  let titlecount = title.length;
  let description = document.querySelector('meta[name="description"]')?.content;
  if (!description) {
    description = "Описание отсутсвует";
  }
  let descriptioncount = description.length;
  let keywords = document.querySelector('meta[name="keywords"]')?.content;
  if (!keywords) {
    keywords = "Ключевые слова отсутвуют";
  }

  // Пример обращения к новому body
  let h1 = document.getElementsByTagName("h1")[0]?.textContent; //newBody
  if (!h1) {
    h1 = "Тег h1 отсутвует";
  }
  let autourl = window.location.href;
  let canonical = document.querySelector("link[rel='canonical']")?.href;
  if (!canonical) {
    canonical = "Сanonical tag отсутвует";
  }

  let robotsInt = false;
  let robotsTags = document.querySelector('meta[name="robots"]')?.getAttribute('content');
  if (!robotsTags) {
    robotsTags = "Robots tag отсутвует";
  } else {
    robotsInt = true;
  }
  let h1Count = document.getElementsByTagName("h1").length; //newBody
  let h2Count = document.getElementsByTagName("h2").length; //newBody
  let h3Count = document.getElementsByTagName("h3").length; //newBody
  let h4Count = document.getElementsByTagName("h4").length; //newBody
  let h5Count = document.getElementsByTagName("h5").length; //newBody
  let h6Count = document.getElementsByTagName("h6").length; //newBody
  //только тег img
  let imgOnlyCount = newBody.getElementsByTagName("img").length;
  //только тег alt
  let imgCount = newBody.getElementsByTagName("img");
  let altCount = [];
  let altCountNone = [];
  let altCountSlash = [];
  let altCountTotal = [];
  let imgWithOutTitle = [];
  let video = newBody.getElementsByTagName("video");
  let iframe = newBody.getElementsByTagName("iframe");
  let videos = [];
  let ul = newBody.getElementsByTagName("ul").length;
  let ol = newBody.getElementsByTagName("ol").length;
  let list = ul + ol;
  let table = newBody.getElementsByTagName("table").length;
  let ulOltable = list + table;
  let all = newBody.querySelectorAll("*");
  let allCount = 0;
  for (let i = 0; i < all.length; i++) {
    if (all[i].textContent) {
      if(all[i].offsetLeft >= 0 && all[i].tagName !== 'SCRIPT' && all[i].querySelectorAll('*').length == 0) {
        allCount += all[i].textContent.trim().length;
      }
    }
  }
  
  let symbols = document.querySelectorAll("*");
  let symbolsCount = 0;
  for (let i = 0; i < symbols.length; i++) {
    if (symbols[i].textContent) symbolsCount += symbols[i].textContent.length;
  }

  var content = [];

  tableAr.push({
    first: "Заголовки",
    second: "",
    third: "",
  });

  tableAr.push({
    first: "Тег",
    second: "Содержимое",
    third: "",
  });

  document.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(function (item) {
    //
    if (item.tagName == "H2") {
      content.push(
        "&mdash;" +
          "&lt;" +
          item.tagName +
          "&gt;" +
          " " +
          item.textContent +
          "<br>"
      );
    } else if (item.tagName == "H3") {
      content.push(
        "&mdash;&mdash;" +
          "&lt;" +
          item.tagName +
          "&gt;" +
          " " +
          item.textContent +
          "<br>"
      );
    } else if (item.tagName == "H4") {
      content.push(
        "&mdash;&mdash;&mdash;" +
          "&lt;" +
          item.tagName +
          "&gt;" +
          " " +
          item.textContent +
          "<br>"
      );
    } else if (item.tagName == "H5") {
      content.push(
        "&mdash;&mdash;&mdash;&mdash;" +
          "&lt;" +
          item.tagName +
          "&gt;" +
          " " +
          item.textContent +
          "<br>"
      );
    } else if (item.tagName == "H6") {
      content.push(
        "&mdash;&mdash;&mdash;&mdash;&mdash;" +
          "&lt;" +
          item.tagName +
          "&gt;" +
          " " +
          item.textContent +
          "<br>"
      );
    } else {
      content.push(
        "&lt;" + item.tagName + "&gt;" + " " + item.textContent + "<br>"
      );
    }
    //content.push(item.tagName + " " + item.textContent + "<br>");
    tableAr.push({
      tag: item.tagName,
      content: item.textContent,
    });
  });

  let link__in = Array.from(newBody.getElementsByTagName("a")).filter(
    (i) => i.hostname == document.domain
  );

  tableAr.push({
    first: "",
    second: "",
    third: "",
  });
  tableAr.push({
    first: "",
    second: "",
    third: "",
  });
  tableAr.push({
    first: "",
    second: "",
    third: "",
  });

  tableAr.push({
    first: "Внутренняя перелинковка",
    second: "",
    third: "",
  });

  tableAr.push({
    donor: "Донор",
    anchor: "Анкор",
    acceptor: "Акцептор",
  });

  for (let i = 0; i < link__in.length; i++) {
    tableAr.push({
      donor: window.location.href,
      anchor: link__in[i].textContent,
      acceptor: link__in[i].href,
    });
  }

  link__in = link__in.map((i) => i.href);

  //внешний link для сео анализа
  let link__outForSeo = Array.from(newBody.getElementsByTagName("a"))
    .filter((i) => i.hostname !== document.domain)
    .filter((i) => i.href.includes("http"));

    
    let link__out = Array.from(document.getElementsByTagName("a")) //newBody
    .filter((i) => i.hostname !== document.domain)
    .filter((i) => i.href.includes("http"));
    
  tableAr.push({
    first: "",
    second: "",
    third: "",
  });
  tableAr.push({
    first: "",
    second: "",
    third: "",
  });
  tableAr.push({
    first: "",
    second: "",
    third: "",
  });

  tableAr.push({
    first: "Внешняя перелинковка",
    second: "",
    third: "",
  });

  tableAr.push({
    donor: "Донор",
    anchor: "Анкор",
    acceptor: "Акцептор",
  });

  for (let i = 0; i < link__out.length; i++) {
    tableAr.push({
      donor: window.location.href,
      anchor: link__out[i].textContent,
      acceptor: link__out[i].href,
    });
  }

  link__out = link__out.map((i) => i.href);

  let link__out__inst = Array.from(document.getElementsByTagName("a"))
    .filter((i) => i.hostname.includes("instagram"))
    .filter((i) => !i.href.includes("share"))
    .map((i) => i.href);

  let link__out__face = Array.from(document.getElementsByTagName("a"))
    .filter((i) => i.hostname.includes("facebook"))
    .filter((i) => !i.href.includes("share"))
    .map((i) => i.href);

  let link__out__twitter = Array.from(document.getElementsByTagName("a"))
    .filter((i) => i.hostname.includes("twitter"))
    .filter((i) => !i.href.includes("share"))
    .map((i) => i.href);

  let link__out__ok = Array.from(document.getElementsByTagName("a"))
    .filter((i) => i.hostname.includes("ok.ru"))
    .filter((i) => !i.href.includes("share"))
    .map((i) => i.href);

  let link__out__tiktok = Array.from(document.getElementsByTagName("a"))
    .filter((i) => i.hostname.includes("tiktok"))
    .filter((i) => !i.href.includes("share"))
    .map((i) => i.href);

  let link__out__vk = Array.from(document.getElementsByTagName("a"))
    .filter((i) => i.hostname.includes("vk.com"))
    .filter((i) => !i.href.includes("vk.com/share"))
    .map((i) => i.href);

  let link__out__youtube = Array.from(document.getElementsByTagName("a"))
    .filter(
      (i) =>
        i.hostname.includes("youtube.com/channel/") ||
        i.hostname.includes("youtube.com/c/") ||
        i.hostname.includes("youtu.be/channel/") ||
        i.hostname.includes("youtu.be/c/")
    )
    .map((i) => i.href);

  let link__out__telegram = Array.from(document.getElementsByTagName("a"))
    .filter((i) => i.hostname.includes("t.me"))
    .filter((i) => !i.href.includes("share"))
    .map((i) => i.href);

  let link__out__whats = Array.from(document.getElementsByTagName("a"))
    .filter(
      (i) => i.hostname.includes("whatsapp") || i.hostname.includes("wa.me")
    )
    .filter((i) => !i.href.includes("share"))
    .map((i) => i.href);

  let link__out__viber = Array.from(document.getElementsByTagName("a"))
    .filter((i) => i.hostname.includes("viber"))
    .filter((i) => !i.href.includes("share"))
    .map((i) => i.href);

  let link__out__rutube = Array.from(document.getElementsByTagName("a"))
    .filter((i) => i.hostname.includes("rutube"))
    .filter((i) => !i.href.includes("share"))
    .map((i) => i.href);

  let link__out__zen = Array.from(document.getElementsByTagName("a"))
    .filter((i) => i.hostname.includes("zen.yandex"))
    .filter((i) => !i.href.includes("share"))
    .map((i) => i.href);

  tableAr.push({
    first: "",
    second: "",
    third: "",
  });

  tableAr.push({
    first: "",
    second: "",
    third: "",
  });

  tableAr.push({
    first: "",
    second: "",
    third: "",
  });



  tableAr.push({
    first: "Картинки",
    second: "",
    third: "",
  });

  tableAr.push({
    src: "src",
    alt: "alt",
    title: "title",
  });

  for (let i = 0; i < imgCount.length; i++) {
    if (
      imgCount[i].getAttribute("alt")?.length <= 5 ||
      imgCount[i].getAttribute("alt") == "/" ||
      imgCount[i].getAttribute("alt") == " " ||
      !imgCount[i].hasAttribute("alt")
    ) {
      altCountTotal.push(imgCount[i]);
    }

    if (
      imgCount[i].getAttribute("title") == " " ||
      !imgCount[i].hasAttribute("title") ||
      imgCount[i].getAttribute("title")?.length <= 5
    ) {
      imgWithOutTitle.push(imgCount[i]);
    }

    tableAr.push({
      src: imgCount[i].getAttribute("src"),
      alt: imgCount[i].getAttribute("alt"),
      title: imgCount[i].getAttribute("title"),
    });
  }

  for (let i = 0; i < video.length; i++) {
    if (video[i].hasAttribute("src")) {
      if (
        video[i].getAttribute("src").includes("youtube") ||
        video[i].getAttribute("src").includes("vimeo") ||
        video[i].getAttribute("src").includes("rutube") ||
        video[i].getAttribute("src").includes("vk.com/video") ||
        video[i].getAttribute("src").includes(".mp4") ||
        video[i].getAttribute("src").includes(".webm") ||
        video[i].getAttribute("src").includes(".ogv") ||
        video[i].getAttribute("src").includes(".swf") ||
        video[i].getAttribute("src").includes(".avi") ||
        video[i].getAttribute("src").includes(".mov") ||
        video[i].getAttribute("src").includes(".3gp") ||
        video[i].getAttribute("src").includes(".wmv") ||
        video[i].getAttribute("src").includes(".mkv")
      )
        videos.push(video[i]);
    }
  }

  for (let i = 0; i < iframe.length; i++) {
    if (iframe[i].hasAttribute("src")) {
      if (
        iframe[i].getAttribute("src").includes("youtube") ||
        iframe[i].getAttribute("src").includes("vimeo") ||
        iframe[i].getAttribute("src").includes("rutube") ||
        iframe[i].getAttribute("src").includes("vk.com/video") ||
        iframe[i].getAttribute("src").includes(".mp4") ||
        iframe[i].getAttribute("src").includes(".webm") ||
        iframe[i].getAttribute("src").includes(".ogv") ||
        iframe[i].getAttribute("src").includes(".swf") ||
        iframe[i].getAttribute("src").includes(".avi") ||
        iframe[i].getAttribute("src").includes(".mov") ||
        iframe[i].getAttribute("src").includes(".3gp") ||
        iframe[i].getAttribute("src").includes(".wmv") ||
        iframe[i].getAttribute("src").includes(".mkv")
      )
        videos.push(iframe[i]);
    }
  }

  //проверка на файлы

  let Robots = false;
  var http = new XMLHttpRequest();
  http.open("HEAD", "/robots.txt", false);
  http.send();
  if (http.status !== 404 && http.status !== 418 && http.status !== 406)
    Robots = window.location.origin + "/robots.txt";

  let Sitemap = false;
  var httpS = new XMLHttpRequest();
  httpS.open("HEAD", "/sitemap.xml", false);
  httpS.send();
  if (httpS.status !== 404 && httpS.status !== 418 && httpS.status !== 406)
    Sitemap = window.location.origin + "/sitemap.xml";

  altCountTotal = altCountTotal.length;
  imgWithOutTitle = imgWithOutTitle.length;
  altCount = altCount.length;
  altCountNone = altCountNone.length;
  altCountSlash = altCountSlash.length;
  videos = videos.length;
  link__in = link__in.length;
  link__out = link__out.length;

  //
  let links = newBody.getElementsByTagName("link");
  let cssCount = 0;
  let jsCount = 0;
  for (let i = 0; i < links.length; i++) {
    if (/\.css$/.test(links[i].href)) cssCount++;
    if (/\.js$/.test(links[i].href)) jsCount++;
  }

  var curUrl = window.location.host;

  let message = {
    mes:
      "title=" +
      title +
      "\n" +
      "h1Count=" +
      h1Count +
      "\n" +
      "h2Count=" +
      h2Count +
      "\n" +
      "h3Count=" +
      h3Count +
      "\n" +
      "h4Count=" +
      h4Count +
      "\n" +
      "h5Count=" +
      h5Count +
      "\n" +
      "h6Count=" +
      h6Count +
      "\n" +
      "imgOnlyCount=" +
      imgOnlyCount +
      "\n" +
      "altCount=" +
      altCount +
      "\n" +
      "altCountNone=" +
      altCountNone +
      "\n" +
      "altCountSlash=" +
      altCountSlash +
      "\n" +
      "cssCount=" +
      cssCount +
      "\n" +
      "jsCount=" +
      jsCount +
      "'\n", //+
    //"domain age=" + globalDate,
    title: title,
    description: description,
    keywords: keywords,
    h1: h1,
    autourl: autourl,
    canonical: canonical,
    robotsTags: robotsTags,
    titlecount: titlecount,
    descriptioncount: descriptioncount,
    url: curUrl, //страница контент
    imgOnlyCount: imgOnlyCount,
    altCountTotal: altCountTotal,
    imgWithOutTitle: imgWithOutTitle,
    videos: videos,
    link__in: link__in,
    link__out: link__out,
    link__out__inst: link__out__inst,
    link__out__face: link__out__face,
    link__out__ok: link__out__ok,
    link__out__rutube: link__out__rutube,
    link__out__telegram: link__out__telegram,
    link__out__tiktok: link__out__tiktok,
    link__out__twitter: link__out__twitter,
    link__out__viber: link__out__viber,
    link__out__vk: link__out__vk,
    link__out__youtube: link__out__youtube,
    link__out__whats: link__out__whats,
    link__out__zen: link__out__zen,
    link__outForSeo: link__outForSeo,
    symbolsCount: symbolsCount,
    h1Count: h1Count,
    h2Count: h2Count,
    h3Count: h3Count,
    h4Count: h4Count,
    h5Count: h5Count,
    h6Count: h6Count,
    list: list,
    table: table,
    content: content,
    Robots: Robots,
    Sitemap: Sitemap,
    urlOrigin: window.location.origin,
    urlRur: window.location.href,
    urlProt: window.location.protocol,
    robotsInt: robotsInt,
    allCount: allCount,
    ulOltable: ulOltable,
    tableImg: tableAr,
  };

  chrome.runtime.sendMessage({ method: "set", value: message }, () => {});
}
