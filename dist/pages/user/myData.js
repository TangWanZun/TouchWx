import * as echarts from '../../library/ec-canvas/echarts';

let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        },
      }
    },
    legend: {
      data: ['总产值(元)', '店内排名']
    },
    xAxis: [
      {
        type: 'category',
        data: ['7月', '8月', '9月', '10月', '11月', '12月'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '总产值(元)',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '店内排名',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '总产值(元)',
        type: 'bar',
        data: [156200, 182100, 156200, 156200, 556200, 312200]
      },
      {
        name: '店内排名',
        type: 'line',
        yAxisIndex: 1,
        data: [6, 5, 5, 2, 1, 3]
      }
    ]
  };
  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/user/myData',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },
  onReady() {
    setTimeout(function () {
      // 获取 chart 实例的方式
      console.log(chart)
    }, 2000);
  }
});
