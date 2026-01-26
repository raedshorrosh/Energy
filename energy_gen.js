[[jsxgraph width="600px" height="500px" 
  input-ref-levelsRef='levelsRef' 
  input-ref-arrowsRef='arrowsRef'
  input-ref-chemLabelsRef='chemLabelsRef']]
//4.0
var board = JXG.JSXGraph.initBoard(divid, {
    boundingbox: [-25, 15, 25, -15], 
    axis: false, 
    showCopyright: false, 
    showNavigation: false,
    pan: {enabled: false}, 
    zoom: {enabled: false}
});

// 1. הגדרות מה-Maxima עם הגנה מפני שגיאות
var xp = Number("{#Axis_p#}") || -5;
var len = Number("{#l_length#}") || 25;

// בדיקת קיום משתנים מה-Maxima או שימוש בברירת מחדל עבור מים
var isFixed = (typeof {#levels_fixed#} !== 'undefined') ? {#levels_fixed#} : [0, 0, 1]; // המוצק בדרך כלל מקובע כבסיס
var startY = (typeof {#levels_y_init#} !== 'undefined') ? {#levels_y_init#} : [10, 2, -6]; 
var labels = (typeof {#levels_txt#} !== 'undefined') ? {#levels_txt#} : ["\\( H_2O_{(g)} \\)", "\\( H_2O_{(l)} \\)", "\\( H_2O_{(s)} \\)"];
var arrLabels = (typeof {#arrow_labels#} !== 'undefined') ? {#arrow_labels#} : ["רתיחה (Boiling)", "התכה (Melting)", "המראה (Sublimation)"];

var enthalpy_txt = '{@enthalpy_label@}'; 
var rqm = '{@rqm@}'; 

var safeLoad = function(ref, def) {
    var el = document.getElementById(ref);
    if (el && el.value != "" && el.value !== "undefined") {
        try { return JSON.parse(el.value); } catch(e) { return def; }
    }
    return def;
};

// 2. ציר אנתלפיה
board.create('arrow', [[xp, -14], [xp, 14]], {strokeColor: 'black', strokeWidth: 2});
board.create('text', [xp - 1.5, 0, enthalpy_txt], {rotate: 90, fontSize: 18, fixed: true});

// 3. רמות (מצבי צבירה)
var levelPoints = [];
var currentLevelsY = safeLoad(levelsRef, startY);

for (var i = 0; i < labels.length; i++) {
    (function(idx) {
        var p = board.create('point', [xp + 1, currentLevelsY[idx]], {
            name: '', 
            fixed: isFixed[idx] == 1, 
            moveAlongX: false, // מניעת תנועה אופקית
            size: 4, color: 'blue', strokeColor: 'black', showInfobox: false
        });

        var seg = board.create('segment', [p, [function(){ return p.X() + len; }, function(){ return p.Y(); }]], { 
            strokeColor: 'black', strokeWidth: 3 
        });

        board.create('text', [
            function(){ return p.X() + 2; }, 
            function(){ return p.Y() + 0.6; }, 
            labels[idx]
        ], { useMathJax: true, fontSize: 14, fixed: true });

        levelPoints.push({p: p, seg: seg});
    })(i);
}

// 4. חיצים (תהליכים)
var arrows = [];
var colors = ['#3498db', '#e74c3c', '#2ecc71']; // צבעים שונים לכל תהליך
var defaultArrows = [];
for (var k = 0; k < arrLabels.length; k++) {
    // מיקום ראשוני של החיצים משמאל לציר
    defaultArrows.push([[xp - 12, 5 - (k * 4)], [xp - 12, 2 - (k * 4)]]);
}
var currentArrows = safeLoad(arrowsRef, defaultArrows);

for (var j = 0; j < arrLabels.length; j++) {
    (function(idx) {
        var p1 = board.create('point', currentArrows[idx][0], {
            name: '', color: colors[idx % 3], size: 4, face: '[]', 
            moveAlongX: false, showInfobox: false
        });
        var p2 = board.create('point', currentArrows[idx][1], {
            name: '', color: colors[idx % 3], size: 2, 
            moveAlongX: false, showInfobox: false
        });
        
        var seg = board.create('segment', [p1, p2], {
            strokeColor: colors[idx % 3], strokeWidth: 3, lastarrow: {type: 2, size: 6}
        });

        board.create('text', [
            function(){ return (p1.X() + p2.X()) / 2 + 0.5; }, 
            function(){ return (p1.Y() + p2.Y()) / 2; }, 
            arrLabels[idx]
        ], { color: colors[idx % 3], useMathJax: true, fontSize: 14 });
        
        arrows.push({p1: p1, p2: p2, seg: seg});
    })(j);
}

// 5. לוגיקת משוב ויזואלי (צביעה בירוק/אדום לאחר בדיקה)
var feedbackEl = document.getElementById(rqm);
if (feedbackEl) {
    var raw = feedbackEl.innerHTML;
    if (raw.length > 5) {
        var results = JSON.parse(raw);
        if (results.levels) {
            for (var m = 0; m < results.levels.length; m++) {
                if (levelPoints[m]) {
                    var cL = (results.levels[m] == 1) ? 'green' : 'red';
                    levelPoints[m].seg.setAttribute({strokeColor: cL, strokeWidth: 4});
                }
            }
        }
        if (results.arrows) {
            for (var n = 0; n < results.arrows.length; n++) {
                if (arrows[n]) {
                    var cA = (results.arrows[n] == 1) ? 'green' : 'red';
                    arrows[n].seg.setAttribute({strokeColor: cA, strokeWidth: 4});
                }
            }
        }
    }
}

// פונקציית סנכרון תשובות ל-STACK
var updateInputs = function() {
    var lvlsData = [];
    for (var a = 0; a < levelPoints.length; a++) { lvlsData.push(levelPoints[a].p.Y()); }
    document.getElementById(levelsRef).value = JSON.stringify(lvlsData);

    var arrsData = [];
    for (var b = 0; b < arrows.length; b++) { 
        arrsData.push([[arrows[b].p1.X(), arrows[b].p1.Y()], [arrows[b].p2.X(), arrows[b].p2.Y()]]); 
    }
    document.getElementById(arrowsRef).value = JSON.stringify(arrsData);

    var chemsData = [];
    for (var c = 0; c < levelPoints.length; c++) { 
        chemsData.push([levelPoints[c].p.X() + 2, levelPoints[c].p.Y() + 0.6]); 
    }
    document.getElementById(chemLabelsRef).value = JSON.stringify(chemsData);
    
    var targetIds = [levelsRef, arrowsRef, chemLabelsRef];
    for (var d = 0; d < targetIds.length; d++) {
        var el = document.getElementById(targetIds[d]);
        if (el) { el.dispatchEvent(new Event('change')); }
    }
};

// רישום אירועי גרירה
for (var i = 0; i < levelPoints.length; i++) { levelPoints[i].p.on('drag', updateInputs); }
for (var j = 0; j < arrows.length; j++) { 
    arrows[j].p1.on('drag', updateInputs); 
    arrows[j].p2.on('drag', updateInputs); 
}

board.update();
[[/jsxgraph]]
