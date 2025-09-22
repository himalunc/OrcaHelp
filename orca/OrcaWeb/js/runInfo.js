

var gMachineName;
var gMachineID;
var gPlotName;
var gTabTimerID;
var gRunInfoTimerID;
var gAlarmTimerID;
var gProcessTimerID;

var gPlotUpdateQuery= "query.php?tag=plotData&query=select datastr,name,start from Histogram1Ds where dataset_id=";

var chart1;
var chart2;
var colorChart;

$(document).ready(function () {

	var anId = getUrlVars()["machineID"];
    gMachineID = anId;
    
    loadSettings();
          
    if('plotID' in dataListStatus){
        gPlotName = dataListStatus['plotID'];
    }
    
    var gRunInfoQuery   = "query.php?tag=runInfo&query=select * from machines,runs where runs.machine_id=";
	var query = gRunInfoQuery + anId + " and machines.machine_id="+gMachineID;
	doWorkNew(query,runInfoParser);
 
    //the alarms and process monitoring continues all the time
    var gAlarmQuery     = "query.php?tag=alarms&query=select * from alarms where machine_id=";
    var gProcessQuery   = "query.php?tag=processes&query=select process_id,title,state from Processes where machine_id=";
    query = gAlarmQuery + gMachineID + " ORDER BY severity DESC";
    doWorkNew(query, alarmParser);
    
    query = gProcessQuery + gMachineID;
    doWorkNew(query, processParser);

 
    $("#popupContactClose").click(function(){  
        disablePopup();  
    });
      
   //dialog event!  
     $("#button").click(function(){  
        //centering with css  
        centerPopup();  
        //load popup  
        loadPopup();  
    });
    
    //Click out of dialog event!  
    $("#backgroundPopup").click(function(){  
        disablePopup();  
    });
      
    setUpDataChart();
    setUpExperimentChart();
    //setUpColorChart();

});

function handleTabSwitch(i)
{
    var gDataListQuery   = "query.php?tag=dataList&query=select dataset_id,name,counts from Histogram1Ds where machine_id=";
    var gStatusLogQuery  = "query.php?tag=statusLog&query=select statuslog from statuslog where machine_id=";
    var gExperimentQuery = "query.php?tag=experimentInfo&query=select thresholdsstr from experiment where machine_id=";
 
    var query;
    switch(i){
       case 0: //data
            query = gDataListQuery + gMachineID + " ORDER BY name";
            doWorkNew(query, dataListParser);
        break;
        case 3: //status
            query = gStatusLogQuery + gMachineID;
            doWorkNew(query, statusLogParser);
        break;
       case 4: //experiment
            query = gExperimentQuery + gMachineID + " and experiment='Katrin'";
            doWorkNew(query, experimentParser);
        break;


       }
}

function plotDataParser(xml) {

    $(xml).find("plotData").each(function () {
    
		var datastr = $(this).find("datastr").text();
        var start   = parseInt($(this).find("start").text());    
        var name    = $(this).find("name").text();    
        var y       = datastr.split(',');
        var len     = y.length;
        if(len>2000)len =2000;
        var end     = start + len;

        var d       = new Array();
        var j = 0;
        for(var i=0;i<start;i++)d[i]=0;
        for(var i=start;i<end;i++){
            d[i]=parseInt(y[j++]);
        }
        for(var i=end;i<end+50;i++)d[i]=0;

        chart1.series[0].setData(d);        
        chart1.setTitle({ text: name});
       //document.getElementById('datasetName').innerHTML = name;
  	});
}

function runInfoParser(query,xml) {
    clearInterval(gRunInfoTimerID);

	var theRunInfo = $(xml).find("RunInfo").first();
	theRunInfo.each(function () {
    
		var state        = $(this).find("state").text();
		var run          = parseInt($(this).find("run").first().text());
		var subrun       = parseInt($(this).find("subrun").text());
		var name		 = $(this).find("name").first().text();
		var experiment   = $(this).find("experiment").text();
		var startTime    = $(this).find("startTime").text();
		var elapsedTime  = $(this).find("elapsedTime").text();
		var uptime       = $(this).find("uptime").text();
		var version      = $(this).find("version").text();
		var hw_address   = $(this).find("hw_address").text();
		var ip_address   = $(this).find("ip_address").text();
		var timedRun     = parseInt($(this).find("timedRun").text());
		var repeatRun    = parseInt($(this).find("repeatRun").text());
		var offline      = parseInt($(this).find("offline").text());
        var timeToGo     = $(this).find("timeToGo").text();
        var elapsedSubRunTime     = $(this).find("elapsedSubRunTime").text();
    
        var html = "<p>";
        html += "Name<br/>";
        html += "ORCA Version<br/>";
        html += "IP Address<br/>";
        html += "HW Address<br/>";
        html += "Experiment<br/>";
        html += "Uptime<br/>";
        html += "</p>";
        document.getElementById('machineInfoName').innerHTML = html;

        html = "<p>";
        html += name + "<br/>";
        html += version + "<br/>";
        html += ip_address + "<br/>";
        html += hw_address + "<br/>";
        html += experiment + "<br/>";
        html += uptime + "<br/>";
        html += "</p>";
        document.getElementById('machineInfo').innerHTML = html;

        html = "<p>";
        html += "Run State<br/>";
        html += "Run Number<br/>";
        html += "Start Time<br/>";
        html += "Elapsed Time<br/>";
        if(subrun) html += "Sub Run Elapsed Time<br/>";
        if(timedRun){
            if(repeatRun) html += "Time To Go<br/>";
            else          html += "Time To Go<br/>";
        }
        html += "</p>";
        document.getElementById('runInfoName').innerHTML = html;

        html = "<p>";
        var valid = run;
        if(valid){
            html += runState(state,offline) + "<br/>";
            if(offline) html += "----<br/>";
            else        html += runNumber(run,subrun)+ "<br/>";
            html += startTime + "<br/>";
            html += convertSeconds(elapsedTime)+ "<br/>";
            if(valid){
                if(subrun) html += convertSeconds(elapsedSubRunTime) + "<br/>";
                if(timedRun){
                    if(repeatRun) html += convertSeconds(timeToGo) + " until repeating<br/>";
                    else          html += convertSeconds(timeToGo) + " until stopping<br/>";
                }
            }
        }
        else {
            html += "No Run Info<br/>";
            html += "---<br/>";
            html += "---<br/>";
            html += "---<br/>";
            if(valid){
                if(subrun) html += convertSeconds(elapsedSubRunTime) + "<br/>";
                if(timedRun){
                    if(repeatRun) html += convertSeconds(timeToGo) + " until repeating<br/>";
                    else             html += convertSeconds(timeToGo) + " until stopping<br/>";
                }
            }           
        }
        
        html += "</p>";

        document.getElementById('runInfo').innerHTML = html;
        gMachineName = name;
        document.getElementById('maintitle').innerHTML = name;
        

	});
    gRunInfoTimerID = setInterval(function() { 
		doWorkNew(query,runInfoParser); 
	}, 3000);
}

function alarmParser(query,xml) {
    clearInterval(gAlarmTimerID);
	var count = 0;
    var content = "<table>";
    $(xml).find("alarms").each(function () {
        count = count+1;
		var alarmName = $(this).find("name").text();
		var alarmHelp = $(this).find("help").text();
        var alarmPost = $(this).find("timePosted").text();
        var severity  = $(this).find("severity").text();
        alarmHelp     = alarmHelp.replace(new RegExp( "\\n", "g" ),"<br/>");
       
  		content += "<tr onmouseover=\"this.className = 'hlt';document.body.style.cursor = 'pointer';\" onmouseout=\"this.className = '';document.body.style.cursor = 'default'\">";
        content += "<td  id=\"alarmNameCol\" onClick= \"openInfo('";
        content += alarmName + "','" +alarmHelp;
        content += "')\">";
        content += alarmName;
        content += "</td>"
  
        content += "<td  id=\"alarmSeverityCol\" class=\"" + serverityName(severity) + "\"onClick= \"openInfo('";
        content += alarmName + "','" +alarmHelp;
        content += "')\">";
        content += serverityName(severity);
        content += "</td>"
 
        content += "<td  id=\"alarmPostedCol\" onClick= \"openInfo('";
        content += alarmName + "','" + alarmHelp;
        content += "')\">";
        content += alarmPost;
        content += "</td>"
        content += "</tr>";
     
	});
    content += "</table>";
    document.getElementById('alarmtab').innerHTML    = content;
    document.getElementById('alarmtabtext').innerHTML = "Alarms (" + count + ")" ;
    
    gAlarmTimerID = setInterval(function() { 
		doWorkNew(query,alarmParser); 
	}, 5000);
}

function processClick(processID){
    window.location.href = "processInfo.html?processID=" + processID + "&machineName="+gMachineName; 
}

function processParser(query,xml) {
    clearInterval(gProcessTimerID);
	var count = 0;
    var numRunning = 0;
    var content = "<table>";
    $(xml).find("processes").each(function () {
  		var title = $(this).find("heading").text();
        var state = parseInt($(this).find("state").text());
        var pid = $(this).find("process_id").text();
      
   		content += "<tr onmouseover=\"this.className = 'hlt';document.body.style.cursor = 'pointer';\" onmouseout=\"this.className = '';document.body.style.cursor = 'default'\">";

        content += "<td  id=\"processNameCol\" onClick= \"processClick('" + pid + "')\">";
        content += title;
        content += "</td>"

        content += "<td  id=\"processStateCol\" onClick= \"processClick('" + pid + "')\">";
        if(state){
            content += "Running";
            numRunning += 1;
        }
        else content += "Stopped";
        content += "</td>"
        content += "</tr>";
        count= count+1;
	});
    
    content += "</table>";
    document.getElementById('processtab').innerHTML     = content;
    document.getElementById('processtabtext').innerHTML = "Processes (" + numRunning+"/" + count + ")";

   gProcessTimerID = setInterval(function() { 
		doWorkNew(query,processParser); 
	}, 7000);
}

function dataListParser(query,xml) {
    clearInterval(gTabTimerID);

    var count = 0;
    var numRunning = 0;
    var firstPlotID;
    $(xml).find("dataList").each(function () {
        var name    = $(this).find("name").text();
        var counts  = $(this).find("counts").text();
        var plotID  = $(this).find("dataset_id").text();
        if(count==0)firstPlotID = plotID;
        count = count+1;
        if(counts>0)updateItem(name,plotID,counts);
    });
    
    if(!gPlotName && count!=0)gPlotName = firstPlotID
    var query1 = gPlotUpdateQuery + gPlotName;
    doWorkNew(query1,plotDataParser); 
    
    gTabTimerID = setInterval(function() { 
		doWorkNew(query,dataListParser); 
	}, 10000);
}

function plotDataParser(query,xml) {

    $(xml).find("plotData").each(function () {

		var datastr = $(this).find("datastr").text();
        var start   = parseInt($(this).find("start").text());    
        var name    = $(this).find("name").text();    
        var y       = datastr.split(',');
        var len     = y.length;
        if(len>2000)len =2000;
        var end     = start + len;

        var d       = new Array();
        var j = 0;
        for(var i=0;i<start;i++)d[i]=0;
        for(var i=start;i<end;i++){
            d[i]=parseInt(y[j++]);
        }
        for(var i=end;i<end+50;i++)d[i]=0;

        chart1.series[0].setData(d);        
        chart1.setTitle({ text: name});
       //document.getElementById('datasetName').innerHTML = name;
  	});
}

function statusLogParser(query,xml) {
    clearInterval(gTabTimerID);
    var html = "<p>";
    $(xml).find("statusLog").each(function () {
		var s  = $(this).find("statuslog").text();
        var s = s.replace(new RegExp( "\\n", "g" ),"<br/>");
        html += s;
	});
    html += "</p>";
    
    var objDiv = document.getElementById('StatusLog');
    objDiv.innerHTML = html;
    objDiv.scrollTop = objDiv.scrollHeight;
    
    gTabTimerID = setInterval(function() { 
		doWorkNew(query,statusLogParser); 
	}, 10000);
}




function openInfo(name,str)
{
    centerPopup();  
    loadPopup();  
 
    document.getElementById('popupDescription').innerHTML = name + str;
    document.getElementById('popupTitle').innerHTML = name;
}


function updateItem(dataItemName,pid,count)
{
    var parentRef = document.getElementById('dataList');
    return update(parentRef,dataItemName,pid,count,0);
}

function update(parentRef,pathName,pid,count,level)
{
    var index = pathName.indexOf(',');
    if(index == -1){
        var children = parentRef.children;

        for(var i=0;i<children.length;i++){
            if(children[i].id == pathName){
                var item = children[i].getElementsByTagName('countItem')[0];
                item.innerHTML = count;
                return false;
            }
        }
        var leafTag = document.createElement('div');
        leafTag.id = pathName;
        level = level+1;
        leafTag.className ='leaf level'+level;
        leafTag.innerHTML = pathName+' ';
        leafTag.setAttribute('onClick','plotClick("'+pid+'")');
        
        var countTag = document.createElement('countItem');
        countTag.innerHTML = count+'<br/>';
        leafTag.appendChild(countTag);

        parentRef.appendChild(leafTag);
       return true;

    }
    else {
        var name    = '&nbsp;&nbsp;&nbsp;'+pathName.substr(0,index);
        var theRest = pathName.slice(index+1);
        level = level+1;

        var children = parentRef.children;
        var foundit = false;
        for(var i=0;i<children.length;i++){
            if(children[i].id == name){
                var theContent = children[i].children[1];
                update(theContent,theRest,pid,count,level);
                foundit = true;
            }
        }
        //ok -- didn't find an existing node so we have to create one
        //the form will be 
        //<div class="node">
        //    <nodename>DataGen</nodename>
        //    <div class="nodecontent">
        //        content
        //    <div>
        //<div>
        if(!foundit){
            var nodeTag = document.createElement('div');            

            nodeTag.className = 'node level'+level;
            nodeTag.id = name;

            var nodeNameTag = document.createElement('nodename');
            nodeNameTag.id = 'nodename';
            nodeNameTag.innerHTML = name;
            
            var nodeContentTag = document.createElement('div');
            nodeContentTag.className ='nodecontent';
          
            parentRef.appendChild(nodeTag);
            nodeTag.appendChild(nodeNameTag);
            nodeTag.appendChild(nodeContentTag);
            
            nodeNameTag.onclick = function() {
                toggleNode(this);
            };
            
            var n = fullName(nodeTag,name);
            if(n in dataListStatus){
                if(dataListStatus[n] == 'false'){
                    addClassName(nodeTag,'nodecollapsed',true);
                }
            }
            else addClassName(nodeTag,'nodecollapsed',true);
            
            update(nodeContentTag,theRest,pid,count,level);
            
          }
    }
}

function toggleNode(clickedNode)
{
    
    var target    = clickedNode.parentNode;

    var collapsed = hasClassName(target,'nodecollapsed');
    if(collapsed) {
        removeClassName(target,'nodecollapsed');
    }
    else {
        addClassName(target,'nodecollapsed',false);
    }
    
    var n = fullName(target,target.id);
    saveSettings(n, collapsed?"true":"false");
}

function fullName(target,theFullName){
    if(target.parentNode.id == 'dataList')return theFullName;
    else {
        var parentID = target.parentNode.id;
        var s;
        if(parentID) s = target.parentNode.id + ',' + theFullName;
        else s = theFullName;
        return fullName(target.parentNode,s);
    }
}

function openPlot()
{
    window.location.href = "plot.html?dataSetID="+gPlotName + "&machineName="+gMachineName; 
};

function plotClick(pid)
{
    saveSettings('plotID', pid);

    var query = gPlotUpdateQuery + pid;
    gPlotName = pid;
	doWorkNew(query,plotDataParser);
};


 function setUpDataChart()
 {
    chart1 = new Highcharts.Chart({
        chart: {
            renderTo: 'histogramChart1',
            zoomType: 'x',
            spacingRight: 20,
            backgroundColor: '#ffffff',
            borderWidth: 0
        },
        title: { text: 'Plot' },
        xAxis: {
            type: 'channel',
            maxZoom: 50,
            title: { text: 'Channel' }
        },
        yAxis: {
            title: { text: 'Counts' },
            min: 0.6,
            startOnTick: false,
            showFirstLabel: false
        },
        tooltip: { shared:  true  },
        legend:  { enabled: false },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: [0, 0, 0, 250],
                    stops: [
                        [0, Highcharts.theme.colors[0]],
                        [1, 'rgba(2,0,0,0)']
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 5
                        }
                    }
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1						
                    }
                }
            }
        },
    
        series: [{
            type: 'area',
            name: 'Counts',
            pointInterval: 1,
            pointStart: 0,
            data: []
        }]
    });   
}

function setUpExperimentChart()
 {
    chart2 = new Highcharts.Chart({
        chart: {
            renderTo: 'histogramChart2',
            zoomType: 'x',
            spacingRight: 20,
            backgroundColor: '#ffffff',
            borderWidth: 0
        },
        title: { text: 'Plot' },
        xAxis: {
            type: 'channel',
            maxZoom: 50,
            title: { text: 'Channel' }
        },
        yAxis: {
            title: { text: 'Counts' },
            min: 0.6,
            startOnTick: false,
            showFirstLabel: false
        },
        tooltip: { shared:  true  },
        legend:  { enabled: false },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: [0, 0, 0, 250],
                    stops: [
                        [0, Highcharts.theme.colors[0]],
                        [1, 'rgba(2,0,0,0)']
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 5
                        }
                    }
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1						
                    }
                }
            }
        },
    
        series: [{
            type: 'area',
            name: 'Counts',
            pointInterval: 1,
            pointStart: 0,
            data: []
        }]
    });   
}
function setUpColorChart()
 {
    colorChart = new Highcharts.Chart({
        chart: {
            renderTo: 'colorChart',
            backgroundColor: '#ffffff',
            borderWidth: 0
        },
        yAxis: {
            min: 0.6,
            startOnTick: false,
            showFirstLabel: false
        }
    });   
}

