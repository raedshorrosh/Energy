<script type="text/javascript">
 var checkAnswer=[];
</script>


[[jsxgraph  input-ref-ans1='ans1Ref' input-ref-ans2='ans2Ref'  input-ref-ans5='stateRef5' input-ref-ans6='stateRef6']]
  // boundingbox:[left, top, right, bottom]

//snap grid for points in x
//JXG.Options.point.snapToGrid = true;
//JXG.Options.point.snapSizeX =  {#snapx#};
JXG.Options.layer.text = 0;

// initialize mathJax
  MathJax.Hub.Config({
        extensions: ["tex2jax.js","TeX/AMSmath.js","TeX/AMSsymbols.js"],
        jax: ["input/TeX", "output/HTML-CSS"],
        tex2jax: {
          inlineMath: [ ['\(','\)'], ["\\(","\\)"] ],
          displayMath: [ ['\[','\]'], ["\\[","\\]"] ],
        },
        "HTML-CSS": { availableFonts: ["TeX"] }
      });


var nameRef ={reacttxt:{#reactxt#}, prodtxt:{#prodtxt#}, p:["",""],chkd:false};

  var board = JXG.JSXGraph.initBoard(divid, {boundingbox: [-20, 10, 20, -10], axis: false, showCopyright: false,showNavigation:false,pan:{enabled:false},zoom:{enabled:false},resize: {enabled:false}});


var xp={#Axis_p#}; 
//lines top and bottom and hidden

var lineTop = board.create('segment', [[xp+1, {#top_line#}],[{#l_length#}+xp, {#top_line#}]], {strokeColor:'black',strokeWidth:3,fixed: true});
var lineBottom = board.create('segment', [[xp+1.0,{#top_line#}-{#gap#}],[{#l_length#}+xp,{#top_line#}-{#gap#}]], {strokeColor:'black',strokeWidth:3,fixed: true});

//axis arrow
 var e_axis= board.create('arrow',[[xp,-9.0],[xp,9.0]], {strokeColor:'black', strokeWidth:3, fixed:true});
 board.create('text',[xp-1,8,'{@enthalpy@}'],{fontSize: 20, color:'black', fixed: true,  display: 'internal',rotate: 90});

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
  var state = {'x':xp-12, 'y':2};
  var stateInput = document.getElementById(stateRef5);

if (stateInput.value!=( stateInput.value != '')) state = JSON.parse(stateInput.value);


var reactants=board.create('text',[state['x'],state['y'],function(){return nameRef['reacttxt']}],{fontSize: 18, color:'green',attractors:[lineTop,lineBottom], attractorDistance:1.0 ,snatchDistance:2,useMathJax: true,anchorY:'bottom',fixed:function(){return nameRef.chkd}});

 // And finally the most important thing, update the stored state when things change.
  reactants.on('drag', function() {
    var newState = {'x':reactants.X(), 'y':reactants.Y()};
    // Encode the state as JSON for storage and store it
    stateInput.value = JSON.stringify(newState);
  });

//products
  var state2 = {'x':xp-12, 'y':3};
  var stateInput2 = document.getElementById(stateRef6);
  if (stateInput2.value !=(stateInput2.value != '')) {
    state2 = JSON.parse(stateInput2.value);
  }

var products=board.create('text',[state2['x'],state2['y'],function(){return nameRef['prodtxt']}],{fontSize: 18, color:'green',attractors:[lineTop,lineBottom], attractorDistance:1.0 ,snatchDistance:2,useMathJax: true,anchorY:'bottom',fixed:function(){return nameRef.chkd}});

// And finally the most important thing, update the stored state when things change.
  products.on('drag', function() {
    var newState2 = {'x':products.X(), 'y':products.Y()};
    // Encode the state as JSON for storage and store it
    stateInput2.value = JSON.stringify(newState2);

  });


//bind and hide 
a_arp.x=b_arp.x;
stack_jxg.bind_point(ans1Ref,a_arp);board.update();
stack_jxg.bind_point(ans2Ref,b_arp);board.update();

let rqm={#rqm#};
checkAnswer[rqm] = function(indx, mrk) {
  switch (indx) {
    case 2:
      if (mrk == 1) {
        nameRef.reacttxt = '<i class="fa fa-check"></i>' + nameRef.reacttxt;
      } else {
        nameRef.reacttxt = '<span style="font-size: 1.0em; color:red;"><i class="fa fa-times"></i> </span>' + nameRef.reacttxt;
      }
board.update();
      break;
    case 3:
      if (mrk == 1) {
        nameRef.prodtxt = '<i class="fa fa-check"></i>' + nameRef.prodtxt;
      } else {
        nameRef.prodtxt = '<span style="font-size: 1.0em; color:red;"><i class="fa fa-times"></i> </span>' + nameRef.prodtxt;
      }
board.update();
      break;
    case 8:
      if (mrk == 1) {
 nameRef.mrkH='<span style="font-size: 1.25em; color:green;"><i class="fa fa-check"></i></span>'}
 else {
 nameRef.mrkH='<span style="font-size: 1.0em; color:red;"><i class="fa fa-times"></i></span>'      }
board.update();
      break;
   case 9:
      if (mrk == 1) {
 nameRef.mrkE='<span style="font-size: 1.25em; color:green;"><i class="fa fa-check"></i></span>'}
 else {
 nameRef.mrkE='<span style="font-size: 1.0em; color:red;"><i class="fa fa-times"></i></span>'      }
board.update();
      break;
    default:
     nameRef.chkd=true;
      if (mrk == 1) {
        nameRef.p[indx] = '<span style="font-size: 1.5em; color:green;"><i class="fa fa-check"></i>'
      } else {
        {
          nameRef.p[indx] = '<span style="font-size: 1.5em; color:red;"><i class="fa fa-times"></i></span>';
       }
      board.update(); }
  }
};
let feedback={#feedback#};var fdbk=document.getElementById("div"); fdbk.setAttribute("id",{#rqm#});
if ( feedback==1) {document.getElementById({#rqm#}).style.display = "block"}
else {document.getElementById({#rqm#}).style.display = "none"};


[[/jsxgraph]]
