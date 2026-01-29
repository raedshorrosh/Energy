// Version: 3.7
[[jsxgraph width="600px" height="500px" 
  input-ref-levelsRef='levelsRef' 
  input-ref-arrowsRef='arrowsRef' 
  input-ref-chemLabelsRef='chemLabelsRef']]

JXG.Options.text.cssDefaultStyle += ';direction:ltr; font-family:Arial;';
JXG.Options.text.highlightCssDefaultStyle += ';direction:ltr;';
JXG.Options.layer.text = 0;

var board = JXG.JSXGraph.initBoard(divid, {
    boundingbox: [-25, 15, 25, -15], 
    axis: false, 
    showCopyright: false, 
    showNavigation: false,
    pan: {enabled: false}, 
    zoom: {enabled: false},
    resize: {enabled: false}
});

// 1. Config from Maxima
var xp = Number("{#Axis_p#}") || -5;
var len = Number("{#l_length#}") || 25;
var chemOff = Number("{#chem_y_offset#}") || 1.0; 
var rqm = "{#rqm#}";

var isFixed = (typeof {#levels_fixed#} !== 'undefined') ? {#levels_fixed#} : [0, 0, 1];
var startY = (typeof {#levels_y_init#} !== 'undefined') ? {#levels_y_init#} : [10, 2, -6]; 
var labels = (typeof {#levels_txt#} !== 'undefined') ? {#levels_txt#} : ["\\( H_2O_{(g)} \\)", "\\( H_2O_{(l)} \\)", "\\( H_2O_{(s)} \\)"];
var arrLabels = (typeof {#arrow_labels#} !== 'undefined') ? {#arrow_labels#} : ["\\( \\Delta H_m \\)", "\\( \\Delta H_b \\)", "\\( \\Delta H_s \\)"];

// nameRef structure for marks
var nameRef = {
    txts: labels,
    p: ["", "", "", "", "", ""], // Marks for arrows (points)
    l: ["", "", ""],             // Marks for level points
    chkd: false
};

var correctMark = '✅';
var incorrectMark = '❌';

var safeLoad = function(ref, def) {
    var el = document.getElementById(ref);
    if (el && el.value != "" && el.value !== "undefined") {
        try { return JSON.parse(el.value); } catch(e) { return def; }
    }
    return def;
};

// 2. Enthalpy Axis
board.create('arrow', [[xp, -14], [xp, 14]], {strokeColor: 'black', strokeWidth: 2, fixed: true});
board.create('text', [xp - 1.5, 0, "{@enthalpy_label@}"], {rotate: 90, fontSize: 18, fixed: true});

// 3. Levels
var levelPoints = [];
var currentLevelsY = safeLoad(levelsRef, startY);
var levelX = xp + 1;

for (var i = 0; i < labels.length; i++) {
    (function(idx) {
        var p = board.create('point', [levelX, currentLevelsY[idx]], {
            name: function() { return nameRef.l[idx]; }, 
            fixed: function() { return isFixed[idx] == 1 || nameRef.chkd; }, 
            size: 4, color: 'blue', strokeColor: 'black', showInfobox: false,
            moveAlongX: false
        });
        
        var seg = board.create('segment', [p, [function(){ return p.X() + len; }, function(){ return p.Y(); }]], { 
            strokeColor: 'black', strokeWidth: 3, fixed: true 
        });
        
        board.create('text', [function(){ return p.X() + 2; }, function(){ return p.Y() + chemOff; }, function(){ return nameRef.txts[idx]; }], {
            useMathJax: true, fontSize: 14, fixed: true
        });

        levelPoints.push({p: p, seg: seg, moveable: (isFixed[idx] == 0)});
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
            name: function() { return nameRef.p[idx*2] || ''; }, 
            color: colors[idx % 3], size: 4, face: '[]', showInfobox: false,
            moveAlongX: false,
            fixed: function() { return nameRef.chkd; }
        });
        
        var p2 = board.create('point', currentArrows[idx][1], {
            name: function() { return nameRef.p[idx*2+1] || ''; }, 
            color: colors[idx % 3], size: 2, face: 'o', showInfobox: false,
            moveAlongX: false,
            fixed: function() { return nameRef.chkd; }
        });

        var seg = board.create('segment', [p1, p2], {strokeColor: colors[idx % 3], strokeWidth: 3, lastarrow: {type: 2, size: 6}});
        
        board.create('text', [
            function() { return (p1.X() + p2.X()) / 2 + 0.5; },
            function() { return (p1.Y() + p2.Y()) / 2; },
            arrLabels[idx]
        ], { color: colors[idx % 3], useMathJax: true, fontSize: 14, fixed: function() { return nameRef.chkd; } });
        
        arrows.push({p1: p1, p2: p2, seg: seg});
    })(j);
}

// 5. Constraints
board.on('move', function() {
    levelPoints.forEach(function(obj) { obj.p.moveTo([levelX, obj.p.Y()]); });
    arrows.forEach(function(obj) {
        obj.p1.moveTo([obj.p1.X(), obj.p1.Y()]);
        obj.p2.moveTo([obj.p1.X(), obj.p2.Y()]);
        for (var l = 0; l < levelPoints.length; l++) {
            if (Math.abs(obj.p1.Y() - levelPoints[l].p.Y()) < 0.6) obj.p1.moveTo([obj.p1.X(), levelPoints[l].p.Y()]);
            if (Math.abs(obj.p2.Y() - levelPoints[l].p.Y()) < 0.6) obj.p2.moveTo([obj.p2.X(), levelPoints[l].p.Y()]);
        }
    });
});

// 6. Data Sync
var updateInputs = function() {
    if (nameRef.chkd) return;
    document.getElementById(levelsRef).value = JSON.stringify(levelPoints.map(function(o){return o.p.Y();}));
    document.getElementById(arrowsRef).value = JSON.stringify(arrows.map(function(o){return [[o.p1.X(),o.p1.Y()],[o.p2.X(),o.p2.Y()]];}));
    document.getElementById(chemLabelsRef).value = JSON.stringify(levelPoints.map(function(o){return [o.p.X()+2, o.p.Y()+chemOff];}));
    
    [levelsRef, arrowsRef, chemLabelsRef].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.dispatchEvent(new Event('change'));
    });
};

levelPoints.forEach(function(obj) { obj.p.on('drag', updateInputs); });
arrows.forEach(function(obj) { obj.p1.on('drag', updateInputs); obj.p2.on('drag', updateInputs); });

// 7. Grading Application Helper
var applyGrading = function(grade) {
    if (!grade) return;
    
    // Mark Chems
    if (grade.chems) {
        grade.chems.forEach(function(mrk, i) {
            if (levelPoints[i] && levelPoints[i].moveable) {
                var mark = (mrk == 1) ? correctMark : incorrectMark;
                nameRef.txts[i] = mark + " " + nameRef.txts[i];
            }
        });
    }

    // Mark Level Points and Segments
    if (grade.levels) {
        grade.levels.forEach(function(mrk, i) {
            if (levelPoints[i] && levelPoints[i].moveable) {
                nameRef.l[i] = (mrk == 1) ? correctMark : incorrectMark;
                levelPoints[i].seg.setAttribute({strokeColor: (mrk == 1 ? 'green' : 'red'), strokeWidth: 4});
            }
        });
    }

    // Mark Arrows
    if (grade.arrows) {
        grade.arrows.forEach(function(mrk, i) {
            var mark = (mrk == 1) ? correctMark : incorrectMark;
            if (nameRef.p[idx*2] !== undefined) nameRef.p[idx*2] = mark;
            if (arrows[i]) {
                arrows[i].seg.setAttribute({ strokeColor: (mrk == 1 ? 'green' : 'red'), strokeWidth: 5 });
            }
        });
    }
    board.fullUpdate();
};

// 8. Sync with STACK Content (Reverting to your specific implementation)
stack_js.get_content(rqm).then((content) => {
    if (content !== null) {
        if (!(nameRef.chkd)) {
            nameRef.chkd = true;
            let grade = JSON.parse(content);
            applyGrading(grade);
            board.update();
        }
    }
});

board.update();
[[/jsxgraph]]
