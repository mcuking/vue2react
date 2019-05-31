import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from './Loader';
import './index.css';
export default class CoolDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '<div>hello, i am hack</div>',
      show: true,
      name: 'tom',
      item: {
        id: '123'
      }
    };
  }

  static propTypes = {
    list: PropTypes.boolean,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    list2: PropTypes.array.isRequired,
    list3: PropTypes.object
  };
  static defaultProps = {
    title: 'hello world',
    list2: [],
    list3: {
      message: 'hello'
    }
  };

  componentWillMount() {
    this.setState({
      name: 'jerry'
    });
    this.state.name.we = 1;
  }

  componentDidMount() {
    console.log(this.state.name);
    document.addEventListener('click', this.handlePageClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handlePageClick);
  }

  handlePageClick(e) {
    const { name } = this;
    console.log('page click', e, name);
  }

  handleTitleClick(e) {
    const { id } = this.state.item;
    console.log('title clicked', e, id);
  }

  reverseName() {
    return this.state.name
      .split('')
      .reverse()
      .join('');
  }

  wrappedTitle() {
    return `Title is ${this.props.title}`;
  }

  render() {
    const { show, html } = this.state;
    const { list } = this.props;
    const { handleTitleClick } = this;
    const reverseName = this.reverseName();
    return (
      <div>
        {show && (
          <div
            a={list}
            b="1"
            onClick={handleTitleClick}
            style={{
              display: show ? 'block' : 'none'
            }}
            dangerouslySetInnerHTML={{
              __html: html
            }}
          >
            {list.map(item => (
              <p
                rt={show}
                sd="ss"
                swe={show}
                tr="23"
                className="er df"
                key={item.key}
              >
                {item.value}
              </p>
            ))}
            <h1 href="">{reverseName}</h1>
            <loader />
          </div>
        )}
      </div>
    );
  }
}
