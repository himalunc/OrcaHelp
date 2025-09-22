var color    = new Array();
var detectorPaths = new Array();
var preampPaths = new Array();
var type = 0;
var detector;
var preamp;
var colorBar;
$(document).ready(function() {
    makeDetector(400);
    //makePreamp(600);
    makeColorBar();
});

var colorMap = new Array();
var segValue = new Array();

function makeColorBar(size)
{
    if(colorBar)return;
    colorBar = Raphael('colorBar', 20, 400);
    var y=0;
    var delta = 400/512;
    for(var j=0;j<512;j++){
        var aPath =  colorBar.rect(0,y,20,y+delta);
        var i = 511-j;
        aPath.attr({fill:colorMap[i],stroke:colorMap[i]});
        y += delta;
   }
}

function makeDetector(size)
{

    if(detector)return;
    
    makeColors();
    
    var defaultColor = '#f5f5f5';
    
    detector = Raphael('detector', size, size);
	var	attributes = {
            fill:'#fff',
            stroke: '#888888'
        }
        
    var kStaggeredSegments = true,
        kNumRings = 13,
        kNumSegmentsPerRing	= 12;

    var xc   = size/2.,
        yc   = size/2.,
        r    = xc * .16,            //radius of the center focalPlaneSegment NOTE: sets the scale of the whole thing
        area = 2*Math.PI*r*r/4.;	//area of the center focalPlaneSegment

	var startAngle, deltaAngle;
    var segId = 0;
    
	r = 0;
    
    
	for(var j=0;j<kNumRings;j++){
		var numSeqPerRings;
		if(j==0){
			numSeqPerRings = 4;
			startAngle = 0.;
		}
		else {
			numSeqPerRings = kNumSegmentsPerRing;
			if(kStaggeredSegments){
				if(!(j%2))startAngle = 0;
				else startAngle = (-360./numSeqPerRings/2.);	
			}
			else startAngle = 0;
		}
		deltaAngle = (360./numSeqPerRings);

		//calculate the next radius, where the area of each 1/12 of the ring is equal to the center area.
		var r2 = Math.sqrt(numSeqPerRings*area/(Math.PI*2) + r*r);
		var x1,x2,y1,y2;
		for(var i=0;i<numSeqPerRings;i++){
            var p = arc([xc,yc],r,r2,startAngle,startAngle+deltaAngle);
            
            var aPath = detector.path(p);
            detectorPaths[segId] = aPath;
            aPath.id = segId;
            startAngle += deltaAngle;
            
            if(!color[segId]){
                color[segId] = defaultColor;
            }
            aPath.attr(attributes);
            aPath.attr({fill:color[segId]});

            setup(aPath);
            
            segId++;
        }
        r = r2;
	}
}

function makeColors()
{
    var index = 0;
    //bring up the green
    for(var i=0;i<128;i++){
        var c = i*255/128;
        colorMap[index] = "rgb(0,"+c+",255)";
        index= index+1;
    }
    for(var i=0;i<128;i++){
        var c = 255-i*255/128;
        colorMap[index] = "rgb(0,255,"+ c +")";
        index= index+1;
    }
    for(var i=0;i<128;i++){
        var c = i*255/128;
        colorMap[index] = "rgb("+c+",255,0)";
        index= index+1;
    }
    for(var i=0;i<128;i++){
        var c = 255-i*255/128;
        colorMap[index] = "rgb(255,"+c+",0)";
        index= index+1;
    }

}


function makePreamp(size)
{
    if(preamp)return;
    var defaultColor = '#eeeeee';
    preamp = Raphael('preamp', size, size);
    var	attributes = {
            fill:'#fff',
            stroke: '#888888'
        }
    var xc   = size/2.,
        yc   = size/2.;

    var len = 25;
    var  w = 10;
    
   
    //inner part
    var segId=0;
    for(var i=0;i<4;i++){
        var aPath =  preamp.rect(xc+w/2+w/2,yc-w/2,len-1,w);
        preampPaths[segId] = aPath;
        aPath.id = segId;
        aPath.rotate(i*360/4. + 2*360/24.,xc,yc);
        if(!color[segId]){
            color[segId] = defaultColor;
        }
        aPath.attr(attributes);
        aPath.attr({fill:color[segId]});
        
        setup(aPath);

        segId++;
    }
    for(var j=0;j<6;j++){
        var angle = 0;
        var deltaAngle = (360/12.);
        for(var i=0;i<24;i++){
            var aPath =  preamp.rect(len+10+j*len,-w/2,len-1,w);
             preampPaths[segId] = aPath;
            aPath.id = segId;
            aPath.translate(xc,yc);
            aPath.rotate(angle,xc,yc);
            if(!color[segId]){
                color[segId] = defaultColor;
            }
            aPath.attr(attributes);
            aPath.attr({fill:color[segId]});
            
            setup(aPath);
      
            angle += deltaAngle;
            if(i==11)angle = deltaAngle/2.;
            segId++;
        }
    }
}

function setup(ele)
{
    ele
    .hover(function(){
        document.body.style.cursor = 'pointer';
        this.animate({
            fill: '#888888',
        }, 0);
    }, function(){
        document.body.style.cursor = 'default';
        this.animate({
            fill: color[this.id],
        }, 0);
    })
    
    .click(function(){
        displaySegmentIngo(this.id);
    });
    
}

function displaySegmentIngo(segNum)
{
    alert("Segment: "+segNum + '    Threshold = '+segValue[segNum]);
}

function arc(center, innerRadius,outerRadius, startAngle, endAngle) 
{
    var delta = 5;
    angle = startAngle;
    coords = toCoords(center, innerRadius, angle);
    path = "M " + coords[0] + " " + coords[1];
    if(innerRadius>0){
        while(angle<=endAngle) {
            coords = toCoords(center, innerRadius, angle);
            path += " L " + coords[0] + " " + coords[1];
            angle += delta;
        }
    }

    angle = endAngle;
    while(angle>=startAngle) {
        coords = toCoords(center, outerRadius, angle);
        path += " L " + coords[0] + " " + coords[1];
        angle -= delta;
    }
    path += " Z ";
    return path;
}

function toCoords(center, radius, angle) 
{
    var radians = (angle/180) * Math.PI;
    var x = center[0] + Math.cos(radians) * radius;
    var y = center[1] + Math.sin(radians) * radius;
    return [x, y];
}

var gTimerId;
function changeColor()
{
    clearInterval(gTimerId);
    for(var i=0;i<148;i++){
        color[i] = Raphael.getColor();
        detectorPaths[i].attr({fill:color[i]});
        //preampPaths[i].attr({fill:color[i]});
    }
    gTimerId = setTimeout("changeColor()",100);
}

function stopColors()
{
    clearInterval(gTimerId);
    for(var i=0;i<148;i++){
        color[i] = '#f5f5f5';
        detectorPaths[i].attr({fill:color[i]});
    }
}

function experimentParser(query,xml) {
    clearInterval(gTabTimerID);
    $(xml).find("experimentInfo").each(function () {
		var datastr  = $(this).find("thresholdsstr").text();
        var values   = datastr.split(',');
        var len     = values.length;

        for(var i=0;i<len;i++){
            var n = parseInt(values[i]);
            segValue[i] = n;
            color[i] = colorMap[n];
            detectorPaths[i].attr({fill:color[i]});
        }

    });
    gTabTimerID = setInterval(function() { 
		doWorkNew(query,experimentParser); 
	}, 10000);
}




