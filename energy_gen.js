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
var xp = Number("{#Axis_p#}") || -5;
var len = Number("{#l_length#}") || 25;
var rqm = "{#rqm#}";

var isFixed = {#levels_fixed#};
var startY = {#levels_y_init#};
var labels = {#levels_txt#};
var arrLabels = {#arrow_labels#};

var safeLoad = function(ref, def) {
    var el = document.getElementById(ref);
    if (el && el.value != "" && el.value !== "undefined") {
        try { return JSON.parse(el.value); } catch(e) { return def; }
    }
    return def;
};

// 2. Enthalpy Axis
board.create('arrow', [[xp, -14], [xp, 14]], {strokeColor: 'black', strokeWidth: 2});
board.create('text', [xp - 1.5, 0, "{@enthalpy_label@}"], {rotate: 90, fontSize: 18, fixed: true});

// 3. Levels
var levelPoints = [];
var currentLevelsY = safeLoad(levelsRef, startY);
var levelX = xp + 1;

for (var i = 0; i < labels.length; i++) {
    (function(idx) {
        var p = board.create('point', [levelX, currentLevelsY[idx]], {
            name: '', fixed: isFixed[idx] == 1, size: 4, color: 'blue', strokeColor: 'black', showInfobox: false
        });
        
        var seg = board.create('segment', [p, [function(){ return p.X() + len; }, function(){ return p.Y(); }]], { 
            strokeColor: 'black', strokeWidth: 3 
        });
        
        board.create('text', [function(){ return p.X() + 2; }, function(){ return p.Y() + 0.6; }, labels[idx]], { useMathJax: true, fontSize: 14, fixed: true });
        
        levelPoints.push({p: p, seg: seg, x: levelX});
    })(i);
}

// 4. Arrows
var arrows = [];
var colors = ['#3498db', '#e74c3c', '#2ecc71'];
var arrowX = xp - 12;
var defaultArrows = [];
for (var k = 0; k < arrLabels.length; k++) {
    defaultArrows.push([[arrowX, 5 - (k * 4)], [arrowX, 2 - (k * 4)]]);
}
var currentArrows = safeLoad(arrowsRef, defaultArrows);

for (var j = 0; j < arrLabels.length; j++) {
    (function(idx) {
        // We use the segment of each level as an attractor
        var attractorsList = levelPoints.map(function(lp) { return lp.seg; });

        var p1 = board.create('point', currentArrows[idx][0], {
            name: '', color: colors[idx % 3], size: 4, face: '[]', showInfobox: false,
            attractors: attractorsList,
            attractorDistance: 0.8,
            snatchDistance: 1.0
        });
        
        var p2 = board.create('point', currentArrows[idx][1], {
            name: '', color: colors[idx % 3], size: 2, showInfobox: false,
            attractors: attractorsList,
            attractorDistance: 0.8,
            snatchDistance: 1.0
        });

        var seg = board.create('segment', [p1, p2], {strokeColor: colors[idx % 3], strokeWidth: 3, lastarrow: {type: 2, size: 6}});
        
        board.create('text', [function(){ return (p1.X() + p2.X()) / 2 + 0.5; }, function(){ return (p1.Y() + p2.Y()) / 2; }, arrLabels[idx]], { color: colors[idx % 3], useMathJax: true, fontSize: 14 });
        
        arrows.push({p1: p1, p2: p2, seg: seg, x: arrowX});
    })(j);
}

// 5. GLOBAL MOVE HANDLER (Ensuring strict X-alignment)
board.on('move', function() {
    // Keep Levels on their X line
    for (var a = 0; a < levelPoints.length; a++) {
        levelPoints[a].p.moveTo([levelPoints[a].x, levelPoints[a].p.Y()]);
    }
    // Keep Arrows on their X line
    for (var b = 0; b < arrows.length; b++) {
        arrows[b].p1.moveTo([arrows[b].x, arrows[b].p1.Y()]);
        arrows[b].p2.moveTo([arrows[b].x, arrows[b].p2.Y()]);
    }
});

// 6. Visual Feedback Logic
var feedbackEl = document.getElementById(rqm);
if (feedbackEl) {
    try {
        var results = JSON.parse(feedbackEl.innerHTML);
        if (results.levels) {
            results.levels.forEach(function(res, m) {
                if (levelPoints[m]) { levelPoints[m].seg.setAttribute({strokeColor: res == 1 ? 'green' : 'red', strokeWidth: 4}); }
            });
        }
        if (results.arrows) {
            results.arrows.forEach(function(res, n) {
                if (arrows[n]) { arrows[n].seg.setAttribute({strokeColor: res == 1 ? 'green' : 'red', strokeWidth: 4}); }
            });
        }
    } catch(e) {}
}

// 7. Data Sync
var updateInputs = function() {
    document.getElementById(levelsRef).value = JSON.stringify(levelPoints.map(function(obj) { return obj.p.Y(); }));
    document.getElementById(arrowsRef).value = JSON.stringify(arrows.map(function(obj) { return [[obj.p1.X(), obj.p1.Y()], [obj.p2.X(), obj.p2.Y()]]; }));
    document.getElementById(chemLabelsRef).value = JSON.stringify(levelPoints.map(function(obj) { return [obj.p.X() + 2, obj.p.Y() + 0.6]; }));
    
    [levelsRef, arrowsRef, chemLabelsRef].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) { el.dispatchEvent(new Event('change')); }
    });
};

levelPoints.forEach(function(obj) { obj.p.on('drag', updateInputs); });
arrows.forEach(function(obj) { 
    obj.p1.on('drag', updateInputs); 
    obj.p2.on('drag', updateInputs); 
});

board.update();
[[/jsxgraph]]
