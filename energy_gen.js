// Version: 2.4
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
var chemOff = Number("{#chem_y_offset#}") || 0.6; 
var rqm = "{#rqm#}";

var isFixed = (typeof {#levels_fixed#} !== 'undefined') ? {#levels_fixed#} : [0, 0, 1];
var startY = (typeof {#levels_y_init#} !== 'undefined') ? {#levels_y_init#} : [10, 2, -6]; 
var labels = (typeof {#levels_txt#} !== 'undefined') ? {#levels_txt#} : ["\\( H_2O_{(g)} \\)", "\\( H_2O_{(l)} \\)", "\\( H_2O_{(s)} \\)"];
var arrLabels = (typeof {#arrow_labels#} !== 'undefined') ? {#arrow_labels#} : ["\\( \\Delta H_m \\)", "\\( \\Delta H_b \\)", "\\( \\Delta H_s \\)"];
var chemsFixed = (typeof {#chems_fixed#} !== 'undefined') ? {#chems_fixed#} : labels.map(function() { return 1; });

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
        
        p.on('drag', function() { p.moveTo([levelX, p.Y()]); });

        var seg = board.create('segment', [p, [function(){ return p.X() + len; }, function(){ return p.Y(); }]], { 
            strokeColor: 'black', strokeWidth: 3 
        });
        
        levelPoints.push({p: p, seg: seg});
        levelSegments.push(seg);
    })(i);
}

// 3b. Chemical Labels (Moveable or Fixed)
var chemTexts = [];
var initChemPos = labels.map(function(l, idx) { 
    return [levelX + 2, currentLevelsY[idx] + chemOff]; 
});
var currentChems = safeLoad(chemLabelsRef, initChemPos);

for (var c = 0; c < labels.length; c++) {
    (function(idx) {
        var isChemFixed = (chemsFixed[idx] == 1);
        
        var txt = board.create('text', [currentChems[idx][0], currentChems[idx][1], labels[idx]], { 
            useMathJax: true, 
            fontSize: 14, 
            fixed: isChemFixed,
            isDraggable: !isChemFixed,
            parse: false
        });

        if (!isChemFixed) {
            txt.on('drag', function() {
                var currY = txt.Y();
                var targetY = currY;
                for (var l = 0; l < levelPoints.length; l++) {
                    var lineY = levelPoints[l].p.Y();
                    if (Math.abs(currY - chemOff - lineY) < 0.7) {
                        targetY = lineY + chemOff; 
                    }
                }
                txt.moveTo([txt.X(), targetY]);
            });
        }
        
        chemTexts.push(txt);
    })(c);
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
            attractors: levelSegments, attractorDistance: 0.5, snatchDistance: 1.0
        });
        
        var p2 = board.create('point', currentArrows[idx][1], {
            name: '', color: colors[idx % 3], size: 2, face: 'o', showInfobox: false,
            attractors: levelSegments, attractorDistance: 0.5, snatchDistance: 1.0
        });

        p1.on('drag', function() { p2.moveTo([p1.X(), p2.Y()]); });
        p2.on('drag', function() { p1.moveTo([p2.X(), p1.Y()]); });

        var seg = board.create('segment', [p1, p2], {strokeColor: colors[idx % 3], strokeWidth: 3, lastarrow: {type: 2, size: 6}});
        
        // Version 2.4 Fix: Use static coordinates and high snatchDistance to allow gliding.
        // Dynamic function wrappers prevent dragging along attractors in JSXGraph.
        var midX = (p1.X() + p2.X()) / 2 + 0.5;
        var midY = (p1.Y() + p2.Y()) / 2;

        var label = board.create('text', [midX, midY, arrLabels[idx]], { 
            attractors: [seg], 
            attractorDistance: 10, 
            snatchDistance: 1000,
            showInfobox: false,
            color: colors[idx % 3], 
            useMathJax: true, 
            fontSize: 14,
            fixed: false,
            isDraggable: true
        });
        
        arrows.push({p1: p1, p2: p2, seg: seg, label: label});
    })(j);
}

// 5. Data Sync
var updateInputs = function() {
    var lvls = levelPoints.map(function(obj) { return obj.p.Y(); });
    var arrs = arrows.map(function(obj) { return [[obj.p1.X(), obj.p1.Y()], [obj.p2.X(), obj.p2.Y()]]; });
    var chems = chemTexts.map(function(t) { return [t.X(), t.Y()]; });

    document.getElementById(levelsRef).value = JSON.stringify(lvls);
    document.getElementById(arrowsRef).value = JSON.stringify(arrs);
    document.getElementById(chemLabelsRef).value = JSON.stringify(chems);
    
    [levelsRef, arrowsRef, chemLabelsRef].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.dispatchEvent(new Event('change'));
    });
};

levelPoints.forEach(function(obj) { 
    obj.p.on('drag', updateInputs); 
    obj.p.on('up', updateInputs); 
});
chemTexts.forEach(function(t) {
    t.on('drag', updateInputs);
    t.on('up', updateInputs);
});
arrows.forEach(function(obj) { 
    obj.p1.on('drag', updateInputs); obj.p1.on('up', updateInputs); 
    obj.p2.on('drag', updateInputs); obj.p2.on('up', updateInputs); 
    // Sync when label is glided
    obj.label.on('drag', updateInputs);
});

board.update();
[[/jsxgraph]]
