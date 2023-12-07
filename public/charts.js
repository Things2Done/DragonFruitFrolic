
let chart, maskImage;
const defaultKeys = ['visualMap', 'continuous', 'contoller', 'series', 'gauge', 'detail', 'piecewise', 'textStyle', 'markPoint', 'pie', 'roseType', 'label', 'emphasis', 'yAxis', 'name', 'type', 'gridIndex', 'normal', 'itemStyle', 'min', 'silent', 'animation', 'offsetCenter', 'inverse', 'borderColor', 'markLine', 'line', 'radiusAxis', 'radar', 'data', 'dataZoom', 'tooltip', 'toolbox', 'geo', 'parallelAxis', 'parallel', 'max', 'bar', 'heatmap', 'map', 'animationDuration', 'animationDelay', 'splitNumber', 'axisLine', 'lineStyle', 'splitLine', 'axisTick', 'axisLabel', 'pointer', 'color'];
const defaultData = defaultKeys.map(k => ({ name: k, value: 1 }));

let data = defaultData

function setData(d) {
  data = [...d, ...defaultData];
}

function initChart(dom) {
  chart = echarts.init(dom);

  maskImage = new Image();

  maskImage.onload = function () {
      refreshChart();
  }
  maskImage.crossOrigin = "Anonymous";

  maskImage.src = 'https://cdn.glitch.global/9aafa59c-ea4c-41b2-b09b-fbdda514fefd/logo.png?v=1701966202011';

}

function refreshChart() {
  var option = {
      series: [ {
          type: 'wordCloud',
          sizeRange: [3, 20],
          rotationRange: [0, 0],
          gridSize: 0,
          // shape: 'pentagon',
          maskImage: maskImage,
          drawOutOfBound: false,
          // layoutAnimation: true,
          keepAspect: true,
          textStyle: {
              fontWeight: 'bold',
              color: function () {
                  return 'rgb(' + [
                      Math.round(Math.random() * 200) + 50,
                      Math.round(Math.random() * 50),
                      Math.round(Math.random() * 50) + 50
                  ].join(',') + ')';
              }
          },
          emphasis: {
              textStyle: {
                  color: '#528'
              }
          },
          data: data
      } ]
  };
  chart.setOption(option);
}

