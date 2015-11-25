"use strict";
var React = require("react");
var d3 = require("d3");
var utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-components.chart.chart-donut");

var ChartDonut = React.createClass({

    propTypes: {
        data: React.PropTypes.array.isRequired,
        messages: React.PropTypes.object.isRequired,
        width: React.PropTypes.string,
        height: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            width: "800",
            height: "500"
        };
    },

    render: function () {
        return <svg width={this.props.width} height={this.props.height} aria-labelledby="titreGraphique" aria-describedby="descGraphique" role="img">
                    <title id="titreGraphique">{this.props.messages.title}</title>
                </svg>;
    },
    
    componentDidMount: function () {
        d3.select(this.getDOMNode()).append("desc").attr("id", "descGraphique").text(this.props.messages.description);
        d3.select(this.getDOMNode()).append("a").attr("xlink:href", "#").append("g").attr("id", "quotesDonut");
        this.draw("quotesDonut", this.props.data, 450, 190, 160, 130, 30, 0);
    },
    
    shouldComponentUpdate: function (props) {
        d3.select(this.getDOMNode()).append("desc").attr("id", "descGraphique").text(this.props.messages.description);
        d3.select(this.getDOMNode()).append("a").append("g").attr("id", "quotesDonut");
        this.draw("quotesDonut", props.data, 450, 190, 160, 130, 30, 0);
        return false;
    },

    pieTop: function (d, rx, ry, ir) {
        if (d.endAngle - d.startAngle == 0) return "M 0 0";
        var sx = rx * Math.cos(d.startAngle),
            sy = ry * Math.sin(d.startAngle),
            ex = rx * Math.cos(d.endAngle),
            ey = ry * Math.sin(d.endAngle);

        var ret = [];
        ret.push("M", sx, sy, "A", rx, ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "1", ex, ey, "L", ir * ex, ir * ey);
        ret.push("A", ir * rx, ir * ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "0", ir * sx, ir * sy, "z");
        return ret.join(" ");
    },

    pieOuter: function (d, rx, ry, h) {
        var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);

        var sx = rx * Math.cos(startAngle),
            sy = ry * Math.sin(startAngle),
            ex = rx * Math.cos(endAngle),
            ey = ry * Math.sin(endAngle);

        var ret = [];
        ret.push("M", sx, h + sy, "A", rx, ry, "0 0 1", ex, h + ey, "L", ex, ey, "A", rx, ry, "0 0 0", sx, sy, "z");
        return ret.join(" ");
    },

    pieInner: function (d, rx, ry, h, ir) {
        var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
        var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

        var sx = ir * rx * Math.cos(startAngle),
            sy = ir * ry * Math.sin(startAngle),
            ex = ir * rx * Math.cos(endAngle),
            ey = ir * ry * Math.sin(endAngle);

        var ret = [];
        ret.push("M", sx, sy, "A", ir * rx, ir * ry, "0 0 1", ex, ey, "L", ex, h + ey, "A", ir * rx, ir * ry, "0 0 0", sx, h + sy, "z");
        return ret.join(" ");
    },

    getPercent: function (d) {
        return (d.endAngle - d.startAngle > 0.2 ?
        Math.round(1000 * (d.endAngle - d.startAngle) / (Math.PI * 2)) / 10 + "%" : "");
    },

    transition: function (id, data, rx, ry, h, ir) {
        function arcTweenInner(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return this.pieInner(i(t), rx + 0.5, ry + 0.5, h, ir);
            };
        }

        function arcTweenTop(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return this.pieTop(i(t), rx, ry, ir);
            };
        }

        function arcTweenOuter(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return this.pieOuter(i(t), rx - .5, ry - .5, h);
            };
        }

        function textTweenX(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return 0.6 * rx * Math.cos(0.5 * (i(t).startAngle + i(t).endAngle));
            };
        }

        function textTweenY(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return 0.6 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle));
            };
        }

        var _data = d3.layout.pie().sort(null).value(function (d) {
            return d.value;
        })(data);

        d3.select("#" + id).selectAll(".innerSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenInner);

        d3.select("#" + id).selectAll(".topSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenTop);

        d3.select("#" + id).selectAll(".outerSlice").data(_data)
            .transition().duration(750).attrTween("d", arcTweenOuter);

        d3.select("#" + id).selectAll(".percent").data(_data).transition().duration(750)
            .attrTween("x", textTweenX).attrTween("y", textTweenY).text(this.getPercent);
    },

    draw: function (id, data, x /*center x*/, y/*center y*/,
                    rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/) {

        var _data = d3.layout.pie().sort(null).value(function (d) {
            return d.value;
        })(data);
        var slices = d3.select("#" + id).append("g").attr("transform", "translate(" + x + "," + y + ")")
            .attr("class", "slices");

        slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
            .style("fill", function (d) {
                return d3.hsl(d.data.color).darker(0.7);
            })
            .attr("d", (d)=> {
                return this.pieInner(d, rx + 0.5, ry + 0.5, h, ir);
            })
            .each((d)=> {
                this._current = d;
            });

        slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
            .style("fill", function (d) {
                return d.data.color;
            })
            .style("stroke", function (d) {
                return d.data.color;
            })
            .attr("d", (d)=> {
                return this.pieTop(d, rx, ry, ir);
            })
            .each((d)=> {
                this._current = d;
            });

        slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
            .style("fill", function (d) {
                return d3.hsl(d.data.color).darker(0.7);
            })
            .attr("d", (d)=> {
                return this.pieOuter(d, rx - .5, ry - .5, h);
            })
            .each((d)=> {
                this._current = d;
            });

        slices.selectAll(".percent").data(_data).enter().append("text").attr("class", "percent")
            .attr("x", function (d) {
                return 0.6 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle));
            })
            .attr("y", function (d) {
                return 0.6 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle));
            })
            .text(function (d) {
                return d.data.value + "%"
            }).each((d)=> {
                this._current = d;
            });

        var arc = d3.svg.arc()
            .outerRadius(ry * 0.9)
            .innerRadius(ry * 0.4);

        var outerArc = d3.svg.arc()
            .innerRadius(ry * 0.9)
            .outerRadius(ry * 0.9);

        var key = function (d) {
            return d.data.label;
        };


        function midAngle(d) {
            //return d.endAngle + (0.5 * (d.endAngle + d.startAngle));
            return d.startAngle + (d.endAngle - d.startAngle) / 2
        }

        //LINE
        var lines = d3.select("#" + id).append("g").attr("transform", "translate(" + x + "," + y + ")").attr("class", "lines");
        var polyline = d3.select(".lines").selectAll("polyline").data(_data);
        polyline.enter().append("polyline");
        polyline.transition().duration(1000)
            .attrTween("points", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    var pos2 = outerArc.centroid(d2);
                    var pos3 = arc.centroid(d2);
                    var sens = 1;
                    if (midAngle(d2) < (Math.PI / 2) && midAngle(d2) > (3 * Math.PI / 2)) {
                        sens = 1;
                    }
                    if (midAngle(d2) > (Math.PI / 2) && midAngle(d2) < (3 * Math.PI / 2)) {
                        sens = -1;
                    }
                    pos[0] = 0.9 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle));
                    pos[1] = 0.9 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle));
                    pos2[0] = 1.3 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle));
                    pos2[1] = 1.3 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle));
                    pos3[0] = 1.3 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle)) + (20 * sens);
                    pos3[1] = 1.3 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle));
                    return [pos, pos2, pos3];
                };
            });
        polyline.exit().remove();

        //TEXT
        var labels = d3.select("#" + id).append("g").attr("transform", "translate(" + x + "," + y + ")").attr("class", "labels");
        var text = d3.select(".labels").selectAll("text").data(_data, key);
        text.enter().append("text").attr("dy", ".50em").text(function (d) {
            return d.data.label;
        });
        text.transition().duration(1000)
            .attr("class", "text-anchor")
            .attrTween("transform", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    var sens = 1;
                    if (midAngle(d2) < (Math.PI / 2) && midAngle(d2) > (3 * Math.PI / 2)) {
                        sens = 1;
                    }
                    if (midAngle(d2) > (Math.PI / 2) && midAngle(d2) < (3 * Math.PI / 2)) {
                        sens = -1;
                    }
                    var offset = d.data.label.length <= 5 ? 8 : 5;
                    if (d.data.label.length == 7) {
                        offset = 7
                    }
                    pos[0] = 1.3 * rx * Math.cos(0.5 * (d.startAngle + d.endAngle)) + (d.data.label.length * offset * sens);
                    pos[1] = 1.3 * ry * Math.sin(0.5 * (d.startAngle + d.endAngle));
                    return "translate(" + pos + ")";
                };
            });
        text.exit().remove();

        //LEGEND
        var legendx = rx - 150;
        var legendy = ry - 50;
        var r = 180;
        var legends = d3.select("#" + id).append("g").attr("transform", "translate(" + legendx + "," + legendy + ")").attr("class", "legends");
        var legend = d3.select(".legends").selectAll("g").data(_data);
        legend.enter().append("g")
            .attr("class", "legend")
            .attr("width", r)
            .attr("height", r * 2)
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });
        legend.append("rect")
            .data(_data)
            .attr("width", 25)
            .attr("height", 18)
            .style("fill", function (d) {
                return d.data.color;
            });
        legend.append("text")
            .data(_data)
            .attr("x", 28)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.data.label;
            });
    }
});

module.exports = ChartDonut;