
[[jsxgraph  width="800px" height="400px"  input-ref-states='statesRef'  input-ref-ans1='DHtot'  input-ref-DHval1='DHst1' input-ref-DHval2='DHst2' input-ref-DHval3='DHst3' input-ref-DHval4='DHst4' input-ref-DHval5='DHst5']]
 JXG.Options.text.cssDefaultStyle += 'direction:ltr; font-family:Arial;';
  JXG.Options.text.highlightCssDefaultStyle += 'direction:ltr;';
  let rqm={#rqm#};
  function isless(x,y) {return (x<y)};
  function iand(x,y)  {return (x&&y)};
  function igrt(x,y)  {return (x>y)};
  function igrtq(x,y)  {return (x>=y)};
  function ispositive(x) {return (x>0)};
  function ibetween(a,x,y) {return ((a>x)&&(a<y))};
  function dist(a,b){return Math.sqrt((a[0]-b[0])*(a[0]-b[0])+(a[1]-b[1])*(a[1]-b[1]))};
  function indexOf2dArray(array2d, itemtofind) {
         var  index = [].concat.apply([], ([].concat.apply([], array2d))).indexOf(itemtofind);
           if (index === -1) { return false; }
         var   numColumns = array2d[0].length;
         var   row = parseInt(index / numColumns);
         var   col = index % numColumns;
        return [row, col]; 
    }
//board
var board = JXG.JSXGraph.initBoard(divid, {
  boundingbox: [-5, 5, 15, -5],
   axis: false,
  showCopyright: false,
  showNavigation: false,
  keepaspectratio: true,
  pan:{enabled:false},
  zoom:{enabled:false},
  resize: {enabled:false},
  keyboard: {enabled: false}
});

var eqx=[];
var answered=false;
var ceqs={#ceqs#},eq0={#ceq0#},jmax=ceqs.length;
var ncolors={#clrs#},btoken={#btoken#};
var DH={#DH#},correct={#answers#};
var markpos={#markposition#};
var top=2,fontsize=19;
var input=[],Einput=[],checkbox=[],DHv=[],answers=[];
var eqn,i;
var t1,t2,indx,factor;
var mark=[];
var getmark=function(n) {return mark[n]};  

// write top equation---------------
  var eqmap={#eqmap#}, tmp={#ceq0#},indx=eqmap.indexOf(0);
  eqmap.splice(indx,1);
  for (const x in tmp){
  tmp[x]=eqmap[x]+ncolors[x]+tmp[x]+btoken;
   }
  tmp.splice(indx,0,"⟶");
  var str=tmp.join(' + ');
    str=str.replaceAll('+ ⟶ +',' ⟶ ');
  str=str.replaceAll('1','');

board.create('text',[-2.75,top+1,str], {
  fontSize: fontsize,
  fixed: true,
  anchorY: 'bottom'
});
//--------------------------------------------  
  
for (let j=0;isless(j,2*jmax+1);j++){mark[j]=''};

var ans=document.getElementById(statesRef);
var DHtotal=document.getElementById(DHtot);
//----
var DHSt=[document.getElementById(DHst1),document.getElementById(DHst2),document.getElementById(DHst3),document.getElementById(DHst4),document.getElementById(DHst5)];
//----

// set up top icons


//set up equations and fill array
  for (const j in ceqs){

 eqn='';
 var arindex=indexOf2dArray(ceqs[j],0);
 for (const x in ceqs[j]){
 var a1='',a2='',a3='',tmp,indx=-1;
      tmp=ceqs[j][x][0];
   if (tmp!=0){
    a1='\${i*'+tmp+'==1'+"?'':i*"+tmp+'}';
     indx=eq0.indexOf(ceqs[j][x][1]);
     if (indx!=-1){a1+=ncolors[indx];a3=btoken}
    }
    a2=a1+ceqs[j][x][1]+a3;
   if( (x==arindex[0])||(x==arindex[0]-1)||(x==ceqs[j].length-1) ) {a2=a2+''} else {a2=a2+' + '};
    eqn=eqn+a2;
  }
  eqx[j]=eqn;
}

board.create('text',[-3.75,top+0.4,'✖'],{
  fontSize: fontsize,
  fixed: true,
  anchorY: 'bottom'
});
  board.create('text',[-4.8,top+0.4,'↔'],{
  fontSize: fontsize*1.3,
  fixed: true,
  anchorY: 'bottom'
});  
  
//multiplication input fields
for (let j = 0;isless(j, jmax); j++) {
 input[j] = board.create('input', [-4, top-j, '1',''], {
  cssStyle: 'width:40px;',
  fixed:true,
  fontsize: fontsize*0.8
  });

//checkboxes
 checkbox[j] = board.create('checkbox', [-4.8,top-j, ''], {fixed:true});

//equation !!

//eqx[j]=eqn;
 board.create('text', [-2.75, top-0.35-j,function(){
 eqn =eqx[j];

var temp;
try {temp=eval(input[j].Value());}
catch(e) {temp=1;}
if (!isNaN(temp*1)) {i=Math.abs(temp)} else {i=1};

eqn=eval('`'+eqn+'`');
var t1,t2,indx,factor,temp;
indx=eqn.indexOf('⟶');
t1=eqn.substring(0,indx-1);
t2=eqn.substring(indx+1);
if (checkbox[j].Value())
{eqn=t2+' ⟶ '+t1;factor=-1*i;temp=1} else {eqn=t1+' ⟶ '+t2;factor=i;temp=0};
DHv[j]=DH[j]*factor;
  //return eqn+' '+getmark(j);
  return eqn; //version 2
}], {
  fontSize: fontsize,
  fixed: true,
  anchorY: 'bottom'
});

//energy input fields by student
 Einput[j] = board.create('input', [8, top-j, '','ΔH='], {
  cssStyle: 'width:120px;',
  fixed:true,
  fontsize: fontsize
  });

//writing the kJ and marks
 board.create('text', [markpos, top-0.35-j,function(){return 'kJ'+getmark(j+jmax)}], {
  fontSize: fontsize,
  fixed: true,
  anchorY: 'bottom'
});

}//for

//summing the energy
var total=board.create('text', [-2.75, top-1-jmax,function(){
var temp,temp2,temp3,tot=0,txt='ΔH_{tot} = ';
for (let ii=0;isless(ii,jmax);ii++){
   temp=0;

if (ii==(jmax-1)) {txt=txt+answers[ii]+'⋅ΔH_'+(ii+1)} else {txt=txt+answers[ii]+'⋅ΔH_'+(ii+1)+'+'};
txt=txt.replaceAll('+-','-');
txt=txt.replaceAll('++','+');
txt=txt.replaceAll('1⋅','');


try{  temp=eval(Einput[ii].Value());}
catch(e) {console.log(1);temp=0}
  tot= tot+temp ;
}
if (!isNaN(tot)) {DHtotal.value=tot.toFixed(1);temp2=' = '+tot.toFixed(1),temp3=' kJ '} else {temp2='',temp3=''};
return '<a style="color:blue;">'+txt+temp2+temp3 +'</a>'+getmark(2*jmax);
}], {
  fontSize: fontsize,
  fixed: true,
  anchorY: 'bottom'
});


if (ans.value !='') {
answers=JSON.parse(ans.value);
   for (let ii=0;isless(ii,jmax);ii++) {
    checkbox[ii].rendNodeCheckbox.checked = isless(answers[ii],0);
    input[ii].set(Math.abs(answers[ii]));
   // if (DHSt[ii].value=='') {DHSt[ii].value=DH[ii]}
        Einput[ii].set(DHSt[ii].value);
    }
}
else  for (let ii=0;isless(ii,jmax);ii++) {answers[ii]=1;ans.value=JSON.stringify(answers);ans.dispatchEvent(new Event('change'));Einput[ii].set('');}
 
board.update();  

for (let j=0;isless(j,jmax);j++) {
JXG.addEvent(checkbox[j].rendNodeCheckbox, 'change', function() {
var temp=1;
try {temp=eval(input[j].Value())}
catch(e){temp=1};
if (!isNaN(temp*1)) {answers[j]=(this.Value()?-1:+1)*temp;ans.value=JSON.stringify(answers);ans.dispatchEvent(new Event('change'));} 
    //answers[j]=(this.Value()?-1:1)*parseFloat(input[j].Value());
     //ans.value=JSON.stringify(answers);
board.update();  
}, checkbox[j]);

JXG.addEvent(input[j].rendNodeInput, 'input', function() {
    var temp=1;
    try {temp=eval(input[j].Value())}
    catch(e){temp=1};
if (!isNaN(temp*1)) {answers[j]=(checkbox[j].Value()?-1:+1)*temp; ans.value=JSON.stringify(answers);ans.dispatchEvent(new Event('change'));}
    //answers[j]=(checkbox[j].Value()?-1:1)*parseFloat(input[j].Value());
     //ans.value=JSON.stringify(answers);
board.update();  
}, input[j]);

JXG.addEvent(Einput[j].rendNodeInput, 'input', function() {
DHSt[j].value=Einput[j].Value();DHSt[j].dispatchEvent(new Event('change'));
board.update();  
}, Einput[j]);


}//for

var checkAnswer=function() {
var t0,ta={#ta#};
var temp2;
var markC='<span style="font-size: 1.0em; color:green;">✔</span>';
var markF='<span style="font-size: 1.0em; color:red;">❌</span>';
for (let j = 0; isless(j,jmax); j++){
  if  (answers[j]==correct[j]) {mark[j]=markC} else {mark[j]=markF};
     //t0=correct[j]*DH[j];
     t0=answers[j]*DH[j]; //version 2
    temp2=Math.abs(eval(Einput[j].Value())-t0);
    if (isless(temp2,1)) {mark[j+jmax]=markC} else {mark[j+jmax]=markF};  
//    ta=ta+t0;
    input[j].rendNodeTag.disabled=true;
    Einput[j].rendNodeTag.disabled=true;
    checkbox[j].rendNodeTag.disabled=true;
  }
 var temp= Math.abs(DHtotal.value-ta);
if (isless(temp,3)) {mark[2*jmax]=markC} else {mark[2*jmax]=markF};
      
  
board.update(); 
};

stack_js.get_content({#rqm#}).then((content) => {
if (content !== null) {
// As the content is not null this means the span is present so feedback is displayed and we can react to it here
if  (!answered ) {
answered=true;
checkAnswer();
}}});

[[/jsxgraph]]
