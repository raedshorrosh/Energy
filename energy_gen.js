// Version: 1.8
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

var isFixed = {#levels_fixed#};
var startY = {#levels_y_init#};
var labels = {#levels_txt#};
var arrLabels = {#arrow_labels#};
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
        
        // Horizontal lock via point listener
        p.on('drag', function() { p.moveTo([levelX, p.Y()]); });

        var seg = board.create('segment', [p, [function(){ return p.X() + len; }, function(){ return p.Y(); }]], { 
            strokeColor: 'black', strokeWidth: 3 
        });
        
        levelPoints.push({p: p, seg: seg});
        levelSegments.push(seg);
    })(i);
}

// 3b. Chemical Labels
var chemTexts = [];
var initChemPos = labels.map(function(l, idx) { 
    return [levelX + 2, currentLevelsY[idx] + chemOff]; 
});
var currentChems = safeLoad(chemLabelsRef, initChemPos);

for (var c = 0; c < labels.length; c++) {
    (function(idx) {
        var isChemFixed = (chemsFixed[idx] == 1);
        
        var cp = board.create('point', [currentChems[idx][0], currentChems[idx][1]], {
            name: '', 
            fixed: isChemFixed, 
            visible: !isChemFixed, 
            size: 3, 
            color: 'gray',
            attractors: levelSegments, 
            attractorDistance: 0.5, 
            snatchDistance: 0.8
        });

        var txt = board.create('text', [function(){ return cp.X(); }, function(){ return cp.Y(); }, labels[idx]], { 
            useMathJax: true, 
            fontSize: 14, 
            fixed: true,
            parse: false
        });
        
        chemTexts.push({cp: cp, txt: txt});
    })(c);
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
        var p1 = board.create('point', currentArrows[idx][0], {
            name: '', color: colors[idx % 3], size: 4, face: '[]', showInfobox: false,
            attractors: levelSegments, attractorDistance: 0.5, snatchDistance: 1.0
        });
        
        var p2 = board.create('point', currentArrows[idx][1], {
            name: '', color: colors[idx % 3], size: 2, face: 'o', showInfobox: false,
            attractors: levelSegments, attractorDistance: 0.5, snatchDistance: 1.0
        });

        // Sync points and lock X via point listeners
        p1.on('drag', function() { 
            p1.moveTo([arrowX, p1.Y()]);
            p2.moveTo([arrowX, p2.Y()]); 
        });
        p2.on('drag', function() { 
            p1.moveTo([arrowX, p1.Y()]);
            p2.moveTo([arrowX, p2.Y()]); 
        });

        var seg = board.create('segment', [p1, p2], {strokeColor: colors[idx % 3], strokeWidth: 3, lastarrow: {type: 2, size: 6}});
        
        board.create('text', [
            function() { return (p1.X() + p2.X()) / 2 + 0.5; }, 
            function() { return (p1.Y() + p2.Y()) / 2; }, 
            arrLabels[idx]
        ], { 
            color: colors[idx % 3], 
            useMathJax: true, 
            fontSize: 14,
            fixed: true
        });
        
        arrows.push({p1: p1, p2: p2, seg: seg});
    })(j);
}

// 5. Data Sync
var updateInputs = function() {
    var lvls = levelPoints.map(function(obj) { return obj.p.Y(); });
    var arrs = arrows.map(function(obj) { return [[obj.p1.X(), obj.p1.Y()], [obj.p2.X(), obj.p2.Y()]]; });
    var chems = chemTexts.map(function(obj) { return [obj.cp.X(), obj.cp.Y()]; });

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
chemTexts.forEach(function(obj) {
    obj.cp.on('drag', updateInputs);
    obj.cp.on('up', updateInputs);
});
arrows.forEach(function(obj) { 
    obj.p1.on('drag', updateInputs); obj.p1.on('up', updateInputs); 
    obj.p2.on('drag', updateInputs); obj.p2.on('up', updateInputs); 
});

board.update();
[[/jsxgraph]]
