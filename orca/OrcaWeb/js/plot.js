
var gPlotUpdateQuery = "query.php?tag=plotData&query=select datastr,name,start from Histogram1Ds where dataset_id=";
var gPlotUpdateTimerID;

$(document).ready(function () {
	var anId = getUrlVars()["dataSetID"];
	var machineName = getUrlVars()["machineName"];
	var query = gPlotUpdateQuery + anId;
	
	doWork(query,plotDataParser);

    setUpDataChart();
    
    machineName = machineName.replace("%20"," ");
    document.getElementById('maintitle').innerHTML = "1D Histogram";
    $('#nav').append('<li><a ONCLICK="history.go(-1)">'+ machineName+'</a></li>');
    
    clearInterval(gPlotUpdateTimerID);
	gPlotUpdateTimerID = setInterval(function() { 
		doWork(query,plotDataParser); 
	}, 15000);
    
});

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
       document.getElementById('datasetName').innerHTML = name;
  	});
}

 function setUpDataChart()
 {
    chart1 = new Highcharts.Chart({
        chart: {
            renderTo: 'histogramChart1',
            zoomType: 'x',
            spacingRight: 20
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
                    linearGradient: [0, 0, 0, 450],
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
