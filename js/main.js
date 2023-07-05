const loadingSpinner = document.querySelector('#loadingSpinner');
const showLoadingSpinner = () => {
    loadingSpinner.classList.remove('d-none');
}
const hideLoadingSpinner = () => {
    loadingSpinner.classList.add('d-none');
}

const stateCode = document.querySelector('#stateCode');
const dateSelector = document.querySelector('#dateSelector');
const viewStatesDaily = document.querySelector('#viewStatesDaily')

// Chart to compare yesterday's data to today's data
Highcharts.chart('compareContainer', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Covid 19 Data Comparsion',
        align: 'left'
    },
    subtitle: {
        text: 'Last Two Days',
        align: 'left'
    },
    xAxis: {
        categories: ['Hospitalized', 'In ICU', 'On Ventilator', 'Deaths'],
    },
    legend: {
        shadow: false
    },
    plotOptions: {
        column: {
            borderRadius: 5
        }
    },
    series: [{
        name: 'Yesertday',
        // data: [0, 0, 0, 0],
        // demo data
        data: [100, 50, 150, 400],
    }, {
        name: 'Today',
        // data: [0, 0, 0, 0],
        // demo data
        data: [150, 100, 200, 250],
    }]

});

const daysComparsion = async () => {
    const response = await fetch('https://api.covidtracking.com/v2/us/daily.json');
    if (!response.ok) {
        console.log('Error retrieving data');
        return;
    }
    const daysComparsion = await response.json();
    // console.log(daysComparsion);

    const compareChart = Highcharts.charts[0]

    // update the chart series
    compareChart.series[0].setData([
        daysComparsion.data[0].outcomes.hospitalized.currently.value,
        daysComparsion.data[0].outcomes.hospitalized.in_icu.currently.value,
        daysComparsion.data[0].outcomes.hospitalized.on_ventilator.currently.value,
        daysComparsion.data[0].outcomes.death.total.value,
    ]);

    compareChart.series[1].setData([
        daysComparsion.data[1].outcomes.hospitalized.currently.value,
        daysComparsion.data[1].outcomes.hospitalized.in_icu.currently.value,
        daysComparsion.data[1].outcomes.hospitalized.on_ventilator.currently.value,
        daysComparsion.data[1].outcomes.death.total.value,
    ]);
    
}

// Chart to view cases in a state
Highcharts.chart('stateContainer', {
    chart: {
        type: 'column'
    },
    title: {
        align: 'left',
        text: 'Please select a state to view the data'
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: 'Total Cases'
        }

    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: false,
            }
        }
    },
    
    series: [
        {
            name: "Total Cases",
            colorByPoint: true,
            data: [
                {
                    name: "Hospitalized",
                    y: 0,
                },
                {
                    name: "Deaths",
                    y: 0,
                },
            ]
        }
    ],
});

stateCode.onchange = async () => {
    showLoadingSpinner();
    const getSelectedState = stateCode.value;
    const selectedState = getSelectedState.toLowerCase();
    // console.log(selectedState);
    const response = await fetch(`https://api.covidtracking.com/v2/states/${selectedState}/daily.json`);
    if (!response.ok) {
        console.log('Error retrieving data');
        hideLoadingSpinner();
        return;
    }
    const stateReport = await response.json();
    // console.log(stateReport);

    let mainChart = Highcharts.charts[1] // get the main chart

    // update the chart series
    mainChart.series[0].setData([
        {
            name: "Hospitalized",
            y: stateReport.data[0].outcomes.hospitalized.currently.value,
        },
        {
            name: "Deaths",
            y: stateReport.data[0].outcomes.death.total.value,
        },
    ]);
    
    // update the chart title
    mainChart.setTitle({text: `Current COVID-19 Cases in ${stateReport.data[0].state}`});

    // update the chart subtitle
    mainChart.setSubtitle({text: `Total Cases: ${stateReport.data[0].cases.total.value} <br> Currently Hospitalized: ${stateReport.data[0].outcomes.hospitalized.currently.value}`});

    hideLoadingSpinner();
}

// Chart to view daily cases in a state
Highcharts.chart('viewStatesDailyContainer', {
    chart: {
        type: 'column'
    },
    title: {
        align: 'left',
        text: 'Please select a state to view the data'
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%'
            }
        }
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: 'Percentage of Current Hospitalized Cases'
        }
    },
    tooltip: {
        // headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    },
    series: [
        {
            name: 'Status',
        colorByPoint: true,
        data: [ {
            name: 'In ICU',
            y: 0
        },{
            name: 'On Ventilator',
            y: 0
        }]
        }
    ],
});

viewStatesDaily.onclick = async () => {
    showLoadingSpinner();
    let selectedDate = document.querySelector('#stateDateSelector').value
    selectedDate = new Date(selectedDate).toISOString().split('T')[0]; // convert to iso format

    let getSelectedState = document.querySelector('#stateCodeDaily').value;
    getSelectedState = getSelectedState.toLowerCase();

    const response = await fetch(`https://api.covidtracking.com/v2/states/${getSelectedState}/${selectedDate}.json`);
    if(!response.ok) {
        console.log('Error retrieving data');
        hideLoadingSpinner();
        return;
    }
    const dailyStateReport = await response.json();
    // console.log(dailyStateReport);

    const stateChart = Highcharts.charts[2] // get the state chart
    stateChart.setTitle({text: `COVID-19 Cases Report for ${new Date(dailyStateReport.data.date).toDateString()} in ${dailyStateReport.data.state}`})

    // update the chart series
    stateChart.series[0].setData([
        {
            name: 'In ICU',
            y: dailyStateReport.data.outcomes.hospitalized.in_icu.total.value / dailyStateReport.data.outcomes.hospitalized.total.value * 100
        },  {
            name: 'On Ventilator',
            y: dailyStateReport.data.outcomes.hospitalized.on_ventilator.total.value / dailyStateReport.data.outcomes.hospitalized.total.value * 100
        }
    ])

    // update the chart subtitle
    stateChart.setSubtitle({
        text: `Total Cases: ${dailyStateReport.data.cases.total.value} & Currently Hospitalized: ${dailyStateReport.data.outcomes.hospitalized.currently.value}`
    })

    // update the chart credits
    stateChart.credits.update({
        text: `Data retrieved from <a href="https://covidtracking.com/">The COVID Tracking Project</a>`
    })

    hideLoadingSpinner();
};

// Chart to view daily cases in the US
Highcharts.chart('dateContainer', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Please select a date to view the data',
        align: 'left'
    },
    subtitle: {
        text: 'Total Cases: 0 <br> Currently Hospitalized: 0',
        align: 'left',
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Status',
        colorByPoint: true,
        data: [{
            name: 'In ICU',
            y: 0
        },  {
            name: 'On Ventilator',
            y: 0
        }, {
            name: 'Deaths',
            y: 0
        }]
    }]
});

dateSelector.onchange = async () => {
    showLoadingSpinner();
    let selectedDate = dateSelector.value
    selectedDate = new Date(selectedDate).toISOString().split('T')[0]; // convert to iso format
    
    const response = await fetch(`https://api.covidtracking.com/v2/us/daily/${selectedDate}.json`);
    if (!response.ok) {
        console.log('Error retrieving data');
        hideLoadingSpinner();
        return;
    }
    const dailyReport = await response.json();
    // console.log(dailyReport);

    let mainChart = Highcharts.charts[3] // get the main chart
    mainChart.setTitle({text: `COVID-19 Cases Report for ${new Date(dailyReport.data.date).toDateString()}`})

    // update the chart series
    mainChart.series[0].setData([
        {
            name: 'In ICU',
            y: dailyReport.data.outcomes.hospitalized.in_icu.currently.value
        },  {
            name: 'On Ventilator',
            y: dailyReport.data.outcomes.hospitalized.on_ventilator.currently.value
        }
    ])
    
    // update the chart subtitle
    mainChart.setSubtitle({
        text: `Total Cases: ${dailyReport.data.cases.total.value} <br> Currently Hospitalized: ${dailyReport.data.outcomes.hospitalized.currently.value} <br> Total Deaths: ${dailyReport.data.outcomes.death.total.value}`
    })

    // update the chart credits
    mainChart.credits.update({
        text: `Data retrieved from <a href="https://covidtracking.com/">The COVID Tracking Project</a>`
    })
    
    hideLoadingSpinner();
};






const getDashboardData = async () => {
    showLoadingSpinner()
    const response = await fetch('https://api.covidtracking.com/v2/us/daily.json');
    if (!response.ok) {
        console.log('Error retrieving data');
        return;
    }
    const dashboardData = await response.json();
    setDashboardData(dashboardData);
}

const setDashboardData = (dashboardData) => {

    const totalCases = document.querySelector('#totalCases').textContent = dashboardData.data[0].cases.total.value;
    const totalHospitalized = document.querySelector('#totalHospitalized').textContent = dashboardData.data[0].outcomes.hospitalized.currently.value;
    const totalInIcu = document.querySelector('#totalInIcu').textContent = dashboardData.data[0].outcomes.hospitalized.in_icu.currently.value;
    const totalOnVentilator = document.querySelector('#totalOnVentilator').textContent = dashboardData.data[0].outcomes.hospitalized.on_ventilator.currently.value;
    const totalDeaths = document.querySelector('#totalDeaths').textContent = dashboardData.data[0].outcomes.death.total.value;
    hideLoadingSpinner();
}  

getDashboardData()

daysComparsion()


