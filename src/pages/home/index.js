import Taro, {Component} from "@tarojs/taro";
import {View} from "@tarojs/components";
import {deepClone} from '@/utils/tool'
import Control from '@/components/control'

import './index.less'

export default class Barrage extends Component {

  state = {
    papaHide: true,
    displayText: "欢迎li先生",
    animation: '',
    scorllAnimation: {},
    windowHeight: 0,
    currentSpeed: 0,
    fontSize: "30",
    color: "#fff",
    background: "#000",
  }

  componentWillMount() {
    this.setState({
      windowHeight: Taro.getSystemInfoSync().windowHeight,
    })
  }

  componentDidShow() {
    this.timer = null;
    let animation = Taro.createAnimation({
      timingFunction: 'linear'
    });
    let currentSpeed =  this.state.windowHeight * 2 / 5000;
    this.setState({
      animation: animation,
      currentSpeed: currentSpeed,   //初始化速度
    })
    setTimeout(()=> {
      this.scorllFuc();
    }, 500);
  }

  config = {
    navigationBarTitleText: '接机弹幕'
  }

  onShareAppMessage() {
    return {
      title: '接机弹幕',
      path: '/pages/barrage/index',
      imageUrl: ''
    }
  }

  /**
   * 查询字幕长度
   */
  getTextLen() {
    return new Promise((resolve) => {
      let query = Taro.createSelectorQuery();
      query.select('.scorll-text').boundingClientRect((obj) => {
        const textLen = parseInt(obj.height);
        resolve(textLen);
      }).exec();
    });
  }

  //子组件传值
  getText(value) {
    this.clearScorll();
    this.setState({
      displayText: value
    });
    this.scorllFuc();
  }

  getFontColor(value) {
    this.setState({
      color: value
    })
  }

  getBkColor(value) {
    this.setState({
      background: value
    })
  }

  getSpeed(value) {
    const { windowHeight } = this.state;
    this.clearScorll()
    this.setState({
      currentSpeed: windowHeight * 2 / value
    })
    this.scorllFuc();
  }

  getSize(value) {
    this.clearScorll()
    this.setState({
      fontSize: value
    })
    this.scorllFuc();
  }

  /**
   * 清除字幕
   */
  clearScorll() {
    const { animation } = this.state;
    clearInterval(this.timer);
    animation.translate3d(0, 0, 0).step({
      duration: 0
    })
    this.setState({
      scorll: animation.export()
    })
  }

  /**
   * 动画控制
   */
  scorllFuc() {
    let _this = this;
    Promise.resolve().then(() => {
      let {currentSpeed} = this.state;
      let animation = deepClone(this.state.animation);
      this.getTextLen().then(res=> {
        let scorllH = this.state.windowHeight * 2 + res;
        let scorllDuration = parseInt(scorllH / currentSpeed) || 5000;
        let scorllAmt = () => {
          animation.translate3d(-1332, 0, 0).step({
            duration: scorllDuration
          })
          animation.translate3d(0, 0, 0).step({
            duration: 0
          })
          _this.setState({
            scorllAnimation: {}
          }, ()=> {
            _this.setState({
              scorllAnimation: animation.export()
            })
          });
        };
        scorllAmt();
        // 循环动画
        this.timer = setInterval(() => {
          scorllAmt();
        }, scorllDuration + 500);
      });
    });
  }

  //隐藏工具框
  toggleBar() {
    const { papaHide } = this.state;
    this.setState({
      papaHide: !papaHide
    });
  }

  render() {
    const { displayText, scorllAnimation, color, background, fontSize, papaHide } = this.state;
    return (
      <View className='barrage-page'>
          <View className='barrage-wrap' style={{background: background}} onClick={this.toggleBar.bind(this)}>
            <View className='scorll-text' animation={scorllAnimation} style={{color: color, fontSize: fontSize + 'vw'}}>{displayText}</View>
          </View>
          <Control papaHide={papaHide} getFontColor={this.getFontColor.bind(this)} getBkColor={this.getBkColor.bind(this)} getSpeed={this.getSpeed.bind(this)} getSize={this.getSize.bind(this)} getText={this.getText.bind(this)}></Control>
      </View>
    )
  }
}