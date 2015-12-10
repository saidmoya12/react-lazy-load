import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

export default class LazyLoad extends Component {
  constructor(props) {
    super(props);
    this.onWindowScroll = this.onWindowScroll.bind(this);
  }
  state = {
    visible: false,
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onWindowScroll);
    window.addEventListener('resize', this.onWindowScroll);
    window.addEventListener('orientationchange', this.onWindowScroll); //Mobile
    this.onWindowScroll();
  }
  componentDidUpdate() {
    if (!this.state.visible) this.onWindowScroll();
  }
  componentWillUnmount() {
    this.onVisible();
  }
  onVisible() {
    window.removeEventListener('scroll', this.onWindowScroll);
    window.removeEventListener('resize', this.onWindowScroll);
    window.removeEventListener('orientationchange', this.onWindowScroll); //Mobile
    //callback
    this.props.onVisible();
  }
  onWindowScroll() {
    const { threshold } = this.props;

    const bounds = findDOMNode(this).getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const top = bounds.top + scrollTop;
    const height = bounds.bottom - bounds.top;

    if (top === 0 || (top <= (scrollTop + window.innerHeight + threshold)
                      && (top + height) > (scrollTop - threshold))) {
      this.setState({ visible: true });
      this.onVisible();
    }
  }
  render() {
    const elStyles = {
      height: this.props.height,
    };
    const elClasses = classNames({
      'lazy-load': true,
      'lazy-load-visible': this.state.visible,
    });

    return (
      <div className={elClasses} style={elStyles}>
        {this.state.visible && this.props.children}
      </div>
    );
  }
}

LazyLoad.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  threshold: PropTypes.number,
  onVisible: PropTypes.func
};
LazyLoad.defaultProps = {
  threshold: 0,
  onVisible: function(){}
};
