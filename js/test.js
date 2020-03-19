var RR = RR || {};
RR.baseUrl = '../json/wilsal03112020193707'
RR.innings = {
    'one': '1',
    'two': '2'
}

RR.loadJSON = function () {
    $.ajax({
        type: 'GET',
        url: RR.baseUrl + '.json',
        success: function (data) {
            RR.matchData = data;
        }
    });
    $.ajax({
        type: 'GET',
        url: RR.baseUrl + '_overbyover_' + RR.innings.one + '.json',
        success: function (data) {
            RR.overData = data;
            RR.matchInning();
            RR.inningRunRate();

        }
    });
}

$(document).ready(function () {
    RR.loadJSON();
});

RR.matchInning = function () {
    var matchData = RR.matchData;
    overs = [];
    for (let i = 0; i < matchData.Innings.length; i++) {
        overs.push(parseInt(matchData.Innings[i].AllottedOvers));
    }
    RR.overs;
    if (overs[0] > overs[1]) {
        RR.overs = overs[0];
    } else if (overs[1] > overs[0]) {
        RR.overs = overs[1];
    } else if (overs[0] === overs[1]) {
        RR.overs = overs[0];
    }
}

RR.inningRunRate = function () {
    var overData = RR.overData;
    RR.overNumber = [];
    RR.totalRuns = [];
    RR.runRate = [];
    RR.inningData = [];
    for (let i = 0; i < overData.Overbyover.length; i++) {
        overData.Overbyover[i].Overs = i + 1;
        RR.overNumber.push(overData.Overbyover[i].Overs);
        let runs = parseInt(overData.Overbyover[i].Runs)
        let totalRuns = parseInt(overData.Overbyover[0].Runs);
        for (let j = 0; j < RR.totalRuns.length; j++) {
            totalRuns = parseInt(overData.Overbyover[i].Runs) + RR.totalRuns[j];
        }
        overData.Overbyover[i].totalRuns = totalRuns;
        RR.totalRuns.push(totalRuns);

        overData.Overbyover[i].runRate = parseFloat((overData.Overbyover[i].totalRuns / overData.Overbyover[i].Overs).toFixed(1))
        RR.runRate.push(overData.Overbyover[i].runRate);
        let runRate = overData.Overbyover[i].runRate
        let wickets = parseInt(overData.Overbyover[i].Wickets);

        RR.inningData.push({
            totalRuns: totalRuns,
            wicket: wickets,
        });


    }
    console.log(RR.inningData);
    RR.graphUI();
}

RR.graphUI = function () {



    var markUp = `<div class="chartBox" style="width:640px;height:360px;margin: auto"> <canvas id="chart"style="width:100%;height:100%"></canvas> </div>`;
    document.querySelector('.widgets').innerHTML = markUp;

    var ctx = document.getElementById("chart").getContext("2d");

    const colors = {
        purple: {
            fill: '#8fa8c8',
            stroke: '#75539e',
        },
        green: {
            fill: '#e0eadf',
            stroke: '#5eb84d',
        },
    };
    var test = [];
    var wicketImg = new Image();
    wicketImg.src = '/chart-wicket.png';

    RR.inningData.push({totalRuns: 110, wicket: 3});
    for (let i = 0; i < RR.inningData.length; i++) {
        if (RR.inningData[i].wicket) {
            Chart.pluginService.register({
                afterUpdate: function (chart) {
                    console.log(chart.config);

                    chart.config.data.datasets[0]._meta[0].data[i]._model.pointStyle = wicketImg;
                    if (RR.inningData[i].wicket > 1) {
                        for (let j = 0; j < RR.inningData[i].wicket; j++) {
                            chart.config.data.datasets[0]._meta[0].data[i]._model.pointStyle = wicketImg;
                            chart.config.data.datasets[0]._meta[0].data[i]._model.pointStyle.style.marginBottom = 10+'px';
                            
                        }
                    }

                }
            });
        }

        var runs = RR.inningData[i].totalRuns
        test.push(runs)

    }

    //   const availableForExisting = teamBRuns;
    RR.overNumber.push(21)
    const xData = RR.overNumber;






    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xData,
            datasets: [{
                label: "teamA runs",
                fill: true,
                lineTension: 0.1,
                borderColor: colors.green.stroke,
                data: test,


            }]
        },
        options: {
            legend: {
                display: false,
            },
            responsive: true,
            tooltips: {
                enabled: false,
                intersect: false,
            },
            elements: {

                point: {
                    radius: 0
                }
            },

            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{

                    ticks: {
                        beginAtZero: false,
                    }
                }]


            },
        }
    });

    return myChart;
}








/* const teamBRuns = [];
const teamBOvers = [];
const teamBRunRate = [];
for (let i = 0; i < teamBData.Overbyover.length; i++) {
    teamBData.Overbyover[i].Overs = i + 1;
    teamBOvers.push(teamBData.Overbyover[i].Overs);
    let totalRuns = parseInt(teamBData.Overbyover[0].Runs);
    for (let j = 0; j < teamBRuns.length; j++) {
        totalRuns = parseInt(teamBData.Overbyover[i].Runs) + teamBRuns[j];
    }
    teamBData.Overbyover[i].TotalRuns = totalRuns;
    teamBRuns.push(totalRuns);
    teamBData.Overbyover[i].RunRate = teamBData.Overbyover[i].TotalRuns / teamBData.Overbyover[i].Overs
    teamBRunRate.push(teamBData.Overbyover[i].RunRate)
}
console.log(teamBData, teamBRuns);




 */