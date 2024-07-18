
[[jsxgraph width="600px" input-ref-ans1='ans1Ref'  input-ref-ans2='ans2Ref'  input-ref-ans3='ans3Ref' input-ref-ans4='ans4Ref'  input-ref-ans50='ans50Ref'  input-ref-ans51='ans51Ref'  input-ref-ans5='stateRef5'  input-ref-ans6='stateRef6'  input-ref-ans7='stateRef7']]

var nameRef ={txttop:{#txttop#}, txtmid:{#txtmid#},txtbot:{#txtbot#}, p:["","","","","",""],chkd:false};
JXG.Options.text.cssDefaultStyle += ';direction:ltr; font-family:Arial;';
JXG.Options.text.highlightCssDefaultStyle += ';direction:ltr;';
JXG.Options.layer.text = 0;


//-----------------------------------------------------------------------
  var board = JXG.JSXGraph.initBoard(divid, {boundingbox: [-25, 10, 25, -10], axis: false, showCopyright: false,showNavigation:false,pan:{enabled:false},zoom:{enabled:false},resize: {enabled:false}});

var xp={#Axis_p#},ylable_p={#ylable_p#};
//lines top and bottom and hidden

var lineTop = board.create('segment', [[xp+1.0, {#top_line#}],[{#l_length#}+xp, {#top_line#}]], {strokeColor:'black',strokeWidth:3,fixed: true});

var lineMid = board.create('segment', [[xp+1.0,{#top_line#}-{#gap#}],[{#l_length#}+xp,{#top_line#}-{#gap#}]], {strokeColor:'black',strokeWidth:3,fixed: true});


var lineBottom = board.create('segment', [[xp+1.0,{#top_line#}-{#gap#}-{#gap2#}],[{#l_length#}+xp,{#top_line#}-{#gap#}-{#gap2#}]], {strokeColor:'black',strokeWidth:3,fixed: true});



//axis arrow
 var e_axis= board.create('arrow',[[xp,-9.0],[xp,9.0]], {strokeColor:'black', strokeWidth:3, fixed:true});
 board.create('text',[xp-1,ylable_p,'{@enthalpy@}'],{fontSize: 18, color:'black', fixed: true,  display: 'internal',rotate: 90});

//Reaction arrows
//-------------------------------------------------------------------
var a_arp1= board.create('point',[xp-13,0],{name:function(){return nameRef.p[0]}, face:'[]',size:3,attractors:[lineBottom,lineTop,lineMid ],attractorDistance:0.5,snatchDistance:1,  showInfobox:false, fixed:function(){return nameRef.chkd}});
var b_arp1= board.create('point',[xp-13,-3],{name:function(){return nameRef.p[1]},size:1,attractors:[lineBottom,lineTop,lineMid ],attractorDistance:0.5, snatchDistance:1,showInfobox:false,fixed:function(){return nameRef.chkd}});
var rctArrow1=board.create('segment',[a_arp1,b_arp1],{strokeColor:'red',lastarrow: {type: 2, size: 6}});
//arrow1 text

board.create('text',[xp-12,-2,function(){return{#arrow1Lable#}}],{fontSize: 15, color:'black',attractors:[rctArrow1],attractorDistance:10,snatchDistance:1000,  showInfobox:false,useMathJax: true});

//---------------------------------------------------------------------
var a_arp2= board.create('point',[xp-8,0],{name:function(){return nameRef.p[2]},face:'[]', size:3,attractors:[lineBottom,lineTop,lineMid ],attractorDistance:0.5,snatchDistance:1,  showInfobox:false, fixed:function(){return nameRef.chkd}});
var b_arp2= board.create('point',[xp-8,-3],{name:function(){return nameRef.p[3]},size:1,attractors:[lineBottom,lineTop,lineMid ],attractorDistance:0.5, snatchDistance:1,showInfobox:false, fixed:function(){return nameRef.chkd}});

var rctArrow2=board.create('segment',[a_arp2,b_arp2],{strokeColor:'red',lastarrow: {type: 2, size: 6}});
//arrow2 text

board.create('text',[xp-12,-2,function(){return{#arrow2Lable#}}],{fontSize: 15, color:'black',attractors:[rctArrow2],attractorDistance:10,snatchDistance:1000,  showInfobox:false,useMathJax: true});

//-------------------------------------------------------------------------------------------------
var a_arp3= board.create('point',[xp-10,-4],{name:function(){return nameRef.p[4]},face:'[]', size:3,attractors:[lineBottom,lineTop,lineMid ],attractorDistance:0.5,snatchDistance:1,  showInfobox:false, fixed:function(){return nameRef.chkd}});
var b_arp3= board.create('point',[xp-10,-7],{name:function(){return nameRef.p[5]},size:1,attractors:[lineBottom,lineTop,lineMid ],attractorDistance:0.5, snatchDistance:1,showInfobox:false, fixed:function(){return nameRef.chkd}});

var rctArrow3=board.create('segment',[a_arp3,b_arp3],{strokeColor:'red',lastarrow: {type: 2, size: 6}});

//arrow3 text

board.create('text',[xp-12,-5,function(){return{#arrow3Lable#}}],{fontSize: 15, color:'black',attractors:[rctArrow3],attractorDistance:10,snatchDistance:1000,  showInfobox:false,useMathJax: true});

  board.on('move', function(){
  
   b_arp1.moveTo([a_arp1.X(), b_arp1.Y()]);   
	 a_arp1.moveTo([a_arp1.X(),a_arp1.Y()]);
   b_arp2.moveTo([a_arp2.X(), b_arp2.Y()]);   
	 a_arp2.moveTo([a_arp2.X(),a_arp2.Y()]);
  b_arp3.moveTo([a_arp3.X(), b_arp3.Y()]);   
	 a_arp3.moveTo([a_arp3.X(),a_arp3.Y()]);
        
});  

//----------------------------------------------------------------------------------------------

//top text
// State represented as a JS-object, first define default then try loading the stored values.
  var state = {'x':xp-18, 'y':2};
  var stateInput = document.getElementById(stateRef7);
  if (stateInput.value !=(stateInput.value != '')) {
    state = JSON.parse(stateInput.value);
  }


 var reactTop=board.create('text',[state['x'],state['y'],function(){return nameRef.txttop}],{fontSize: 15, color:'green',attractors:[lineTop,lineBottom,lineMid], attractorDistance:1.0 ,snatchDistance:2,useMathJax: true,anchorY:'bottom',fixed:function(){return nameRef.chkd}});

 // And finally the most important thing, update the stored state when things change.
  reactTop.on('drag', function() {
    var newState = {'x':reactTop.X(), 'y':reactTop.Y()};
    // Encode the state as JSON for storage and store it
    stateInput.value = JSON.stringify(newState);stateInput.dispatchEvent(new Event('change'));
  });

//products
  var state2 = {'x':xp-18, 'y':3};
  var stateInput2 = document.getElementById(stateRef6);
  if (stateInput2.value !=(stateInput2.value != '')) {
    state2 = JSON.parse(stateInput2.value);
  }

 var reactMid=board.create('text',[state2['x'],state2['y'],function(){return nameRef.txtmid}],{fontSize: 15, color:'green',attractors:[lineTop,lineBottom,lineMid], attractorDistance:1.0 ,snatchDistance:2,useMathJax: true,anchorY:'bottom',fixed:function(){return nameRef.chkd}});

// And finally the most important thing, update the stored state when things change.
  reactMid.on('drag', function() {
    var newState2 = {'x':reactMid.X(), 'y':reactMid.Y()};
    // Encode the state as JSON for storage and store it
    stateInput2.value = JSON.stringify(newState2);stateInput2.dispatchEvent(new Event('change'));

  });

 var state3 = {'x':xp-18, 'y':4};
  var stateInput3 = document.getElementById(stateRef5);
  if (stateInput3.value !=( stateInput3.value != '')) {
    state3 = JSON.parse(stateInput3.value);
  }

 var reactBot=board.create('text',[state3['x'],state3['y'],function(){return nameRef.txtbot}],{fontSize: 15, color:'green',attractors:[lineTop,lineBottom,lineMid], attractorDistance:1.0 ,snatchDistance:2,useMathJax: true,anchorY:'bottom',fixed:function(){return nameRef.chkd}});


// And finally the most important thing, update the stored state when things change.
  reactBot.on('drag', function() {
    var newState3 = {'x':reactBot.X(), 'y':reactBot.Y()};
    // Encode the state as JSON for storage and store it
    stateInput3.value = JSON.stringify(newState3);stateInput3.dispatchEvent(new Event('change'));

  });
//------------------------------------------------------

//bind points

stack_jxg.bind_point(ans1Ref,a_arp1);board.update();
stack_jxg.bind_point(ans2Ref,b_arp1);board.update();

stack_jxg.bind_point(ans3Ref,a_arp2);board.update();
stack_jxg.bind_point(ans4Ref,b_arp2);board.update();

stack_jxg.bind_point(ans50Ref,a_arp3);board.update();
stack_jxg.bind_point(ans51Ref,b_arp3);board.update();

let rqm={#rqm#};
//board.create('text',[10,10,{#rqm#}]);
//var nameRef ={txttop:{#txttop#}, txtmid:{#txtmid#},txtbot:{#txtbot#}, p:["","","","","",""],chkd:false};


let correctMark='<span style="font-size: 1.5em; color:green;">✔ </span>';
let incorrectMark='<span style="font-size: 0.5em; color:red;">❌ </span>';

var checkAnswer= function(indx, mrk) {
  switch (indx) {
    case 6:
      if (mrk == 1) {
        nameRef.txtbot= correctMark + nameRef.txtbot;
      } else {
        nameRef.txtbot=incorrectMark + nameRef.txtbot;
      }
     board.update();
      break;
    case 7:
      if (mrk == 1) {
        nameRef.txtmid= correctMark + nameRef.txtmid;
      } else {
        nameRef.txtmid= incorrectMark + nameRef.txtmid;
      }
board.update();
      break;
    case 8:
      if (mrk == 1) {
 nameRef.txttop=correctMark + nameRef.txttop;}
 else {
 nameRef.txttop=incorrectMark+ nameRef.txttop;
 }
board.update();
      break;

    default:
     nameRef.chkd=true;
      if (mrk == 1) {
        nameRef.p[indx] = correctMark;
      } else {
        {
          nameRef.p[indx] = incorrectMark;
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
for (let i = 0; i != 9; i++) {checkAnswer(i,grade[i])};
console.log(grade);
board.update();  
}}});

[[/jsxgraph]]</span>
