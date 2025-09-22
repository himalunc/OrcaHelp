

var gMachineName;
var gMachineID;
var gProcessTimerID;

$(document).ready(function () {

	var anId = getUrlVars()["processID"];
 	var machineName = getUrlVars()["machineName"];
    machineName = machineName.replace("%20"," ");
    gMachineID = anId;
    document.getElementById('maintitle').innerHTML = "Process";
    $('#nav').append('<li><a ONCLICK="history.go(-1)">'+ machineName + '</a></li>');
 
            
    //the process monitoring continues all the time
    var gProcessQuery   = "query.php?tag=processes&query=select * from Processes where process_id=";
    
    query = gProcessQuery + gMachineID;
    doWorkNew(query, processParser);

});

function processParser(query,xml) {
    clearInterval(gProcessTimerID);
	var count = 0;
    var numRunning = 0;
    var content = "<table>";
    var log = "<p>";
    $(xml).find("processes").each(function () {
  		var title = $(this).find("heading").text();
        var state = parseInt($(this).find("state").text());
		var data  = $(this).find("data").text();
        data      = data.replace(new RegExp( "\\n", "g" ),"<br/>");
        log += data;
   		content += "<tr>";

        content += "<td  id=\"processNameCol\" onClick= \"openInfo('";
        content += title + "','" + data;
        content += "')\">";
        content += title;
        content += "</td>"

        content += "<td  id=\"processStateCol\" onClick= \"openInfo('";
        content += title + "','" + data;
        content += "')\">";
        if(state){
            content += "Running";
            numRunning += 1;
        }
        else content += "Stopped";
        content += "</td>"
        content += "</tr>";

	});
    content += "</table>";
    log += "</p>";

    document.getElementById('ProcessTable').innerHTML     = content;
    document.getElementById('ProcessLog').innerHTML     = log;


   gProcessTimerID = setInterval(function() { 
		doWorkNew(query,processParser); 
	}, 7000);
}
