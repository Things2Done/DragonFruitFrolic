
let chart, maskImage;
const defaultData = [
  {
      name: 'Macys',
      value: 1
  },
  {
      name: 'Amy Schumer',
      value: 1
  },
  {
      name: 'Jurassic World',
      value: 1
  },
  {
      name: 'Charter Communications',
      value: 1
  },
  {
      name: 'Chick Fil A',
      value: 1
  },
  {
      name: 'Planet Fitness',
      value: 2
  },
  {
      name: 'Pitch Perfect',
      value: 1
  },
  {
      name: 'Express',
      value: 1
  },
  {
      name: 'Home',
      value: 1
  },
];

let data = defaultData;

function setData(d) {
  data = [...defaultData, ...d];
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
          sizeRange: [10, 150],
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
          data: data.sort(function (a, b) {
              return b.value  - a.value;
          })
      } ]
  };
  chart.setOption(option);
}

