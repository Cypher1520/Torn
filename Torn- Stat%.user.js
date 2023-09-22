// ==UserScript==
// @name                Torn: Stat%
// @version             1.0
// @author              Cypher [2641265]
// @description         Shows stat % distribution on main page.
// @match               https://www.torn.com/index.php
// @require             https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant               GM_addStyle
// ==/UserScript==

if(!api_key){
  api_key = get_api_key();
}

var dark_mode = $("#dark-mode-state").is(':checked');

if (document.location.href.match(/\/index\.php$/)) {
    var link;
    var ratio;
    var jailed;
    var speedNode = null;     var speedValue = null;     var speedNodeName = null;
    var strengthNode = null;  var strengthValue = null;  var strengthNodeName = null;
    var defenceNode = null;   var defenceValue = null;   var defenceNodeName = null;
    var dexterityNode = null; var dexterityValue = null; var dexterityNodeName = null;
    var totalNode = null;     var totalValue = null;     var totalNodeName = null;
    var level; var faction; var nick; var id;
    var strengthMod = null; var strengthSign = null; var effStrength = null;
    var defMod = null; var defSign = null; var effDef = null;
    var speedMod = null; var speedSign = null; var effSpeed = null;
    var dexMod = null; var dexSign = null; var effDex = null;
    var faction_out;

    //determina id da Faction
    if(! $("#skip-to-content").text().match(/Traveling|Mexico|Canada|Cayman|Kingdom|Switzerland|UAE|Dubai|South|Argentina|Hawaii|Japan|China/)){
        if( $("div[id^=item]:has(>div.title-black:contains('Faction'))").find("a.href.t-blue").length > 0 )
            idFacao = $("div[id^=item]:has(>div.title-black:contains('Faction'))").find("a.href.t-blue").attr('href').match(/(\d+)/)[0];

        GM_setValue('idFacao', idFacao);

        level = $('[class^="name"]:contains("Level")').next().text();
        nick = $('[class^="menu-value"]').text();
        id = $('[class^="menu-value"]').attr('href').match(/(\d+)/)[0];

        faction_out = $("div[id^=item]:has(>div.title-black:contains('Faction Information'))").find("a").text();

        //get stats -- selector adapted to tornstats script
        $("div[id^=item]:has(>div.title-black:contains('Battle Stats'))>div.bottom-round>div.cont-gray.battle,div[id=vinkuun-tornStats-BattleStats]:has(>div.title-black:contains('Battle Stats'))")
            .find("ul.info-cont-wrap>li:lt(5)").each(function(){
            var statNode  = $(this).find("span.desc");
            var statValue = statNode.text().replace(/[^0-9.]/g, '');
            var statMod   = $(this).find("span.mod").text().replace(/\s/g, '');
            var statName  = $(this).find("span.divider").text();
            var statNameNode = $(this).find("span.divider");

            if(statName.match(/Speed/)){
                speedValue = 1 * statValue; speedNode = statNode; speedMod = statMod; speedNodeName = statNameNode; }
            if(statName.match(/Strength/)){
                strengthValue = 1 * statValue; strengthNode = statNode; strengthMod = statMod; strengthNodeName = statNameNode;}
            if(statName.match(/Defense/)){
                defenceValue = 1 * statValue; defenceNode = statNode; defMod = statMod; defenceNodeName = statNameNode;}
            if(statName.match(/Dexterity/)){
                dexterityValue = 1 * statValue; dexterityNode = statNode; dexMod = statMod; dexterityNodeName = statNameNode; }
            if(statName.match(/Total/)){ totalValue = 1 * statValue; totalNode = statNode; totalNodeName = statNameNode;}

            $(this).find("span.divider").attr('style','width: 153px;'); //153 -> 174  //193
            statNode.css('width', '146px'); //136 -> 145  //136
        });

        //Adds stat percentage
        if (speedValue && strengthValue && defenceValue && dexterityValue && percStats == '1') {
            if (speedNode && strengthNode && defenceNode && dexterityNode) {
                var novoNode = $("<span class='descCopiedStyleFrom_desc_becauseOfTornStatsSubmit' style='color:#007bff; width:52px; padding-top: 5px; padding-right: 8px; padding-bottom: 5px; padding-left: 0px; border-right-width: 1px; border-right-style: solid; border-right-color: rgb(221, 221, 221); text-align: right; white-space: nowrap; overflow-x: hidden; overflow-y: hidden; text-overflow: ellipsis; vertical-align: top; display: inline-block; line-height: 14px;'></span>");
                speedNode.css('width', '121px');     speedNodeName.css('width', '117px');
                strengthNode.css('width', '121px');  strengthNodeName.css('width', '117px');
                defenceNode.css('width', '121px');   defenceNodeName.css('width', '117px');
                dexterityNode.css('width', '121px'); dexterityNodeName.css('width', '117px');
                totalNode.css('width', '121px');     totalNodeName.css('width', '117px');

                speedNode.after(novoNode.text(' (' + (Math.round(10000 * speedValue / totalValue) / 100) + '%)'));
                strengthNode.after(novoNode.clone().text(' (' + (Math.round(10000 * strengthValue / totalValue) / 100) + '%)'));
                defenceNode.after(novoNode.clone().text(' (' + (Math.round(10000 * defenceValue / totalValue) / 100) + '%)'));
                dexterityNode.after(novoNode.clone().text(' (' + (Math.round(10000 * dexterityValue / totalValue) / 100) + '%)'));
            }
            //save stats in memory
            GM_setValue('speedValue', speedValue.toString());
            GM_setValue('strengthValue', strengthValue.toString());
            GM_setValue('defenceValue', defenceValue.toString());
            GM_setValue('dexterityValue', dexterityValue.toString());
        }

        speedValue = Math.round(speedValue);
        strengthValue = Math.round(strengthValue);
        defenceValue = Math.round(defenceValue);
        dexterityValue = Math.round(dexterityValue);
        totalValue = Math.round(totalValue);
        var data = new Date();
        var dia = data.getDate();
        var mes = data.getMonth()+1;
        var ano = data.getFullYear();
        if(dia < 10) dia = '0' + dia;
        if(mes < 10) mes = '0' + mes;
        var mesSub = ano.toString() + mes.toString();
        var today = mesSub.toString() + dia.toString();