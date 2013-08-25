var av=navigator.appVersion;
var ag=navigator.userAgent;
var bn=navigator.appName;
var fv=''+parseFloat(navigator.appVersion);
var mv=parseInt(navigator.appVersion,10);
var i,on,ov;

// In Chrome
if((ov=ag.indexOf("Chrome"))!=-1){
    bn="Chrome";
    fv=ag.substring(ov+7);
}

// In Microsoft internet explorer
else if((ov=ag.indexOf("MSIE"))!=-1){
    bn="Microsoft Internet Explorer";
    fv=ag.substring(ov+5);
}

// In Firefox
else if((ov=ag.indexOf("Firefox"))!=-1){
    bn="Firefox";
    fv= ag.substring(ov+8);
}

// In Safari
else if((ov=ag.indexOf("Safari"))!=-1){
    bn="Safari";
    fv=ag.substring(ov+7);
    if((ov=ag.indexOf("Version"))!=-1) fv=ag.substring(ov+8);
}

// In Opera
else if((ov=ag.indexOf("Opera"))!=-1) {
    bn="Opera";
    fv=ag.substring(ov+6);
}

// For other browser "name/version" is at the end of userAgent
else if((on=ag.lastIndexOf(' ')+1) < (ov=ag.lastIndexOf('/'))){
    bn=ag.substring(on,ov);
    fv=ag.substring(ov+1);
    if(bn.toLowerCase() == bn.toUpperCase()) {
        bn = navigator.appName;
    }
}

// trimming the fv string at semicolon/space if present
if((i=fv.indexOf(";"))!=-1) fv=fv.substring(0,i);
if((i=fv.indexOf(" "))!=-1) fv=fv.substring(0,i);

mv = parseInt(''+fv,10);
if (isNaN(mv)) {
    fv  = ''+parseFloat(navigator.appVersion);
    mv = parseInt(navigator.appVersion,10);
}

// Show info
/*document.write(''
    +'Browser name = '+bn+'<br />'
    +'Full version = '+fv+'<br />'
    +'Major version = '+mv+'<br />'
    +'navigator.appName = '+navigator.appName+'<br />'
    +'navigator.userAgent = '+navigator.userAgent+'<br />'
)*/

// Acepted browsers
var acpt = [
    ['Chrome','18'],
    ['Firefox','19'],
    ['Internet Explorer','10'],
    ['Opera','9'],
    ['Safari', '5']
];

var ok=false;
for(var i=0;i<acpt.length;i++) if(bn==acpt[i][0] && mv>=acpt[i][1]) ok=true;
if(!ok)document.body.className = 'navegador-obsoleto';
