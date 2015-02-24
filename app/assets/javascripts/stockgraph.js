$('document').ready(function() {
  if($('#stockgraphs').length){
    $(function() { //Load jQueryUI DatePicker by class name
        $( ".datePick" ).datepicker({dateFormat: 'yy-mm-dd'} );
    });

    var yqlURL="http://query.yahooapis.com/v1/public/yql?q=";
    var dataFormat="&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

    $("#submit").click(function() {
        var symbol = $("#txtSymbol").val();
        var startDate=$("#startDate").val();
        var endDate=$("#endDate").val();
        var durSel=$("#durSel").val();
        var stperiod=$("#stperiod").val() || 50;
        var ltperiod=$("#ltperiod").val() || 200;
        var durSelma=$("#durSelma").val();

        function parseDate(input) {
          var parts = input.split('/');
          // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
          var darray = [parts[0]-1, parts[1], parts[2]];
          return darray; // Note: months are 0-based
        };

        if (durSel == "daily"){
            dur = "d";
            tinterval = 24*3600*1000;
        } else if (durSel == "weekly"){
            dur = "w";
            tinterval = 7*24*3600*1000;
        } else {
            dur = "m";
            tinterval = 30*24*3600*1000;
        };
        if (durSelma == "sma"){
            durma = "SMA";
        } else {
            durma = "EMA";
        };

        var realtimeQ = yqlURL+"select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + symbol + "%22)%0A%09%09&"+ dataFormat;
        var historicalQ= yqlURL+"select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Freal-chart.finance.yahoo.com%2Ftable.csv%3Fs%3D"+ symbol +"%26a%3D"+ parseDate(startDate)[0] +"%26b%3D"+ parseDate(startDate)[1]+ "%26c%3D" + parseDate(startDate)[2]+ "%26d%3D"+parseDate(endDate)[0]+"%26e%3D"+parseDate(endDate)[1]+"%26f%3D"+parseDate(endDate)[2] +"%26g%3D"+dur+"%26ignore%3D.csv'"+ dataFormat;
        $(function() {
            $.getJSON(realtimeQ, function(json) {//YQL Request
                $('#symbol').text(json.query.results.quote.Name);//Assign quote.Param to span tag
                $('#bidRealtime').text(json.query.results.quote.BidRealtime);

            });
        });

        var chartl; // global

        function requestData() {
            $.ajax({
                url: realtimeQ,
                dataType: 'jsonp',
                success: function(point) {
                    var series = chartl.series[0];
                    var shift = series.data.length > 100; // shift if the series is 
                                                         // longer than 20
                    var livepoint = [Date.now(), parseFloat(point.query.results.quote.BidRealtime)];
                    console.log(livepoint);
                    // add the point
                    chartl.series[0].addPoint(livepoint, true, shift);
                    
                    // call it again after one second
                    setTimeout(requestData, 1000);    
                },
                cache: false
            });
        };
        console.log(chartl);
        chartl = new Highcharts.Chart({
            chart: {
                renderTo: 'containerlive',
                events: {
                    load: requestData
                }
            },
            rangeSelector: {
                buttons: [{
                    count: 1,
                    type: 'minute',
                    text: '1M'
                }, {
                    count: 5,
                    type: 'minute',
                    text: '5M'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                inputEnabled: false,
                selected: 0
            },
            title: {
                text: 'Live '+symbol+' data'
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: symbol+' data',
                data: []
            }]
        }); 



        function converTime(time) {
            return new Date(time).getTime();
        };

        $(function () {
            $.getJSON(historicalQ, function (data) {
                var datarray = data["query"]["results"]["row"];
                var dataLength = datarray.length
                var ohlc = [];
                var closeprice = [];
                var volume = [];
                //var xaxis =[];
                // set the allowed units for data grouping
                var groupingUnits = [[
                        'week',                         // unit name
                        [1]                             // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]];
                    
                for (i=1; i < dataLength; i+=1) {
                    ohlc.unshift([
                        converTime(datarray[i]["col0"]),
                        parseFloat(datarray[i]["col1"]),
                        parseFloat(datarray[i]["col2"]),
                        parseFloat(datarray[i]["col3"]),
                        parseFloat(datarray[i]["col4"])
                    ]);
                    volume.unshift([
                        converTime(datarray[i]["col0"]),
                        parseFloat(datarray[i]["col5"])
                    ]);
                    closeprice.unshift([
                        converTime(datarray[i]["col0"]),
                        parseFloat(datarray[i]["col4"])
                    ]);
                };
                //alert(xaxis);
                //alert(ohlc);
                //alert(volume);
                //console.log(xaxis);
                //console.log(ohlc);
                //console.log(volume);
                chart = new Highcharts.StockChart({
                    chart: {
                        renderTo: 'containera'
                    },
                    rangeSelector: {
                        selected: 1
                    },
                    title: {
                        text: 'Historical Price of ' + symbol
                    },
                    yAxis: [{
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: 'OHLC'
                        },
                        height: '60%',
                        lineWidth: 2
                    }, {
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: 'Volume'
                        },
                        top: '65%',
                        height: '35%',
                        offset: 0,
                        lineWidth: 2
                    }],
                    series: [{
                        type: 'ohlc',
                        name: symbol,
                        data: ohlc,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    }, {
                        type: 'column',
                        name: 'Volume',
                        data: volume,
                        yAxis: 1,
                        dataGrouping: {
                            units: groupingUnits
                        }
                    }]
                });
                chart1 = new Highcharts.StockChart({
                    chart: {
                        renderTo: 'containerb'
                    },
                    title : {
                        text : durma+' of '+symbol+' stock price'
                    },
                    subtitle: {
                        text: 'From '+startDate+' to '+endDate
                    },
                    xAxis: {
                        type: 'datetime'
                    },
                    yAxis: {
                        title : {
                            text : 'Price'
                        }
                    },
                    tooltip: {
                        crosshairs: true,
                        shared: true
                    },
                    rangeSelector : {
                        selected : 1
                    },
                    legend: {
                        enabled: true,
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false,
                            }
                        }
                    },
                    series : [{
                        name: symbol+' Stock Price',
                        type : 'line',
                        id: 'primary',
                        data : closeprice
                    }, {
                        name: stperiod+' -day '+durma,
                        linkedTo: 'primary',
                        showInLegend: true,
                        type: 'trendline',
                        algorithm: durma,
                        periods: stperiod
                    }, {
                        name: ltperiod+' -day '+durma,
                        linkedTo: 'primary',
                        showInLegend: true,
                        type: 'trendline',
                        algorithm: durma,
                        periods: ltperiod
                    }]
                });

            });
        });

    });













        $(function () {
            $('#container2').highcharts({
                chart: {
                    //type: 'column'
                },
                title: {
                    text: 'Monthly Average Rainfall'
                },
                subtitle: {
                    text: 'Source: WorldClimate.com'
                },
                xAxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Rainfall (mm)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'Tokyo',
                    type: 'line',
                    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,        95.6, 54.4]

                }, {
                    name: 'New York',
                    type: 'line',
                    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

                }, {
                    name: 'London',
                    type: 'line',
                    data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

                }, {
                    name: 'Berlin',
                    type: 'column',
                    data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

                }]
            });
        });   

  }
});
