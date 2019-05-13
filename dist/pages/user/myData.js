import * as echarts from '../../library/ec-canvas/echarts';

let chart = null;

// 会员数量占比
function initChart1(canvas, width, height) {
    chart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chart);
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} {b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['会员客户', '非会员客户'],
            textStyle: {
                color: '#fff'
            }
        },
        series: [{
            name: '',
            type: 'pie',
            radius: '77%',
            roseType: 'radius',
            label: {
                normal: {
                    show: true,
                    position: 'outside',
                    formatter: "{b}\n{d}% \n {c}",
                },
                // emphasis: {
                //     show: true,
                //     textStyle: {
                //         fontSize: '30',
                //         fontWeight: 'bold'
                //     }
                // }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data: [{
                    value: 21762,
                    name: '会员客户'
                },
                {
                    value: 37891,
                    name: '非会员客户'
                }
            ],
            itemStyle: {
                normal: {
                    color: function(params) {
                        //自定义颜色
                        var colorList = [
                            '#ff5f5f', '#3b9f92', '#FFFF00', '#FF8C00', '#FF0000', '#FE8463',
                        ];
                        return colorList[params.dataIndex]
                    }
                }
            }
        }]
    };
    chart.setOption(option);
    return chart;
}

// 产值数量占比
function initChart2(canvas, width, height) {
    chart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chart);
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} {b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['低产值', '中产值','高产值'],
            textStyle: {
                color: '#fff'
            }
        },
        series: [{
            name: '',
            type: 'pie',
            radius: '55%',
            roseType:'radius',
            label: {
                normal: {
                    show: true,
                    position: 'outside',
                    formatter: "{b}\n{d}% \n {c}",
                },
                // emphasis: {
                //     show: true,
                //     textStyle: {
                //         fontSize: '30',
                //         fontWeight: 'bold'
                //     }
                // }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            data: [{
                value: 9461,
                name: '低产值'
            },
            {
                value: 30172,
                name: '中产值'
            },
            {
                value: 9162,
                name: '高产值'
            }
            ],
            itemStyle: {
                normal: {
                    color: function (params) {
                        //自定义颜色
                        var colorList = [
                            '#d23aba', '#4fd89c', '#794fd8', '#FF8C00', '#FF0000', '#FE8463',
                        ];
                        return colorList[params.dataIndex]
                    }
                }
            }
        }]
    };
    chart.setOption(option);
    return chart;
}

Page({
    //   onShareAppMessage: function (res) {
    //     return {
    //       title: 'ECharts 可以在微信小程序中使用啦！',
    //       path: '/pages/user/myData',
    //       success: function () { },
    //       fail: function () { }
    //     }
    //   },
    data: {
        // 会员数量占比
        ec1: {
            onInit: initChart1
        },
        // 产值数量占比
        ec2: {
            onInit: initChart2
        }
    },
    onReady() {
        // setTimeout(function () {
        //   // 获取 chart 实例的方式
        //   console.log(chart)
        // }, 2000);
    }
});