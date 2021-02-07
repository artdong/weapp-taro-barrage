import Taro, {Component} from "@tarojs/taro";
import {View, ScrollView, Input} from "@tarojs/components";
import PropTypes from "prop-types"

import './index.less'

export default class Control extends Component {

  state = {
    showFlag: true,
    controlShow:false,
    hintText:"",
    colorArray:[
      '#fff',
      "#000",
      "#FF0000",
   
      "#FF99FF",
      "#FFFF00",
      "#FFCC00",
      
      "#00FF00",
      "#0099FF",
      "#6633FF",
      "#0000FF",
    ],
    speedArray:[
      { name: "0.5x", code: "7000" },
      { name: "1x", code: "5000" },
      { name: "2x", code: "3000" },
    ],
    SizeArray:[
      { name: "特小", code: "15" },
      { name: "小", code: "25" },
      { name: "正常", code: "40" },
      { name: "大", code: "60" },
      { name: "特大", code: "80" },
    ],
    moshiArray:[
      { name: "一行字", code: "0" },
      { name: "一段话", code: "1" },
    ],
    // homeImg: require('../../static/img/home.png'),
    resetImg: require('../../static/img/reset.png'),
    settingImg: require('../../static/img/setting.png')
  }

  static propTypes = {
    config: PropTypes.object
  }

  static defaultProps = {
    config:{
        "fontColor":true,
        "speed":true,
        "fontSize":true,
        "bkColor": true,
        "moshi": false
    }
  }

  componentWillMount() {
    
  }

  componentDidShow() {
    
  }

  focus = () => {
    this.setState({
      hintText: ""
    })
  }

  onblur = () => {
    this.setState({
      hintText: ""
    })
  }

  goHome = () => {
    wx.navigateTo({
      url: '../home/index'
    })
  }

  showControl = () => {
    this.setState({
      showFlag:false,
      controlShow: true
    })
  }

  hideControl = () => {
    this.setState({
      showFlag: true,
      controlShow: false
    })
  }

  textInput = (e) => {
    const { getText } = this.props;
    getText(e.detail.value);
  }

  selectFontColor = (value) => {
    const { getFontColor } = this.props;
    let color = value;
    getFontColor(color);
  }

  selectBkColor = (value) => {
    const { getBkColor } = this.props;
    let color = value;
    getBkColor(color);
  }

  selectMoshi = (value) => {
    const { getMoshi } = this.props;
    let moshi = value;
    getMoshi(moshi);
  }

  selectSpeed = (value) => {
    const { getSpeed } = this.props;
    let speed = value;
    getSpeed(speed);
  }

  selectFontSize = (value) => {
    const { getSize } = this.props;
    let fontSize = value;
    getSize(fontSize);
  }

  render() {
    const { papaHide, config } = this.props;
    const { showFlag, controlShow, hintText, colorArray, moshiArray, speedArray, SizeArray, resetImg, settingImg } = this.state;
    return (
      <View className='control-page'>
          {
            showFlag && papaHide ? 
            <View className='controlWrap'>
                <View className='hint'>{hintText}</View>
                <View className='controlMain'>
                    {/* <i className="iconfont icondefault icon" onClick={this.goHome}></i> */}
                    <View className="icon-wrap">
                        <Image className='icon' src={resetImg} onClick={this.goHome}></Image>
                    </View>
                    <Input className="input" placeholder="请输入弹幕" onFocus={this.focus} onBlur={this.onblur} onConfirm={this.textInput}></Input>
                    <View className="icon-wrap">
                        <Image className='icon' src={settingImg} onClick={this.showControl}></Image>
                    </View>
                </View>
            </View> 
            : null
          }
          {
              controlShow ? 
              <View className="controlContent">
                <View className="confirm" onClick={this.hideControl}>完成</View>
                <ScrollView className="controlContent" scroll-y>
                    {
                        config.fontColor ? <View className="settingWrap">
                            <text className="settingTitle">字体颜色</text>
                            <ScrollView scrollX className='colorContent' scroll-x="true" scroll-left='0'>
                                {
                                    colorArray.map(item => {
                                        return <View className="colorItem" style={{background:item}} onClick={()=>this.selectFontColor(item)}></View>
                                    })
                                }
                            </ScrollView>
                        </View> : null
                    }
                    {
                        config.moshi ? <View className="settingWrap">
                            <text className="settingTitle">展示模式</text>
                            <ScrollView scrollX className='colorContent' scroll-x="true" scroll-left='0'>
                                {
                                    moshiArray.map(item => {
                                        return <View className="colorItem bk" onClick={()=>this.selectMoshi(item.code)}>{item.name}</View>
                                    })
                                }
                            </ScrollView>
                        </View> : null
                    }
                    {
                        config.speed ? <View className="settingWrap">
                            <text className="settingTitle">滚动速度</text>
                            <ScrollView scrollX className='colorContent' scroll-x="true" scroll-left='0'>
                                {
                                    speedArray.map(item => {
                                        return <View className="colorItem bk" onClick={()=>this.selectSpeed(item.code)}>{item.name}</View>
                                    })
                                }
                            </ScrollView>
                        </View> : null
                    }
                    {
                        config.fontSize ? <View className="settingWrap">
                            <text className="settingTitle">字体大小</text>
                            <ScrollView scrollX className='colorContent' scroll-x="true" scroll-left='0'>
                                {
                                    SizeArray.map(item => {
                                        return <View className="colorItem bk" onClick={()=>this.selectFontSize(item.code)}>{item.name}</View>
                                    })
                                }
                            </ScrollView>
                        </View> : null
                    }
                    {
                        config.bkColor ? <View className="settingWrap">
                            <text className="settingTitle">背景颜色</text>
                            <ScrollView scrollX className='colorContent' scroll-x="true" scroll-left='0'>
                                {
                                    colorArray.map(item => {
                                        return <View className="colorItem" style={{background:item}} onClick={()=>this.selectBkColor(item)}></View>
                                    })
                                }
                            </ScrollView>
                        </View> : null
                    }
                </ScrollView>
              </View> : null
          }
      </View>
    )
  }
}