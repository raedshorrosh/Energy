  
  
[[jsxgraph width="750px" input-ref-ans_DH1='DH1Ref' input-ref-ans_DH2='DH2Ref' input-ref-ans_Ea1='Ea1Ref' input-ref-ans_Ea2='Ea2Ref' input-ref-ans_Ear1='Ear1Ref' input-ref-ans_Ear2='Ear2Ref' input-ref-ans_react='reactRef' input-ref-ans_prod='prodRef']]

var nameRef ={reacttxt:{#reacttxt#}, prodtxt:{#prodtxt#}, p:["","","","","",""],chkd:false};

//-----------------------------------------------------------------------
//snap grid for points in x
//JXG.Options.point.snapToGrid = true;
//JXG.Options.point.snapSizeX = 1;
 JXG.Options.layer.text = 0; 
 
  // boundingbox:[left, top, right, bottom]
    var board = JXG.JSXGraph.initBoard(divid, {boundingbox: [-20, 20, 20, -20], axis: false, showCopyright: false,showNavigation:false,pan:{enabled:false},zoom:{enabled:false},resize: {enabled:false}});


  var f = board.jc.snippet('{#fx#}', true, 'x', true);
 board.create('functiongraph', [f,{#leftX2#},{#rightX1#}]);
var leftLine=board.create('segment', {#leftL#},{fixed:true});

var rightLine=board.create('segment', {#rightL#},{fixed:true});

var dotted1=board.create('segment', {#dotted1#},{fixed:true,dash:2});
var dotted2=board.create('segment', {#dotted2#},{fixed:true,dash:2});
var dotted3=board.create('segment', {#dotted3#},{fixed:true,dash:2});

// draw the axis
board.create('arrow',{#y_axis#}, {strokeColor:'black', strokeWidth:3, fixed:true});
board.create('arrow',{#x_axis#}, {strokeColor:'black', strokeWidth:3,fixed:true});
board.create('text',[{#leftX1#}-1,{#texty#},{#y_title#}],{fontSize: 20, color:'black', fixed: true,  display: 'internal',rotate: 90});
board.create('text',[{#rightX1#},-17,{#x_title#}],{fontSize: 20, color:'black', fixed: true,  display: 'internal'});

var fxd=function(){return nameRef.chkd};

  var wd=4;
// draw the arrow;
var a_arp1= board.create('point',{#arrow1#},{name:function(){return nameRef.p[0]},face:'[]', size:3,attractors:[leftLine,rightLine,dotted1,dotted2,dotted3],attractorDistance:1,snatchDistance:2,fixed:fxd,showInfobox:false});
var b_arp1= board.create('point',[{#arrow1#}[0],{#arrow1#}[1]-wd],{name:function(){return nameRef.p[1]},size:1,attractors:[leftLine,rightLine,dotted1,dotted2,dotted3],attractorDistance:1, snatchDistance:2,fixed:fxd,showInfobox:false});
var Arrow1=board.create('segment',[a_arp1,b_arp1],{strokeColor:'red',lastarrow: {type: 2, size: 6}});
//arrow1 text
board.create('text',[{#arrow1#}[0],{#arrow1#}[1]-wd/2,function(){return {#arrow1txt#}}],{fontSize: 15, color:'black',attractors:[Arrow1],attractorDistance:10,snatchDistance:1000,showInfobox:false,useMathJax: true});

//----Arrow2-------
var a_arp2= board.create('point',{#arrow2#},{name:function(){return nameRef.p[2]}, face:'[]',size:3,attractors:[leftLine,rightLine,dotted1,dotted2,dotted3],attractorDistance:1,snatchDistance:2,fixed:fxd,showInfobox:false});
var b_arp2= board.create('point',[{#arrow2#}[0],{#arrow2#}[1]-wd],{name:function(){return nameRef.p[3]},size:1,attractors:[leftLine,rightLine,dotted1,dotted2,dotted3],attractorDistance:1, snatchDistance:2,fixed:fxd,showInfobox:false});
var Arrow2=board.create('segment',[a_arp2,b_arp2],{strokeColor:'red',lastarrow: {type: 2, size: 6}});

  //arrow2 text
board.create('text',[{#arrow2#}[0],{#arrow2#}[1]-wd/2,function(){return {#arrow2txt#}}],{fontSize: 15, color:'black',attractors:[Arrow2],attractorDistance:10,snatchDistance:1000,showInfobox:false,useMathJax: true});

  //---Arrow3-------
var a_arp3= board.create('point',{#arrow3#},{name:function(){return nameRef.p[4]}, face:'[]',size:3,attractors:[leftLine,rightLine,dotted1,dotted2,dotted3],attractorDistance:1,snatchDistance:2,fixed:fxd,showInfobox:false});
var b_arp3= board.create('point',[{#arrow3#}[0],{#arrow3#}[1]-wd],{name:function(){return nameRef.p[5]},size:1,attractors:[leftLine,rightLine,dotted1,dotted2,dotted3],attractorDistance:1, snatchDistance:2,fixed:fxd,showInfobox:false});
var Arrow3=board.create('segment',[a_arp3,b_arp3],{strokeColor:'red',lastarrow: {type: 2, size: 6}});

  //arrow3 text
board.create('text',[{#arrow3#}[0],{#arrow3#}[1]-wd/2,function(){return {#arrow3txt#}}],{fontSize: 15, color:'black',attractors:[Arrow3],attractorDistance:10,snatchDistance:1000,showInfobox:false,useMathJax: true});

  board.on('move', function(){
  
   b_arp1.moveTo([a_arp1.X(), b_arp1.Y()]);   
	 a_arp1.moveTo([a_arp1.X(),a_arp1.Y()]);
   b_arp2.moveTo([a_arp2.X(), b_arp2.Y()]);   
	 a_arp2.moveTo([a_arp2.X(),a_arp2.Y()]);
  b_arp3.moveTo([a_arp3.X(), b_arp3.Y()]);   
	 a_arp3.moveTo([a_arp3.X(),a_arp3.Y()]);
        
});  
  
stack_jxg.bind_point(DH1Ref,a_arp1);  
stack_jxg.bind_point(DH2Ref,b_arp1); 
stack_jxg.bind_point(Ea1Ref,a_arp2);
stack_jxg.bind_point(Ea2Ref,b_arp2);
stack_jxg.bind_point(Ear1Ref,a_arp3);
stack_jxg.bind_point(Ear2Ref,b_arp3);  board.update();  
//------draw text---------

 var state = {'x':{#react#}[0], 'y':{#react#}[1]};
 var stateInput = document.getElementById(reactRef);

if (stateInput.value!=( stateInput.value != '')) state = JSON.parse(stateInput.value);
 var reactants=board.create('text',[state['x'],state['y'],function(){return nameRef.reacttxt}],{fontSize: 18, color:'green',attractors:[leftLine,rightLine], attractorDistance:1.0 ,snatchDistance:2,fixed:fxd,useMathJax: true,anchorY:'bottom'});
  
  reactants.on('drag', function() {
    var newState = {'x':reactants.X(), 'y':reactants.Y()};
   stateInput.value = JSON.stringify(newState);stateInput.dispatchEvent(new Event('change'));
  });board.update();
 //----------------
  
 var state2 = {'x':{#prod#}[0], 'y':{#prod#}[1]};
 var stateInput2 = document.getElementById(prodRef);
if (stateInput2.value!=( stateInput2.value != '')) state2 = JSON.parse(stateInput2.value);
var products=board.create('text',[state2['x'],state2['y'],function(){return nameRef.prodtxt}],{fontSize: 18, color:'green',attractors:[leftLine,rightLine], attractorDistance:1.0 ,snatchDistance:2,fixed:fxd,useMathJax: true,anchorY:'bottom'});
  products.on('drag', function() {
    var newState2 = {'x':products.X(), 'y':products.Y()};
    stateInput2.value = JSON.stringify(newState2);stateInput2.dispatchEvent(new Event('change'));
  });board.update();
  
let rqm={#rqm#};
//board.create('text',[10,10,{#rqm#}]);

var checkAnswer= function(indx, mrk) {
  switch (indx) {
    case 6:
      if (mrk == 1) {
        nameRef.reacttxt = '✔' + nameRef.reacttxt;
      } else {
        nameRef.reacttxt = '<span style="font-size: 1.0em; color:red;">❌ </span>' + nameRef.reacttxt;
      }
board.update();
      break;
    case 7:
      if (mrk == 1) {
        nameRef.prodtxt = '✔' + nameRef.prodtxt;
      } else {
        nameRef.prodtxt = '<span style="font-size: 1.0em; color:red;">❌ </span>' + nameRef.prodtxt;
      }
board.update();
      break;
   default:
     nameRef.chkd=true;
      if (mrk == 1) {
        nameRef.p[indx] = '<span style="font-size: 1.5em; color:green;">✔'
      } else {
        {
          nameRef.p[indx] = '<span style="font-size: 1.5em; color:red;">❌</span>';
       }
      board.update(); }
  }
};
stack_js.get_content({#rqm#}).then((content) => {
if (content !== null) {
// As the content is not null this means the span is present so feedback is displayed and we can react to it here
if  ( !(nameRef.chkd)) {
 nameRef.chkd=true;
let grade =JSON.parse(content);
for (let i = 0; i !=8; i++) {checkAnswer(i,grade[i])};
console.log(grade);
board.update();  
}}});
  [[/jsxgraph]]
