angular.module('exchangeRate', [])

    .controller('mainController', ['$scope', '$http', 'CurrencyData', "$interval", function($scope, $http, CurrencyData, $interval) {
        $scope.formData = {};
        $scope.loading = true;

        var stop;
        $scope.refreshData = function(bars, table) {

            if (angular.isDefined(stop)) return;
            stop = $interval(function() {
                CurrencyData.get().then(function successCallback(response) {
                    bars.update(response.data);
                    table.update(response.data);
                }, function errorCallback(response) {
                    $scope.errorBody = "Unable to fetch live data please try again after some time.."
                    $("#errorModal").modal();
                });
            }, 300000);
        };

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
                .attr("class", "barUSD")
                .attr("x", 0)
                .attr("y", function(d) {
                    return scaleY(d["name"])
                })
                .attr("width", function(d) {
                    return scaleXTop(+d["price_usd"])
                })
                .attr("height", scaleY.bandwidth() / 2)
                .attr("fill", "#1f77b4");

            bars.append("rect")
                .attr("class", "barBTC")
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
                    return d["price_usd"] + "$"
                })
                .attr("class", "textUSD")
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
                .attr("class", "textBTC")
                .text(function(d) {
                    return d["price_btc"] + " BTC"
                })
                .attr("fill", "#e6550d")
                .attr("dy", "-0.25em")
                .attr("x", function(d) {
                    return scaleXBottom(+d["price_btc"]) + 5
                })
                .attr("y", function(d) {
                    return scaleY(d["name"]) + 2 * scaleY.bandwidth() / 2
                })
                .attr("text-anchor", "start");

            




            barChart.update = function(data) {
                scaleXTop.domain(d3.extent(data, function(d) {
                        return +d["price_usd"];
                    }))
                    .range([0, width]);
                scaleXBottom.domain(d3.extent(data, function(d) {
                        return +d["price_btc"];
                    }))
                    .range([0, width]);

                var bars = barSvg.selectAll(".bar").data(data);
                bars.select(".barUSD").transition().duration(500)

                    .attr("width", function(d) {
                        return scaleXTop(+d["price_usd"])
                    })

                bars.select(".barBTC").transition().duration(500)
                    .attr("width", function(d) {
                        return scaleXBottom(+d["price_btc"]);
                    })

                bars.select(".textUSD").transition().duration(500)
                    .text(function(d) {
                        return d["price_usd"] + "$"
                    })
                    .attr("x", function(d) {
                        return scaleXTop(+d["price_usd"]) + 5;
                    })

                bars.select(".textBTC").transition().duration(500)
                    .text(function(d) {
                        return d["price_btc"] + " BTC"
                    })
                    .attr("x", function(d) {
                        return scaleXBottom(+d["price_btc"]) + 5;
                    })
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


            tableB.append("td")
                .attr("class", "rank")
                .text(function(d) {
                    return d["rank"];
                });
            tableB.append("td")
                .attr("class", "name")
                .text(function(d) {
                    return d["name"];
                });

            tableB.append("td")
                .attr("class", 'symbol')
                .text(function(d) {
                    return d["symbol"];
                });

            tableB.append("td")
                .attr("class", "chang1Hour")
                .style("color", function(d) {
                    return +d["percent_change_1h"] < 0 ? "red" : "green";
                })
                .text(function(d) {
                    return d["percent_change_1h"] + "%";
                })
                .style("font-weight", "bold")
                .style("text-align", "end")



            tableB.append("td")
                .attr("class", "chang24Hour")
                .style("color", function(d) {
                    return +d["percent_change_24h"] < 0 ? "red" : "green";
                })
                .text(function(d) {
                    return d["percent_change_24h"] + "%";
                })
                .style("text-align", "end")
                .style("font-weight", "bold");

            tableB.append("td")
                .attr("class", "change7days")
                .style("color", function(d) {
                    return +d["percent_change_7d"] < 0 ? "red" : "green";
                })
                .text(function(d) {
                    return d["percent_change_7d"] + "%";
                })
                .style("text-align", "end")
                .style("font-weight", "bold");

            tableB.append("td").attr("class", 'totalSupply')
                .text(function(d) {
                    var p = d3.precisionPrefix(1e5, 1.3e6),
                        f = d3.formatPrefix("." + p, 1.3e6);
                    return f(+d["total_supply"]);
                })
                .attr("style", "text-align:end");

            tab.update = function(data) {

                var table = d3.selectAll("#DetailsTable").select("tbody").selectAll("tr").data(data);


                table.select(".rank")
                    .text(function(d) {
                        return d["rank"];
                    });


                table.select(".name")
                    .text(function(d) {
                        return d["name"];
                    });

                table.select(".symbol")
                    .text(function(d) {
                        return d["symbol"];
                    });

                table
                    .select(".chang1Hour")
                    .style("color", function(d) {
                        return +d["percent_change_1h"] < 0 ? "red" : "green";
                    })
                    .text(function(d) {
                        return d["percent_change_1h"] + "%";
                    })



                table
                    .select(".chang24Hour")
                    .style("color", function(d) {
                        return +d["percent_change_24h"] < 0 ? "red" : "green";
                    })
                    .text(function(d) {
                        return d["percent_change_24h"] + "%";
                    });

                table
                    .select(".change7days")
                    .style("color", function(d) {
                        return +d["percent_change_7d"] < 0 ? "red" : "green";
                    })
                    .text(function(d) {
                        return d["percent_change_7d"] + "%";
                    })

                table
                    .select(".totalSupply").attr("class", 'totalSupply')
                    .text(function(d) {
                        var p = d3.precisionPrefix(1e5, 1.3e6),
                            f = d3.formatPrefix("." + p, 1.3e6);
                        return f(+d["total_supply"]);
                    })
            }



            return tab;
        }
    

        CurrencyData.get().then(function successCallback(response) {



            var bars = createBarsforData(response.data);
            var table = renderTable(response.data);
            $scope.refreshData(bars, table);

        }, function errorCallback(response) {
            $scope.errorBody = "Unable to fetch live data please try again after some time.."
            $("#errorModal").modal();
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