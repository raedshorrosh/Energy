[[jsxgraph width="600px" height="500px" 
  input-ref-levelsRef='levelsRef' 
  input-ref-arrowsRef='arrowsRef'
  input-ref-chemLabelsRef='chemLabelsRef']]

var board = JXG.JSXGraph.initBoard(divid, {
    boundingbox: [-25, 15, 25, -15], 
    axis: false, 
    showCopyright: false, 
    showNavigation: false,
    pan: {enabled: false}, 
    zoom: {enabled: false}
});

// 1. Config from Maxima
// Added fallback for Axis_p to prevent "not defined" errors
var xp = (typeof {#Axis_p#} !== 'undefined') ? {#Axis_p#} : -5;
var len = {#l_length#};
var isFixed = {#levels_fixed#}, startY = {#levels_y_init#}, labels = {#levels_txt#};
var arrLabels = {#arrow_labels#};
var rqm = "{#rqm#}"; // Unique ID to find the feedback span

var safeLoad = function(ref, def) {
    var el = document.getElementById(ref);
    if (el && el.value != "" && el.value !== "undefined") {
        try { return JSON.parse(el.value); } catch(e) { return def; }
    }
    return def;
};

// 2. Enthalpy Axis
board.create('arrow', [[xp, -14], [xp, 14]], {strokeColor: 'black', strokeWidth: 2});
board.create('text', [xp - 1.5, 0, "{#enthalpy_label#}"], {rotate: 90, fontSize: 18, fixed: true});

// 3. Levels
var levelPoints = [];
var currentLevelsY = safeLoad(levelsRef, startY);

for (let i = 0; i < labels.length; i++) {
    let p = board.create('point', [xp + 1, currentLevelsY[i]], {
        name: '', 
        fixed: isFixed[i] == 1, 
        moveAlongX: false, 
        size: 4, color: 'blue', strokeColor: 'black', showInfobox: false
    });

    let seg = board.create('segment', [p, [function(){ return p.X() + len; }, function(){ return p.Y(); }]], { 
        strokeColor: 'black', strokeWidth: 3 
    });

    board.create('text', [
        function(){ return p.X() + 2; }, 
        function(){ return p.Y() + 0.6; }, 
        labels[i]
    ], { useMathJax: true, fontSize: 14, fixed: true });

    levelPoints.push({p: p, seg: seg});
}

// 4. Arrows
var arrows = [];
var colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
var defaultArrows = arrLabels.map((_, k) => [[xp - 12, 5 - (k*2)], [xp - 12, 3 - (k*2)]]);
var currentArrows = safeLoad(arrowsRef, defaultArrows);

for (let j = 0; j < arrLabels.length; j++) {
    let p1 = board.create('point', currentArrows[j][0], {name: '', color: colors[j % 5], size: 4, face: '[]', showInfobox: false});
    let p2 = board.create('point', currentArrows[j][1], {name: '', color: colors[j % 5], size: 2, showInfobox: false});
    
    let seg = board.create('segment', [p1, p2], {
        strokeColor: colors[j % 5], strokeWidth: 3, lastarrow: {type: 2, size: 6}
    });

    board.create('text', [
        function(){ return (p1.X() + p2.X()) / 2 + 0.5; }, 
        function(){ return (p1.Y() + p2.Y()) / 2; }, 
        arrLabels[j]
    ], { color: colors[j % 5], useMathJax: true, fontSize: 14 });
    
    arrows.push({p1: p1, p2: p2, seg: seg});
}

// 5. Visual Feedback Logic (Searching for the hidden span)
var feedbackEl = document.getElementById(rqm);
if (feedbackEl) {
    try {
        var results = JSON.parse(feedbackEl.innerHTML);
        // Correct/Incorrect marking for Levels
        if (results.levels) {
            results.levels.forEach((res, i) => {
                if (levelPoints[i]) {
                    levelPoints[i].seg.setAttribute({
                        strokeColor: res == 1 ? 'green' : 'red', 
                        strokeWidth: res == 1 ? 4 : 5
                    });
                }
            });
        }
        // Correct/Incorrect marking for Arrows
        if (results.arrows) {
            results.arrows.forEach((res, i) => {
                if (arrows[i]) {
                    arrows[i].seg.setAttribute({
                        strokeColor: res == 1 ? 'green' : 'red', 
                        strokeWidth: res == 1 ? 4 : 5
                    });
                }
            });
        }
    } catch(e) { console.error("JSXGraph Feedback Error:", e); }
}

// Global Sync
var updateInputs = function() {
    document.getElementById(levelsRef).value = JSON.stringify(levelPoints.map(obj => obj.p.Y()));
    document.getElementById(arrowsRef).value = JSON.stringify(arrows.map(obj => [[obj.p1.X(), obj.p1.Y()], [obj.p2.X(), obj.p2.Y()]]));
    document.getElementById(chemLabelsRef).value = JSON.stringify(levelPoints.map(obj => [obj.p.X()+2, obj.p.Y()+0.6]));
    
    [levelsRef, arrowsRef, chemLabelsRef].forEach(id => {
        let el = document.getElementById(id);
        if(el) el.dispatchEvent(new Event('change'));
    });
};

levelPoints.forEach(obj => obj.p.on('drag', updateInputs));
arrows.forEach(obj => { obj.p1.on('drag', updateInputs); obj.p2.on('drag', updateInputs); });

board.update();
[[/jsxgraph]]
