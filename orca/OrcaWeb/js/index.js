var gVersion = "ORCAWeb v1.1";
var gMainQuery    = "query.php?tag=machines&query=select * from machines,runs where machines.machine_id = runs.machine_id";
var gMachineInfoTimerID;

$(document).ready(function () {

	doWork(gMainQuery,machineInfoParser);
    clearInterval(gMachineInfoTimerID);
	gMachineInfoTimerID = setInterval(function() { doWork(gMainQuery,machineInfoParser); }, 2000);

    document.getElementById('maintitle').innerHTML = 'ORCA Machines';

});

function machineClick(machineID){
    window.location.href = "runInfo.html?machineID="+machineID; 
}

function machineInfoParser(xml) {
	
    var content = "<table>";
    var count = 0;
    $(xml).find("machines").each(function () {
        count = count+1;
		var runID = $(this).find("state").text();
        var machineID = $(this).find("machine_id").first().text();
		var runStateIndex = $(this).find("state").text();
		var runStateStr = translateRunState(runStateIndex);
        var upTime = $(this).find("uptime").text();
        var upTimeSec = convertSeconds(upTime);
 		content += "<tr onmouseover=\"this.className = 'hlt';document.body.style.cursor = 'pointer';\" onmouseout=\"this.className = '';document.body.style.cursor = 'default'\">";
        content += '<td id=orcaListName onclick = "machineClick(' + machineID + ')">' +
                    $(this).find("name").text() + '</td>' +
                   '<td id=orcaListState class="greyField">' + runStateStr + '</td>' +
                   '<td id=orcaListExperiment class="greyField">' + $(this).find("experiment").text() + '</td>' +
                   '<td id=orcaListUptime class="greyField">' + upTimeSec + '</td>' +
                   '<td id=orcaListVersion class="greyField">' + $(this).find("version").text() + '</td>' +
                   '<td id=orcaListIpNumber class="greyField">' + $(this).find("ip_address").text() + '</td>';
        
  		content += "</tr>";
	});
    content += "</table>";
    if(count>0){
        document.getElementById('machineList').innerHTML = content;

    }
	else {
        document.getElementById('machineList').innerHTML = "There are no ORCAs in this database";
    }
        document.getElementById('versionNum').innerHTML = gVersion;


}

function convertSeconds(seconds)
{
    var days    = parseInt(seconds / (24*60*60));
    seconds -= days * 24*60*60;
    var hours    = parseInt(seconds / (60*60));
    seconds -= hours * 60*60;
    var minutes    = parseInt(seconds / 60);
    seconds -= minutes * 60;
    return sprintf('%02d %02d:%02d:%02d',days,hours,minutes,seconds);
}

function translateRunState(type)
{
    if(type == 0)      return "Stopped";
    else if(type == 1) return "Running";
    else if(type == 2) return "Starting";
    else if(type == 3) return "Stopping";
    else if(type == 4) return "Between Sub Runs";
    return "unKnown";
}

