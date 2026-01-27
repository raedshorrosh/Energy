// Version: 1.2
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
var levelSegments = []; 

for (var i = 0; i < labels.length; i++) {
    (function(idx) {
        var p = board.create('point', [levelX, currentLevelsY[idx]], {
            name: '', fixed: isFixed[idx] == 1, size: 4, color: 'blue', strokeColor: 'black', showInfobox: false
        });
        
        p.on('drag', function() {
            p.moveTo([levelX, p.Y()]);
        });

        var seg = board.create('segment', [p, [function(){ return p.X() + len; }, function(){ return p.Y(); }]], { 
            strokeColor: 'black', strokeWidth: 3 
        });
        
        // Chemical Labels: Positioned relative to level point p
        board.create('text', [
            function(){ return p.X() + 2; }, 
            function(){ return p.Y() + 0.6; }, 
            labels[idx]
        ], { 
            useMathJax: true, 
            fontSize: 14, 
            fixed: isFixed[idx] == 1 
        });
        
        levelPoints.push({p: p, seg: seg, x: levelX});
        levelSegments.push(seg);
    })(i);
}

// 4. Arrows
var arrows = [];
var colors = ['#3498db', '#e74c3c', '#2ecc71'];
var defaultArrows = [];
for (var k = 0; k < arrLabels.length; k++) {
    defaultArrows.push([[xp - 12, 5 - (k * 4)], [xp - 12, 2 - (k * 4)]]);
}
var currentArrows = safeLoad(arrowsRef, defaultArrows);

for (var j = 0; j < arrLabels.length; j++) {
    (function(idx) {
        var p1 = board.create('point', currentArrows[idx][0], {
            name: '', color: colors[idx % 3], size: 4, face: '[]', showInfobox: false,
            attractors: levelSegments,
            attractorDistance: 0.5,
            snatchDistance: 1.0
        });
        
        var p2 = board.create('point', currentArrows[idx][1], {
            name: '', color: colors[idx % 3], size: 2, face: 'o', showInfobox: false,
            attractors: levelSegments,
            attractorDistance: 0.5,
            snatchDistance: 1.0
        });

        // Sync X-axis movement
        p1.on('drag', function() { p2.moveTo([p1.X(), p2.Y()]); });
        p2.on('drag', function() { p1.moveTo([p2.X(), p1.Y()]); });

        var seg = board.create('segment', [p1, p2], {strokeColor: colors[idx % 3], strokeWidth: 3, lastarrow: {type: 2, size: 6}});
        
        // Arrow Labels: Draggable but attracted to the arrow line
        board.create('text', [
            function(){ return (p1.X() + p2.X()) / 2 + 0.5; }, 
            function(){ return (p1.Y() + p2.Y()) / 2; }, 
            arrLabels[idx]
        ], { 
            color: colors[idx % 3], 
            useMathJax: true, 
            fontSize: 14,
            fixed: false, // Allows movement
            attractors: [seg],
            attractorDistance: 10,
            snatchDistance: 1000
        });
        
        arrows.push({p1: p1, p2: p2, seg: seg});
    })(j);
}

// 5. Visual Feedback Logic
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

// 6. Data Sync
var updateInputs = function() {
    document.getElementById(levelsRef).value = JSON.stringify(levelPoints.map(function(obj) { return obj.p.Y(); }));
    document.getElementById(arrowsRef).value = JSON.stringify(arrows.map(function(obj) { return [[obj.p1.X(), obj.p1.Y()], [obj.p2.X(), obj.p2.Y()]]; }));
    
    // Save chemical labels based on current level positions
    document.getElementById(chemLabelsRef).value = JSON.stringify(levelPoints.map(function(obj) { 
        return [obj.p.X() + 2, obj.p.Y() + 0.6]; 
    }));
    
    [levelsRef, arrowsRef, chemLabelsRef].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) { el.dispatchEvent(new Event('change')); }
    });
};

levelPoints.forEach(function(obj) { 
    obj.p.on('drag', updateInputs); 
    obj.p.on('up', updateInputs); 
});
arrows.forEach(function(obj) { 
    obj.p1.on('drag', updateInputs); 
    obj.p1.on('up', updateInputs); 
    obj.p2.on('drag', updateInputs); 
    obj.p2.on('up', updateInputs); 
});

board.update();
[[/jsxgraph]]
