import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';
export default class ImageVerify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      src: '',
      sending: false
    };
  }

  static propTypes = {
    getVerifyCode: PropTypes.function
  };
  static defaultProps = {};

  init() {
    this.setState({
      sending: true
    });
    this.props.getVerifyCode().then(
      res => {
        const { image, img, pid } = res;
        this.setState({
          src: image || img
        });
        this.$emit('img-code-fetch-success', pid);
        this.setState({
          sending: false
        });
      },
      () => {
        this.setState({
          sending: false
        });
      }
    );
  }

  handleClick() {
    clearTimeout(this.state.timer);
    this.setState({
      timer: setTimeout(() => {
        this.init();
      }, 500)
    });
  }

  componentWillMount() {
    this.init();
  }

  render() {
    const { src } = this.state;
    const { handleClick } = this;
    return (
      <div className="img-verify-box" onClick={handleClick}>
        <img src={src} className="verify-img" />
      </div>
    );
  }
}
