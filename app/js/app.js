angular.module('exchangeRate', [])

    .controller('mainController', ['$scope', '$http', 'CurrencyData', function($scope, $http, CurrencyData) {
        $scope.formData = {};
        $scope.loading = true;

        function createBarsforData(data) {
            var barChart = {};
            var margin = {
                    top: 70,
                    right: 150,
                    bottom: 50,
                    left: 100
                },
                width = 800 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;


            var barSvg = d3.select("#BarChart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            var scaleY = d3.scaleBand()
                .range([0, height])
                .domain(data.map(function(d) {
                    return d["name"]
                }))
                .paddingInner(0.1)
                .paddingOuter(0.2)

            var scaleXTop = d3.scaleLog()
                .range([0, width])
                .domain(d3.extent(data, function(d) {
                    return +d["price_usd"]
                }));

            var scaleXBottom = d3.scalePow()
                .exponent(0.5)
                .range([0, width])
                .domain(d3.extent(data, function(d) {
                    return +d["price_btc"]
                }));

            var color = d3.scaleOrdinal(d3.schemeCategory10)

            barSvg.append("g").attr("class", "xAxis")
                .attr("transform", "translate(0" + "," + height + ")")
                .call(d3.axisBottom(scaleXBottom))
                .append("text")
                .attr("x", width / 2)
                .attr("y", 50)
                .attr("class", "marginBottomText")
                .style("text-anchor", "middle")
                .text("Price in Bit coin")
                .attr("fill", "#1f77b4");

            barSvg.append("g").attr("class", "y axisLeft")
                .call(d3.axisLeft(scaleY));

            barSvg.append("g").attr("class", "y axisTop")
                .attr("transform", "translate(0,0)")
                .call(d3.axisTop(scaleXTop))
                .append("text")
                .attr("x", width / 2)
                .attr("y", -30)
                .attr("class", "marginTopText")
                .style("text-anchor", "middle")
                .text("Price in USD")
                .attr("fill", "#1f77b4");

            var bars = barSvg.selectAll(".bar")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "bar");

            bars.append("rect")
                .attr("x", 0)
                .attr("y", function(d) {
                    return scaleY(d["name"])
                })
                .attr("width", function(d) {
                    return scaleXTop(d["price_usd"])
                })
                .attr("height", scaleY.bandwidth() / 2)
                .attr("fill", "#1f77b4");

            bars.append("rect")
                .attr("x", 0)
                .attr("y", function(d) {
                    return scaleY(d["name"]) + scaleY.bandwidth() / 2
                })
                .attr("height", scaleY.bandwidth() / 2)
                .attr("width", function(d) {
                    return scaleXBottom(+d["price_btc"])
                })
                .attr("fill", "#e6550d");

            bars.append("text")
                .text(function(d) {
                    return d["price_usd"]+"$"
                })
                .attr("fill", "#1f77b4")
                .attr("dy", "-0.25em")
                .attr("x", function(d) {
                    return scaleXTop(+d["price_usd"]) + 5
                })
                .attr("y", function(d) {
                    return scaleY(d["name"]) + scaleY.bandwidth() / 2
                })
                .attr("text-anchor", "start");

            bars.append("text")
                .text(function(d) {
                    return d["price_btc"]+" BTC"
                })
                .attr("fill", "#e6550d")
                // .attr("transform","rotate(270)")
                .attr("dy", "-0.25em")
                .attr("x", function(d) {
                    return scaleXBottom(+d["price_btc"]) + 5
                })
                .attr("y", function(d) {
                    return scaleY(d["name"]) + 2 * scaleY.bandwidth() / 2
                })
                .attr("text-anchor", "start");

            // bars.append("rect")
            // .attr("x",function(d){return scaleX( d["name"])})
            // .attr("y",height+20)
            // .attr("width",scaleX.bandwidth())
            // .attr("height",10)
            // .attr("fill",function(d){return color(d["name"])});



            function mouseover(d) { 
                var st = fData.filter(function(s) {
                        return s.State == d[0];
                    })[0],
                    nD = d3.keys(st.freq).map(function(s) {
                        return {
                            type: s,
                            freq: st.freq[s]
                        };
                    });  
                pC.update(nD);
                leg.update(nD);
            }

            function mouseout(d) {  
                pC.update(tF);
                leg.update(tF);
            }

            barChart.update = function(nD, color) {
                y.domain([0, d3.max(nD, function(d) {
                    return d[1];
                })]);

                var bars = hGsvg.selectAll(".bar").data(nD);
                bars.select("rect").transition().duration(500)
                    .attr("y", function(d) {
                        return y(d[1]);
                    })
                    .attr("height", function(d) {
                        return hGDim.h - y(d[1]);
                    })
                    .attr("fill", color);

                bars.select("text").transition().duration(500)
                    .text(function(d) {
                        return d3.format(",")(d[1])
                    })
                    .attr("y", function(d) {
                        return y(d[1]) - 5;
                    });
            }
            return barChart;

        }


        function renderTable(data) {
            var tab = {};
            var color = d3.scaleOrdinal(d3.schemeCategory10)

            var table = d3.select("#DetailsTable").append("table")
                .attr("transform", "translate(100,100)")
                .attr('class', 'DetailsTable');

            d3.select("#DetailsTable")
                .attr("transform", "translate(0,0)")
            var tableHead = table.append("thead")
                .attr("style", "color:#393b79");


            var tableH = tableHead.append("tr");
            tableH.append("th")
                .text("Rank")
                .attr("width", "50px");

            tableH.append("th")
                .text("Name")
                .attr("width", "100px");

            tableH.append("th")
                .attr("width", "75px")
                .text("Symbol");

            tableH.append("th")
                .attr("class", "chang1Hour")
                .text("1Hour");

            tableH.append("th")
                .attr("class", "change24Hour")
                .text("24Hour");

            tableH.append("th")
                .attr("class", "change7days")
                .text("7Days");

            tableH.append("th")
                .attr("class", "TotalSupplyHeader")
                .text("Total Supply");

            var tableB = table.append("tbody").selectAll("tr").data(data).enter().append("tr");


            tableB.append("td").text(function(d) {
                return d["rank"];
            });
            tableB.append("td").text(function(d) {
                return d["name"];
            });

            tableB.append("td").attr("class", 'legendFreq')
                .text(function(d) {
                    return d["symbol"];
                });

            tableB.append("td")
                .attr("class", "chang1Hour")
                .append("text")
                .attr("class", function(d) {
                    return +d["percent_change_1h"] < 0 ? "colorRed" : "colorGreen";
                })
                .text(function(d) {
                    return d["percent_change_1h"] + "%";
                })
                .attr("style", "text-align:end")



            tableB.append("td")
                .attr("class", "chang24Hour")

                .attr("class", function(d) {
                    return +d["percent_change_24h"] < 0 ? "colorRed" : "colorGreen";
                })
                .text(function(d) {
                    return d["percent_change_24h"] + "%";
                })
                .attr("style", "text-align:end");

            tableB.append("td")
                .attr("class", "change7days")
                .attr("class", function(d) {
                    return +d["percent_change_7d"] < 0 ? "colorRed" : "colorGreen";
                })
                .text(function(d) {
                    return d["percent_change_7d"] + "%";
                })
                .attr("style", "text-align:end");

            tableB.append("td").attr("class", 'legendFreq')
                .text(function(d) {
                    var p = d3.precisionPrefix(1e5, 1.3e6),
                        f = d3.formatPrefix("." + p, 1.3e6);
                    return f(+d["total_supply"]);
                })
                .attr("style", "text-align:end");

            tab.update = function(data) {

                var l = table.select("tbody").selectAll("tr").data(data);

                l.select(".legendFreq").text(function(d) {
                    return d3.format(",")(d.freq);
                });

                l.select(".legendPerc").text(function(d) {
                    return getLegend(d, nD);
                });
            }

            function getLegend(d, aD) { 
                return d3.format("%")(d.freq / d3.sum(aD.map(function(v) {
                    return v.freq;
                })));
            }

            return tab;
        }
        // GET =====================================================================
        // when landing on the page, get all todos and show them
        // use the service to get all the todos
        // function getObjPath(object,path){
        // 	var regex = /\./
        // 	var pathArray = path.split(regex);
        // 	var value;
        // 	var tempObject=object;

        // 	pathArray.forEach(function(d,index){

        // 		if(tempObject.hasOwnProperty(d)){

        // 			if(index === pathArray.length-1){
        // 				value = tempObject[d];

        // 			}else{
        // 				tempObject=tempObject[d];
        // 			}
        // 		}

        // 	});
        // 	if(value){
        // 		return value;
        // 	}else{
        // 		return null
        // 	}


        // }

        // var emp = {
        //   name: "Rajesh",
        //   address : {
        //          locality : {
        //                street : "2nd main domlur"
        //           }
        //     }
        // }
        // var data = getObjPath(emp, 'address.locality.street')

        CurrencyData.get().then(function successCallback(response) {
            createBarsforData(response.data);
            renderTable(response.data)
        }, function errorCallback(response) { 
        });

    }])

    .factory('CurrencyData', ['$http', function($http) {
        return {
            get: function($scope) {
                return $http({
                    method: 'GET',
                    url: "https://api.coinmarketcap.com/v1/ticker/?limit=10"
                });
            }
        }
    }]);