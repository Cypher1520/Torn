// ==UserScript==
// @name                Torn: BS %
// @version             1.0
// @author              Cypher [2641265]
// @description         Shows stat% on main page, extracted from old "Alteracoes" script from Magnoes
// @match               https://www.torn.com/index.php
// @require             https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant               GM_addStyle
// ==/UserScript==

if (document.location.href.match(/\/index\.php$/)) {
  var link;
  var ratio;
  var jailed;
  var speedNode = null;
  var speedValue = null;
  var speedNodeName = null;
  var strengthNode = null;
  var strengthValue = null;
  var strengthNodeName = null;
  var defenceNode = null;
  var defenceValue = null;
  var defenceNodeName = null;
  var dexterityNode = null;
  var dexterityValue = null;
  var dexterityNodeName = null;
  var totalNode = null;
  var totalValue = null;
  var totalNodeName = null;
  var level;
  var faction;
  var nick;
  var id;
  var strengthMod = null;
  var strengthSign = null;
  var effStrength = null;
  var defMod = null;
  var defSign = null;
  var effDef = null;
  var speedMod = null;
  var speedSign = null;
  var effSpeed = null;
  var dexMod = null;
  var dexSign = null;
  var effDex = null;
  var faction_out;

  //determina id da Faction
  if (
    !$("#skip-to-content")
      .text()
      .match(
        /Traveling|Mexico|Canada|Cayman|Kingdom|Switzerland|UAE|Dubai|South|Argentina|Hawaii|Japan|China/
      )
  ) {
    if (
      $("div[id^=item]:has(>div.title-black:contains('Faction'))").find(
        "a.href.t-blue"
      ).length > 0
    )
      idFacao = $("div[id^=item]:has(>div.title-black:contains('Faction'))")
        .find("a.href.t-blue")
        .attr("href")
        .match(/(\d+)/)[0];

    GM_setValue("idFacao", idFacao);

    level = $('[class^="name"]:contains("Level")').next().text();
    nick = $('[class^="menu-value"]').text();
    id = $('[class^="menu-value"]').attr("href").match(/(\d+)/)[0];

    faction_out = $(
      "div[id^=item]:has(>div.title-black:contains('Faction Information'))"
    )
      .find("a")
      .text();

    //get stats -- selector adapted to tornstats script
    $(
      "div[id^=item]:has(>div.title-black:contains('Battle Stats'))>div.bottom-round>div.cont-gray.battle,div[id=vinkuun-tornStats-BattleStats]:has(>div.title-black:contains('Battle Stats'))"
    )
      .find("ul.info-cont-wrap>li:lt(5)")
      .each(function () {
        var statNode = $(this).find("span.desc");
        var statValue = statNode.text().replace(/[^0-9.]/g, "");
        var statMod = $(this).find("span.mod").text().replace(/\s/g, "");
        var statName = $(this).find("span.divider").text();
        var statNameNode = $(this).find("span.divider");

        if (statName.match(/Speed/)) {
          speedValue = 1 * statValue;
          speedNode = statNode;
          speedMod = statMod;
          speedNodeName = statNameNode;
        }
        if (statName.match(/Strength/)) {
          strengthValue = 1 * statValue;
          strengthNode = statNode;
          strengthMod = statMod;
          strengthNodeName = statNameNode;
        }
        if (statName.match(/Defense/)) {
          defenceValue = 1 * statValue;
          defenceNode = statNode;
          defMod = statMod;
          defenceNodeName = statNameNode;
        }
        if (statName.match(/Dexterity/)) {
          dexterityValue = 1 * statValue;
          dexterityNode = statNode;
          dexMod = statMod;
          dexterityNodeName = statNameNode;
        }
        if (statName.match(/Total/)) {
          totalValue = 1 * statValue;
          totalNode = statNode;
          totalNodeName = statNameNode;
        }

        $(this).find("span.divider").attr("style", "width: 153px;"); //153 -> 174  //193
        statNode.css("width", "146px"); //136 -> 145  //136
      });

    //Adds stat percentage
    if (
      speedValue &&
      strengthValue &&
      defenceValue &&
      dexterityValue &&
      percStats == "1"
    ) {
      if (speedNode && strengthNode && defenceNode && dexterityNode) {
        var novoNode = $(
          "<span class='descCopiedStyleFrom_desc_becauseOfTornStatsSubmit' style='color:#007bff; width:52px; padding-top: 5px; padding-right: 8px; padding-bottom: 5px; padding-left: 0px; border-right-width: 1px; border-right-style: solid; border-right-color: rgb(221, 221, 221); text-align: right; white-space: nowrap; overflow-x: hidden; overflow-y: hidden; text-overflow: ellipsis; vertical-align: top; display: inline-block; line-height: 14px;'></span>"
        );
        speedNode.css("width", "121px");
        speedNodeName.css("width", "117px");
        strengthNode.css("width", "121px");
        strengthNodeName.css("width", "117px");
        defenceNode.css("width", "121px");
        defenceNodeName.css("width", "117px");
        dexterityNode.css("width", "121px");
        dexterityNodeName.css("width", "117px");
        totalNode.css("width", "121px");
        totalNodeName.css("width", "117px");

        speedNode.after(
          novoNode.text(
            " (" + Math.round((10000 * speedValue) / totalValue) / 100 + "%)"
          )
        );
        strengthNode.after(
          novoNode
            .clone()
            .text(
              " (" +
                Math.round((10000 * strengthValue) / totalValue) / 100 +
                "%)"
            )
        );
        defenceNode.after(
          novoNode
            .clone()
            .text(
              " (" +
                Math.round((10000 * defenceValue) / totalValue) / 100 +
                "%)"
            )
        );
        dexterityNode.after(
          novoNode
            .clone()
            .text(
              " (" +
                Math.round((10000 * dexterityValue) / totalValue) / 100 +
                "%)"
            )
        );
      }
      //save stats in memory
      GM_setValue("speedValue", speedValue.toString());
      GM_setValue("strengthValue", strengthValue.toString());
      GM_setValue("defenceValue", defenceValue.toString());
      GM_setValue("dexterityValue", dexterityValue.toString());
    }

    speedValue = Math.round(speedValue);
    strengthValue = Math.round(strengthValue);
    defenceValue = Math.round(defenceValue);
    dexterityValue = Math.round(dexterityValue);
    totalValue = Math.round(totalValue);
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    if (dia < 10) dia = "0" + dia;
    if (mes < 10) mes = "0" + mes;
    var mesSub = ano.toString() + mes.toString();
    var today = mesSub.toString() + dia.toString();

    //Statistical usage: id/nick/faction sent. For clarify in plain text. Just once a day is enough
    //       if(usageDay != today){
    //          requestPage4('http://www.torntuga.com/pt/stats/temp.php?id=' + id + '&nome=' + nick + '&faccao=' + faction_out + '&version=' + alt_versao);
    //         GM_setValue('usageDay', today);
    //      }

    //Effective Battle Stats
    if (effstats == "1") {
      speedSign = speedMod.charAt(0).replace("−", "-");
      speedMod = speedMod.match(/\d+/)[0] * 1;
      effSpeed = eval(
        speedValue + speedSign + (speedValue * speedMod) / 100
      ).toFixed(0);

      strengthSign = strengthMod.charAt(0).replace("−", "-");
      strengthMod = strengthMod.match(/\d+/)[0] * 1;
      effStrength = eval(
        strengthValue + strengthSign + (strengthValue * strengthMod) / 100
      ).toFixed(0);

      defSign = defMod.charAt(0).replace("−", "-");
      defMod = defMod.match(/\d+/)[0] * 1;
      effDef = eval(
        defenceValue + defSign + (defenceValue * defMod) / 100
      ).toFixed(0);

      dexSign = dexMod.charAt(0).replace("−", "-");
      dexMod = dexMod.match(/\d+/)[0] * 1;
      effDex = eval(
        dexterityValue + dexSign + (dexterityValue * dexMod) / 100
      ).toFixed(0);

      var novoUL = $('<ul class="info-cont-wrap"></ul>');

      var effectiveColor = dark_mode
        ? "color: rgb(77, 196, 85)"
        : "color: rgb(18, 129, 81);";

      novoUL.append(
        $(
          '<li><span class="divider"><span>Strength:</span></span><span class="desc" style="' +
            effectiveColor +
            '">' +
            fmtNumber(effStrength) +
            "</span></li>"
        )
      );
      novoUL.append(
        $(
          '<li><span class="divider"><span>Defense:</span></span><span class="desc" style="' +
            effectiveColor +
            '">' +
            fmtNumber(effDef) +
            "</span></li>"
        )
      );
      novoUL.append(
        $(
          '<li><span class="divider"><span>Speed:</span></span><span class="desc" style="' +
            effectiveColor +
            '">' +
            fmtNumber(effSpeed) +
            "</span></li>"
        )
      );
      novoUL.append(
        $(
          '<li><span class="divider"><span>Dexterity:</span></span><span class="desc" style="' +
            effectiveColor +
            '">' +
            fmtNumber(effDex) +
            "</span></li>"
        )
      );

      var effTotal = effStrength * 1 + effDef * 1 + effSpeed * 1 + effDex * 1;

      novoUL.append(
        $(
          '<li class="last"><span class="divider"><span>Total:</span></span><span class="desc">' +
            fmtNumber(effTotal.toFixed(0)) +
            "</span></li>"
        )
      );

      var novoDivGray = $('<div class="cont-gray battle bottom-round">').append(
        novoUL
      );

      var novoDivTopo = $(
        '<div class="sortable-box t-blue-cont h"><div class="title title-black active top-round"><div class="arrow-wrap"><i class="accordion-header-arrow right"></i></div>Effective Battle Stats</div></div>'
      ).append(novoDivGray);

      $(
        "div[id^=item]:has(>div.title-black:contains('Battle Stats')), div[id=vinkuun-tornStats-BattleStats]:has(>div.title-black:contains('Battle Stats'))"
      ).after(novoDivTopo);
    }

    //Add flower prices from travelrun
    if (flowerprices == "1") {
      var novoDivTopo = $(
        '<div class="sortable-box t-blue-cont h"></div>'
      ).append(
        '<div class="title title-black active top-round"><div class="arrow-wrap"><i class="accordion-header-arrow right"></i></div>Flowers Information</div>'
      );
      var novoDivBase = $('<div class="bottom-round"></div>');
      var novoDivGray = $('<div class="cont-gray bottom-round"></div>');
      var novoUL = $('<ul class="info-cont-wrap"></ul>');

      //bloco por flor
      novoUL.append(flowerLine("Dahlia (Mexico)", "f260"));
      novoUL.append(flowerLine("Crocus (Canada)", "f263"));
      novoUL.append(flowerLine("Banana Orchid (Cayman Islands)", "f617"));
      novoUL.append(flowerLine("Orchid (Hawaii)", "f264"));
      novoUL.append(flowerLine("Heather (United Kingdom)", "f267"));
      novoUL.append(flowerLine("Ceibo Flower (Argentina)", "f271"));
      novoUL.append(flowerLine("Edelweiss (Switzerland)", "f272"));
      novoUL.append(flowerLine("Cherry Blossom (Japan)", "f277"));
      novoUL.append(flowerLine("Peony (China)", "f276"));
      novoUL.append(flowerLine("Tribulus Omanense (UAE)", "f385"));
      novoUL.append(flowerLine("African Violet (South Africa)", "f282"));

      novoUL.children(":last").addClass("last");

      novoDivGray.append(novoUL);
      novoDivBase.append(novoDivGray);
      novoDivTopo.append(novoDivBase);
      $(
        "div[id^=item]:has(>div.title-black:contains('Property Information'))"
      ).before(novoDivTopo);

      GM_xmlhttpRequest({
        method: "GET",
        url: "https://yata.yt/api/v1/travel/export/",
        headers: {
          "User-agent": "Mozilla/4.0 (compatible) Greasemonkey/0.3",
          Accept: "application/atom+xml,application/xml,text/xml",
        },
        synchronous: false,
        onload: function (response) {
          var flowersJSON = JSON.parse(response.responseText);

          $.each(flowersJSON.stocks, function (key, location) {
            $.each(location.stocks, function (order, item) {
              $("#f" + item.id).text(
                fmtNumber(item.quantity) + " - " + timeSince(location.update)
              );
            });
          });
        },
      });
    }

    //Add plushies prices from travelrun
    if (plushieprices == "1") {
      var novoDivTopo = $(
        '<div class="sortable-box t-blue-cont h"></div>'
      ).append(
        '<div class="title title-black active top-round"><div class="arrow-wrap"><i class="accordion-header-arrow right"></i></div>Plushies Information</div>'
      );
      var novoDivBase = $('<div class="bottom-round"></div>');
      var novoDivGray = $('<div class="cont-gray bottom-round"></div>');
      var novoUL = $('<ul class="info-cont-wrap"></ul>');

      //bloco por peluche
      novoUL.append(flowerLine("Jaguar Plushie (Mexico)", "f258"));
      novoUL.append(flowerLine("Wolverine Plushie (Canada)", "f261"));
      novoUL.append(flowerLine("Stingray Plushie (Cayman Islands)", "f618"));
      novoUL.append(flowerLine("Red Fox Plushie (United Kingdom)", "f268"));
      novoUL.append(flowerLine("Nessie Plushie (United Kingdom)", "f266"));
      novoUL.append(flowerLine("Monkey Plushie (Argentina)", "f269"));
      novoUL.append(flowerLine("Chamois Plushie (Switzerland)", "f273"));
      novoUL.append(flowerLine("Panda Plushie (China)", "f274"));
      novoUL.append(flowerLine("Camel Plushie (UAE)", "f384"));
      novoUL.append(flowerLine("Lion Plushie (South Africa)", "f281"));

      novoUL.children(":last").addClass("last");

      novoDivGray.append(novoUL);
      novoDivTopo.append(novoDivGray);
      $(
        "div[id^=item]:has(>div.title-black:contains('Property Information'))"
      ).before(novoDivTopo);

      GM_xmlhttpRequest({
        method: "GET",
        url: "https://yata.yt/api/v1/travel/export/",
        headers: {
          "User-agent": "Mozilla/4.0 (compatible) Greasemonkey/0.3",
          Accept: "application/atom+xml,application/xml,text/xml",
        },
        synchronous: false,
        onload: function (response) {
          var plushiesJSON = JSON.parse(response.responseText);

          $.each(plushiesJSON.stocks, function (key, location) {
            $.each(location.stocks, function (order, item) {
              $("#f" + item.id).text(
                fmtNumber(item.quantity) + " - " + timeSince(location.update)
              );
            });
          });
        },
      });
    }

    //Adiciona Awards de Crimes
    if (crimeMerits == "1") {
      $("div[id^=item]:has(>div.title-black:contains('Criminal Record'))")
        .find("li")
        .each(function (item) {
          var arr = null;
          var type = $(this).children(":first").text().trim();
          var desc = $(this).children(":last").text();
          var n = desc.replace(",", "");

          switch (type) {
            case "Other":
              type += " (nerve: 2)";
              arr = arrayOther;
              break;
            case "Illegal products":
              type = "Illegal products (nerve: 3, 16)";
              arr = arrayIllegal;
              break;
            case "Theft":
              type += " (nerve: 4, 5, 6, 7, 15)";
              arr = arrayThefts;
              break;
            case "Computer crimes":
              type += " (nerve: 9, 18)";
              arr = arrayVirus;
              break;
            case "Murder":
              type += " (nerve: 10)";
              arr = arrayMurder;
              break;
            case "Drug deals":
              type += " (nerve: 8)";
              arr = arrayDrugs;
              break;
            case "Fraud crimes":
              type = "Fraud (nerve: 11, 13, 14, 17)";
              arr = arrayFraud;
              break;
            case "Auto theft":
              type += " (nerve: 12)";
              arr = arrayGTA;
              break;
          }
          $(this).children(":first").text(type);

          if (arr != null) {
            var mink = -1;
            for (var k = 0; k < arr.length; ++k) {
              if (mink == -1 && arr[k][0] > n) mink = k;
            }
            if (mink >= 0) {
              //desc += '&nbsp;(' + arr[mink][1] + '&nbsp;--&nbsp;<b>' + (arr[mink][0] - n) + '</b>)';
              //desc = '<span style="float:left;width:30px;">'+desc+'</span><span style="font-style:italic;float:left;width:70px;">' + arr[mink][1] + '</span><span style="font-weight:bold;color:red;width:30px;float:right;text-align:right;">' + (arr[mink][0] - n) + '</span>';
              desc =
                '<span style="float:right;width:60px;">' +
                desc +
                '</span><span style="font-style:italic;float:right;width:75px;text-align:left;display:block;overflow:hidden;">' +
                arr[mink][1] +
                '</span><span style="font-weight:bold;color:red;width:35px;float:right;text-align:left;">' +
                (arr[mink][0] - n) +
                "</span>";
              $(this).children(":last").html(desc);
              $(this).children(":last").attr("title", desc);
            } else {
              $(this).children(":last").css("color", "green");
              //$(this).children(":last").html("<span style='float:left;width:30px;'>"+desc+"</span><span style='font-style:italic;float:left;width:100px'>Good job!</span>");
              $(this)
                .children(":last")
                .html(
                  "<span style='float:right;width:60px;'>" +
                    desc +
                    "</span><span style='font-style:italic;float:right;width:75px;text-align:left'>Good job!</span>"
                );
            }
          }
        });
    }

    //Fix text in personal perks
    $.each($("#personal-perks").find(".perks-desc"), function () {
      $(this).attr("title", $(this).html());
    });
  }
}
