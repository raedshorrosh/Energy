[[jsxgraph  input-ref-ans1='ans1Ref' input-ref-ans2='ans2Ref'  input-ref-ans5='stateRef5' input-ref-ans6='stateRef6']]
  // boundingbox:[left, top, right, bottom]

//snap grid for points in x
//JXG.Options.point.snapToGrid = true;
//JXG.Options.point.snapSizeX =  {#snapx#};
JXG.Options.text.cssDefaultStyle += ';direction:ltr; font-family:Arial;';
  JXG.Options.text.highlightCssDefaultStyle += ';direction:ltr;';
JXG.Options.layer.text = 0;

// initialize mathJax
/*
  MathJax.Hub.Config({
        extensions: ["tex2jax.js","TeX/AMSmath.js","TeX/AMSsymbols.js"],
        jax: ["input/TeX", "output/HTML-CSS"],
        tex2jax: {
          inlineMath: [ ['\(','\)'], ["\\(","\\)"] ],
          displayMath: [ ['\[','\]'], ["\\[","\\]"] ],
        },
        "HTML-CSS": { availableFonts: ["TeX"] }
      });
*/

var nameRef ={reacttxt:{#reactxt#}, prodtxt:{#prodtxt#}, p:["",""],chkd:false};

  var board = JXG.JSXGraph.initBoard(divid, {boundingbox: [-20, 10, 20, -10], axis: false, showCopyright: false,showNavigation:false,pan:{enabled:false},zoom:{enabled:false},resize: {enabled:false}});
var checkAnswer=[];

var xp={#Axis_p#},ylable_p={#ylable_p#};
//lines top and bottom and hidden

var lineTop = board.create('segment', [[xp+1, {#top_line#}],[{#l_length#}+xp, {#top_line#}]], {strokeColor:'black',strokeWidth:3,fixed: true});
var lineBottom = board.create('segment', [[xp+1.0,{#top_line#}-{#gap#}],[{#l_length#}+xp,{#top_line#}-{#gap#}]], {strokeColor:'black',strokeWidth:3,fixed: true});

//axis arrow
 var e_axis= board.create('arrow',[[xp,-9.0],[xp,9.0]], {strokeColor:'black', strokeWidth:3, fixed:true});
 board.create('text',[xp-1,ylable_p,'{@enthalpy@}'],{fontSize: 18, color:'black', fixed: true,  display: 'internal',rotate: 90});

//Reaction arrow
var a_arp= board.create('point',[xp-12,1],{name:function(){return nameRef.p[0]},face:'[]', size:3,attractors:[lineBottom,lineTop],attractorDistance:0.5,snatchDistance:1,  showInfobox:false,fixed:function(){return nameRef.chkd}});
var b_arp= board.create('point',[xp-12,-3],{name:function(){return nameRef.p[1]},size:1,attractors:[lineBottom,lineTop],attractorDistance:0.5, snatchDistance:1,showInfobox:false,fixed:function(){return nameRef.chkd}});

var rctArrow=board.create('segment',[a_arp,b_arp],{strokeColor:'red',lastarrow: {type: 2, size: 6}});

board.on('move', function(){
   b_arp.moveTo([a_arp.X(), b_arp.Y()]);   
	 a_arp.moveTo([a_arp.X(),a_arp.Y()]);
      
});

//reactans text
// State represented as a JS-object, first define default then try loading the stored values.
  var state = {'x':xp-14, 'y':2};
  var stateInput = document.getElementById(stateRef5);

if (stateInput.value!=( stateInput.value != '')) state = JSON.parse(stateInput.value);


var reactants=board.create('text',[state['x'],state['y'],function(){return nameRef['reacttxt']}],{fontSize: 18, color:'green',attractors:[lineTop,lineBottom], attractorDistance:1.0 ,snatchDistance:2,useMathJax: true,anchorY:'bottom',fixed:function(){return nameRef.chkd}});

 // And finally the most important thing, update the stored state when things change.
  reactants.on('drag', function() {
    var newState = {'x':reactants.X(), 'y':reactants.Y()};
    // Encode the state as JSON for storage and store it
    stateInput.value = JSON.stringify(newState);stateInput.dispatchEvent(new Event('change'));
  });

//products
  var state2 = {'x':xp-14, 'y':4};
  var stateInput2 = document.getElementById(stateRef6);
  if (stateInput2.value !=(stateInput2.value != '')) {
    state2 = JSON.parse(stateInput2.value);
  }

var products=board.create('text',[state2['x'],state2['y'],function(){return nameRef['prodtxt']}],{fontSize: 18, color:'green',attractors:[lineTop,lineBottom], attractorDistance:1.0 ,snatchDistance:2,useMathJax: true,anchorY:'bottom',fixed:function(){return nameRef.chkd}});

// And finally the most important thing, update the stored state when things change.
  products.on('drag', function() {
    var newState2 = {'x':products.X(), 'y':products.Y()};
    // Encode the state as JSON for storage and store it
    stateInput2.value = JSON.stringify(newState2);stateInput2.dispatchEvent(new Event('change'));

  });


//bind and hide 
a_arp.x=b_arp.x;
stack_jxg.bind_point(ans1Ref,a_arp);board.update();
stack_jxg.bind_point(ans2Ref,b_arp);board.update();

let rqm={#rqm#};
let correctMark='<span style="font-size: 1.5em; color:green;">✔ </span>';
let incorrectMark='<span style="font-size: 0.5em; color:red;">❌ </span>';
var answered1=0,answered2=0,answered3=0,answered4=0;

stack_js.get_content({#rqm#}+"a").then((content) => {
if (content !== null) {
// As the content is not null this means the span is present so feedback is displayed and we can react to it here
if  ( !(answered1)) {
      answered1=true;
let grade =JSON.parse(content)[0];
	if (grade==1){
        nameRef.p[0] =correctMark
      } else
        {
          nameRef.p[0] = incorrectMark;
       }

board.update();  
}}});

stack_js.get_content({#rqm#}+"b").then((content) => {
if (content !== null) {
// As the content is not null this means the span is present so feedback is displayed and we can react to it here
if  ( !(answered2)) {
      answered2=true;
let grade =JSON.parse(content)[0];
	if (grade==1){
        nameRef.p[1] = correctMark
      } else 
        {
          nameRef.p[1] =incorrectMark;
       }

board.update();  
}}});

stack_js.get_content({#rqm#}+"c").then((content) => {
if (content !== null) {
// As the content is not null this means the span is present so feedback is displayed and we can react to it here
if  ( !(answered3)) {
      answered3=true;
let grade =JSON.parse(content)[0];
	if (grade==1){
        nameRef.reacttxt = correctMark + nameRef.reacttxt;
      } else {
        nameRef.reacttxt = incorrectMark + nameRef.reacttxt;
      }

board.update();  
}}});

stack_js.get_content({#rqm#}+"d").then((content) => {
if (content !== null) {
// As the content is not null this means the span is present so feedback is displayed and we can react to it here
if  ( !(answered4)) {
      answered4=true;
let grade =JSON.parse(content)[0];
	if (grade==1){
        nameRef.prodtxt =correctMark + nameRef.prodtxt;
      } else {
        nameRef.prodtxt = incorrectMark + nameRef.prodtxt;
      }
nameRef.chkd=true;
board.update();  
}}});





[[/jsxgraph]]
