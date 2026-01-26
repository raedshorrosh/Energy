[[jsxgraph width="600px" height="500px" 
  input-ref-levelsRef='levelsRef' 
  input-ref-arrowsRef='arrowsRef'
  input-ref-chemLabelsRef='chemLabelsRef']]
//1.0
var board = JXG.JSXGraph.initBoard(divid, {
    boundingbox: [-25, 15, 25, -15], 
    axis: false, 
    showCopyright: false, 
    showNavigation: false,
    pan: {enabled: false}, 
    zoom: {enabled: false}
});

// 1. Config from Maxima
var xp = Number("{#Axis_p#}") || -5;
var len = Number("{#l_length#}") || 25;
var isFixed = {#levels_fixed#};
var startY = {#levels_y_init#};
var labels = {#levels_txt#};
var arrLabels = {#arrow_labels#};
var enthalpy_txt = '{@enthalpy_label@}'; 
var rqm = '{@rqm@}'; 

var safeLoad = function(ref, def) {
    var el = document.getElementById(ref);
    if (el && el.value != "" && el.value !== "undefined") {
        try { return JSON.parse(el.value); } catch(e) { return def; }
    }
    return def;
};

// 2. Enthalpy Axis
board.create('arrow', [[xp, -14], [xp, 14]], {strokeColor: 'black', strokeWidth: 2});
board.create('text', [xp - 1.5, 0, enthalpy_txt], {rotate: 90, fontSize: 18, fixed: true});

// 3. Levels
var levelPoints = [];
var currentLevelsY = safeLoad(levelsRef, startY);

for (var i = 0; i < labels.length; i++) {
    (function(idx) {
        var p = board.create('point', [xp + 1, currentLevelsY[idx]], {
            name: '', 
            fixed: isFixed[idx] == 1, 
            moveAlongX: false, 
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

// 4. Arrows
var arrows = [];
var colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
var defaultArrows = [];
for (var k = 0; k < arrLabels.length; k++) {
    defaultArrows.push([[xp - 12, 5 - (k * 2)], [xp - 12, 3 - (k * 2)]]);
}
var currentArrows = safeLoad(arrowsRef, defaultArrows);

for (var j = 0; j < arrLabels.length; j++) {
    (function(idx) {
        var p1 = board.create('point', currentArrows[idx][0], {name: '', color: colors[idx % 5], size: 4, face: '[]', showInfobox: false});
        var p2 = board.create('point', currentArrows[idx][1], {name: '', color: colors[idx % 5], size: 2, showInfobox: false});
        
        var seg = board.create('segment', [p1, p2], {
            strokeColor: colors[idx % 5], strokeWidth: 3, lastarrow: {type: 2, size: 6}
        });

        board.create('text', [
            function(){ return (p1.X() + p2.X()) / 2 + 0.5; }, 
            function(){ return (p1.Y() + p2.Y()) / 2; }, 
            arrLabels[idx]
        ], { color: colors[idx % 5], useMathJax: true, fontSize: 14 });
        
        arrows.push({p1: p1, p2: p2, seg: seg});
    })(j);
}

// 5. Visual Feedback Logic - Simplified for STACK Parser
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

// Global Sync - Removed high-level array methods to satisfy STACK filter
var updateInputs = function() {
    var lvlsData = [];
    for (var a = 0; a < levelPoints.length; a++) { 
        lvlsData.push(levelPoints[a].p.Y()); 
    }
    document.getElementById(levelsRef).value = JSON.stringify(lvlsData);

    var arrsData = [];
    for (var b = 0; b < arrows.length; b++) { 
        var start = [arrows[b].p1.X(), arrows[b].p1.Y()];
        var end = [arrows[b].p2.X(), arrows[b].p2.Y()];
        arrsData.push([start, end]); 
    }
    document.getElementById(arrowsRef).value = JSON.stringify(arrsData);

    var chemsData = [];
    for (var c = 0; c < levelPoints.length; c++) { 
        chemsData.push([levelPoints[c].p.X() + 2, levelPoints[c].p.Y() + 0.6]); 
    }
    document.getElementById(chemLabelsRef).value = JSON.stringify(chemsData);
    
    // Trigger changes manually
    var targetIds = [levelsRef, arrowsRef, chemLabelsRef];
    for (var d = 0; d < targetIds.length; d++) {
        var el = document.getElementById(targetIds[d]);
        if (el) { el.dispatchEvent(new Event('change')); }
    }
};

for (var i = 0; i < levelPoints.length; i++) { 
    levelPoints[i].p.on('drag', updateInputs); 
}
for (var j = 0; j < arrows.length; j++) { 
    arrows[j].p1.on('drag', updateInputs); 
    arrows[j].p2.on('drag', updateInputs); 
}

board.update();
[[/jsxgraph]]
