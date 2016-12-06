require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';


var imageDatas = require('../data/imageDatas.json');
for (let item of imageDatas) {
  item.imageURL = require('../images/' + item.fileName);
}

/**
 * 从范围内生成随机整数
 * @param  {[type]} low  [description]
 * @param  {[type]} high [description]
 * @return {[type]}      [description]
 */
function getRandomIntFromRange(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * 生成图片组件样式
 * @return {[type]} [description]
 */
function genInitStyle() {
  return {
    left: 0,
    top: 0
  }
}

/**
 * 生成随机样式
 * @param  {[type]} leftRange [description]
 * @param  {[type]} topRange  [description]
 * @return {[type]}           [description]
 */
function genRandomStyle(leftRange, topRange, stageDOM, imgFigureDOM) {
  let l, t;
  const cl = (stageDOM.scrollWidth - imgFigureDOM.scrollWidth) / 2;
  const ct = (stageDOM.scrollHeight - imgFigureDOM.scrollHeight) / 2;
  const imgW = imgFigureDOM.scrollWidth;
  const imgH = imgFigureDOM.scrollHeight;
  do {
    l = getRandomIntFromRange(...leftRange);
    t = getRandomIntFromRange(...topRange);
  } while (Math.abs(l-cl) < imgW && Math.abs(t-ct) < imgH); // 碰撞检测
  return {
    left: l,
    top: t,
    transform: 'rotate(' + getRandomIntFromRange(-30, 30) + 'deg)'
  }
}

/**
 * 生成中心样式
 * @param  {[type]} stageDOM     [description]
 * @param  {[type]} imgFigureDOM [description]
 * @return {[type]}              [description]
 */
function genCenterStyle(stageDOM, imgFigureDOM) {
  return {
    left: (stageDOM.scrollWidth - imgFigureDOM.scrollWidth) / 2,
    top: (stageDOM.scrollHeight - imgFigureDOM.scrollHeight) / 2
  }
}


/**
 * 图片元素组件
 */
class ImgFigure extends React.Component {
  /**
   * 渲染
   * @return {[type]} [description]
   */
  render() {
    let classList = [
      'img-figure',
      this.props.is_reverse ? ' reverse' : '',
      this.props.is_center ? 'center' : ''
    ];
    return (
      <figure
        className={classList.join(' ')}
        style={this.props.style}
        onClick={this.props.handleClick}
      >
        <img
          src={this.props.data.imageURL}
          alt={this.props.data.title}
        />
        <figcaption className="img-title">
          <h2>{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            {this.props.data.desc}
          </div>
        </figcaption>
      </figure>
    );
  }
}

/**
 * 控制元件组件
 */
class ControllerUnit extends React.Component {
  /**
   * 渲染
   * @return {[type]} [description]
   */
  render() {
    let classList = [
      'controller-unit',
      this.props.is_reverse ? ' reverse' : '',
      this.props.is_center ? 'center' : ''
    ];
    let char = '';
    if (this.props.is_center) {
      if (this.props.is_reverse) {
        char = '←';
      }
    }
    return (
      <span
        className={classList.join(' ')}
        onClick={this.props.handleClick}
      >
        {char}
      </span>
    );
  }
}


/**
 * 主应用
 */
class AppComponent extends React.Component {

  /**
   * 初始化状态，用于首次渲染
   * @return {[type]} [description]
   */
  constructor() {
    super();
    this.state = {
      imgFigurePropsList: imageDatas.map(() => ({
        style: genInitStyle(),
        is_center: false,
        is_reverse: false
      }))
    }
  }


  /**
   * 挂载后获取相应 DOM 节点信息以计算坐标范围并重新设置 state
   * @return {[type]} [description]
   */
  componentDidMount() {
    this.stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    this.imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    this.leftRange = [-this.imgFigureDOM.scrollWidth/2, this.stageDOM.scrollWidth-this.imgFigureDOM.scrollWidth/2];
    this.topRange = [-this.imgFigureDOM.scrollHeight/2, this.stageDOM.scrollHeight-this.imgFigureDOM.scrollHeight/2];
    this.rearrange(0);
  }



  /**
   * 重排图片
   * @param  {[type]} centerIndex [description]
   * @return {[type]}             [description]
   */
  rearrange(centerIndex) {
    let imgFigurePropsList = imageDatas.map(() => ({
      style: genRandomStyle(this.leftRange, this.topRange, this.stageDOM, this.imgFigureDOM),
      is_center: false,
      is_reverse: false
    }))
    let newState = { imgFigurePropsList }
    newState.imgFigurePropsList[centerIndex] = {
      style: genCenterStyle(this.stageDOM, this.imgFigureDOM),
      is_center: true,
      is_reverse: false
    };
    this.setState(newState);
  }

  /**
   * 生成点击时间处理函数
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  genImgClickHandler(index) {
    if (this.state.imgFigurePropsList[index].is_center) {
      return (e) => {
        let newState;
        if (this.state.imgFigurePropsList[index].is_reverse) {
          // imgFigureDOM.classList.remove('reverse');
          newState = update(this.state, {
            imgFigurePropsList: {
              [index]: {
                is_reverse: {
                  $set: false
                }
              }
            }
          });
        } else {
          // imgFigureDOM.classList.add('reverse');
          newState = update(this.state, {
            imgFigurePropsList: {
              [index]: {
                is_reverse: {
                  $set: true
                }
              }
            }
          });
        }
        this.setState(newState);
        e.preventDefault();
        e.stopPropagation();
      };
    } else {
      return (e) => {
        this.rearrange(index);
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  /**
   * 渲染组件
   * @return {[type]} [description]
   */
  render() {
    let imgFigures = [];
    let controllerUnits = [];
    imageDatas.forEach((item, index) => {
      imgFigures.push(
        <ImgFigure
          key={index}
          data={item}
          ref={'imgFigure'+index}
          style={this.state.imgFigurePropsList[index].style}
          is_reverse={this.state.imgFigurePropsList[index].is_reverse}
          is_center={this.state.imgFigurePropsList[index].is_center}
          handleClick={this.genImgClickHandler(index)} // 闭包。每张图片的 index 确定
        />
      );
      controllerUnits.push(
        <ControllerUnit
          key={index}
          ref={'controllerUnit'+index}
          is_reverse={this.state.imgFigurePropsList[index].is_reverse}
          is_center={this.state.imgFigurePropsList[index].is_center}
          handleClick={this.genImgClickHandler(index)}
        />
      );
    })
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
        {imgFigures}
        </section>
        <nav className="controller-nav">
        {controllerUnits}
        </nav>
      </section>
    );
  }


}

AppComponent.defaultProps = {
};

export default AppComponent;
