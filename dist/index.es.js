import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

var FullpageContext = React.createContext({
  number: 0,
  count: 0,
  subscribe: null,
  unsubscribe: null,
  goto: null,
  back: null,
  next: null
});

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var _class, _temp;

var Fullpage = (_temp = _class = function (_PureComponent) {
  inherits(Fullpage, _PureComponent);

  function Fullpage(props, context) {
    classCallCheck(this, Fullpage);

    var _this = possibleConstructorReturn(this, (Fullpage.__proto__ || Object.getPrototypeOf(Fullpage)).call(this, props, context));

    _this.slides = [];
    _this.state = {
      slide: null,
      translateY: 0,
      pageYOffset: 0,
      offsetHeight: 0,
      count: 0,
      number: 0,
      resetScroll: false
    };
    _this.ticking = false;
    _this.fullPageHeight = 0;
    _this.viewportHeight = 0;
    // binds
    _this.subscribe = _this.subscribe.bind(_this);
    _this.unsubscribe = _this.unsubscribe.bind(_this);
    _this.update = _this.update.bind(_this);
    _this.getIndex = _this.getIndex.bind(_this);
    // handle
    _this.handleScroll = _this.handleScroll.bind(_this);
    _this.handleResize = _this.handleResize.bind(_this);
    _this.handleKeys = _this.handleKeys.bind(_this);
    // refs
    _this.driverRef = React.createRef();
    _this.warperRef = React.createRef();
    _this.fullpageRef = React.createRef();
    return _this;
  }

  createClass(Fullpage, [{
    key: 'componentDidMount',
    value: function () {
      function componentDidMount() {
        this.handleResize();
        this.setState({
          slide: this.slides[0]
        });
        if (typeof window !== 'undefined') {
          window.addEventListener('scroll', this.handleScroll);
          window.addEventListener('resize', this.handleResize);
        }
        if (typeof document !== 'undefined') {
          document.addEventListener('keydown', this.handleKeys);
        }
      }

      return componentDidMount;
    }()
  }, {
    key: 'componentWillUnmount',
    value: function () {
      function componentWillUnmount() {
        // set body height == to 'auto'
        if (typeof window !== 'undefined') {
          window.removeEventListener('scroll', this.handleScroll);
          window.removeEventListener('resize', this.handleResize);
        }
        if (typeof document !== 'undefined') {
          document.removeEventListener('keydown', this.handleKeys);
        }
      }

      return componentWillUnmount;
    }()
  }, {
    key: 'getIndex',
    value: function () {
      function getIndex(slide) {
        return this.slides.indexOf(slide);
      }

      return getIndex;
    }()
  }, {
    key: 'subscribe',
    value: function () {
      function subscribe(slide) {
        // add new slide (push)
        var newSlides = [].concat(toConsumableArray(this.slides), [slide]);
        // sort slide for top to bottom
        this.slides = newSlides.sort(function (a, b) {
          var aTop = a.el.current.offsetTop;
          var bTop = b.el.current.offsetTop;
          return aTop - bTop;
        });
        this.setState({
          count: this.slides.length
        });
        this.ticking = false;
        this.handleResize();
        return slide;
      }

      return subscribe;
    }()
  }, {
    key: 'unsubscribe',
    value: function () {
      function unsubscribe(slide) {
        this.slides = this.slides.filter(function (s) {
          return s.el !== slide.el;
        });
        this.setState({
          count: this.slides.length
        });
        this.handleResize();
        this.handleScroll();
        return slide;
      }

      return unsubscribe;
    }()
  }, {
    key: 'handleScroll',
    value: function () {
      function handleScroll() {
        var _this2 = this;

        var _state = this.state,
            resetScroll = _state.resetScroll,
            translateY = _state.translateY;


        if (this.lockScroll) {
          // if > top and bottom < fix scroll
          window.scrollTo(0, translateY * -1);
          return false;
        }

        if (!this.ticking) {
          window.requestAnimationFrame(function () {
            if (resetScroll) {
              window.scrollTo(0, translateY * -1);
            }

            var pageYOffset = window.pageYOffset || 0;
            _this2.setState({
              pageYOffset: pageYOffset,
              resetScroll: false
            });

            var newSlide = _this2.slides.find(function (slide) {
              var el = slide.el.current;
              return pageYOffset < el.offsetTop + el.offsetHeight * 0.5;
            });
            _this2.goto(newSlide);
            _this2.ticking = false;
          });
        }
        this.ticking = true;
        return true;
      }

      return handleScroll;
    }()
  }, {
    key: 'handleResize',
    value: function () {
      function handleResize() {
        var _this3 = this;

        if (!this.ticking) {
          window.requestAnimationFrame(function () {
            // update count
            _this3.viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            _this3.fullPageHeight = _this3.fullpageRef.current && _this3.fullpageRef.current.clientHeight;
            _this3.driverRef.current.style.height = String(_this3.fullPageHeight || _this3.viewportHeight) + 'px';
            _this3.ticking = false;
          });
        }
        this.ticking = true;
      }

      return handleResize;
    }()
  }, {
    key: 'handleKeys',
    value: function () {
      function handleKeys(event) {
        var keyboardShortcut = this.props.keyboardShortcut;

        if (!keyboardShortcut) {
          return true;
        }

        if (event.keyCode === 33 // pageUp:    33,
        || event.keyCode === 37 // left:      37,
        || event.keyCode === 38 // up:        38,
        ) {
            event.preventDefault();
            return event.shiftKey ? this.first(event) : this.back(event);
          }
        if (event.keyCode === 34 // pageDown:  34,
        || event.keyCode === 39 // right:     39,
        || event.keyCode === 40 // down:      40,
        ) {
            event.preventDefault();
            return event.shiftKey ? this.last(event) : this.next(event);
          }
        if (event.keyCode === 35 // end:       35,
        ) {
            event.preventDefault();
            return this.last(event);
          }
        if (event.keyCode === 36 // home:      36,
        ) {
            event.preventDefault();
            return this.first(event);
          }

        return true;
      }

      return handleKeys;
    }()

    // TODO: add update methode

  }, {
    key: 'update',
    value: function () {
      function update() {
        return this;
      }

      return update;
    }()
  }, {
    key: 'goto',
    value: function () {
      function goto(newSlide) {
        var _this4 = this;

        var resetScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var slide = this.state.slide;
        var _props = this.props,
            transitionTiming = _props.transitionTiming,
            onChange = _props.onChange;


        if (slide !== newSlide) {
          var translateY = Math.max((this.fullPageHeight - this.viewportHeight) * -1, newSlide.el.current.offsetTop * -1);

          var onHide = slide.props.onHide;

          if (onHide && typeof onHide === 'function') {
            setTimeout(function () {
              return onHide(translateY);
            }, transitionTiming);
          }

          this.lockScroll = true;

          this.setState({
            slide: newSlide,
            number: this.getIndex(newSlide),
            translateY: translateY,
            offsetHeight: newSlide.el.current.offsetHeight,
            resetScroll: resetScroll
          });

          setTimeout(function () {
            _this4.lockScroll = false;
          }, 1000);

          var onShow = newSlide.props.onShow;

          if (onShow && typeof onShow === 'function') {
            onShow(translateY);
          }
          // call back function
          if (typeof onChange === "function") {
            onChange(this.state);
          }
        }

        return newSlide;
      }

      return goto;
    }()
  }, {
    key: 'back',
    value: function () {
      function back() {
        var number = this.state.number;

        var index = Math.max(0, number - 1);
        this.goto(this.slides[index], true);
      }

      return back;
    }()
  }, {
    key: 'next',
    value: function () {
      function next() {
        var length = this.slides.length;
        var number = this.state.number;

        var index = Math.min(length - 1, number + 1);
        this.goto(this.slides[index], true);
      }

      return next;
    }()
  }, {
    key: 'first',
    value: function () {
      function first() {
        this.goto(this.slides[0], true);
      }

      return first;
    }()
  }, {
    key: 'last',
    value: function () {
      function last() {
        this.goto(this.slides[this.slides.length - 1], true);
      }

      return last;
    }()
  }, {
    key: 'render',
    value: function () {
      function render() {
        var _this5 = this;

        var _props2 = this.props,
            children = _props2.children,
            style = _props2.style,
            className = _props2.className,
            transitionTiming = _props2.transitionTiming;
        var _state2 = this.state,
            translateY = _state2.translateY,
            pageYOffset = _state2.pageYOffset,
            offsetHeight = _state2.offsetHeight,
            number = _state2.number,
            count = _state2.count;


        return React.createElement(
          FullpageContext.Provider,
          {
            value: {
              translateY: translateY,
              pageYOffset: pageYOffset,
              offsetHeight: offsetHeight,
              number: number,
              count: count,
              subscribe: this.subscribe,
              unsubscribe: this.unsubscribe,
              update: this.update,
              goto: function () {
                function goto(slide) {
                  return _this5.goto(slide);
                }

                return goto;
              }(),
              back: this.back,
              next: this.next,
              getIndex: this.getIndex,
              transitionTiming: transitionTiming,
              className: className,
              style: style,
              warperRef: this.warperRef,
              fullpageRef: this.fullpageRef,
              slides: this.slides
            }
          },
          React.createElement('div', {
            name: 'Driver',
            style: {
              position: 'relative'
            },
            ref: this.driverRef
          }),
          children
        );
      }

      return render;
    }()
  }]);
  return Fullpage;
}(PureComponent), _class.contextType = FullpageContext, _class.propTypes = {
  children: PropTypes.node.isRequired,
  transitionTiming: PropTypes.number,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool])),
  className: PropTypes.string,
  onChange: PropTypes.func,
  keyboardShortcut: PropTypes.bool
}, _class.defaultProps = {
  transitionTiming: 700,
  style: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0
  },
  className: '',
  onChange: null,
  keyboardShortcut: true
}, _temp);

var _class$1, _temp$1;

var FullPageSections = (_temp$1 = _class$1 = function (_PureComponent) {
  inherits(FullPageSections, _PureComponent);

  function FullPageSections() {
    classCallCheck(this, FullPageSections);
    return possibleConstructorReturn(this, (FullPageSections.__proto__ || Object.getPrototypeOf(FullPageSections)).apply(this, arguments));
  }

  createClass(FullPageSections, [{
    key: 'render',
    value: function () {
      function render() {
        var _this2 = this;

        var _props = this.props,
            children = _props.children,
            style = _props.style,
            className = _props.className;

        return React.createElement(
          FullpageContext.Consumer,
          null,
          function (ctx) {
            return React.createElement(
              'div',
              {
                name: 'Warper',
                style: ctx.style // from
                , ref: _this2.warperRef
              },
              React.createElement(
                'div',
                {
                  name: 'Inner',
                  className: className,
                  style: _extends({
                    transition: 'transform ' + String(ctx.transitionTiming) + 'ms cubic-bezier(0.645, 0.045, 0.355, 1.000)'
                  }, style, {
                    transform: 'translate3D(0, ' + String(ctx.translateY) + 'px, 0)'
                  }),
                  ref: ctx.fullpageRef
                },
                children
              )
            );
          }
        );
      }

      return render;
    }()
  }]);
  return FullPageSections;
}(PureComponent), _class$1.contextType = FullpageContext, _class$1.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]))
}, _class$1.defaultProps = {
  className: '',
  style: {
    position: 'absolute',
    left: 0,
    right: 0
  }
}, _temp$1);

var _class$2, _temp$2;

var FullpageSectionContext = React.createContext();

var FullpageSection = (_temp$2 = _class$2 = function (_PureComponent) {
  inherits(FullpageSection, _PureComponent);

  function FullpageSection(props, context) {
    classCallCheck(this, FullpageSection);

    var _this = possibleConstructorReturn(this, (FullpageSection.__proto__ || Object.getPrototypeOf(FullpageSection)).call(this, props, context));

    _this.sectionRef = React.createRef();
    return _this;
  }

  createClass(FullpageSection, [{
    key: 'componentDidMount',
    value: function () {
      function componentDidMount() {
        var subscribe = this.context.subscribe;

        this.el = this.sectionRef;
        subscribe(this);
      }

      return componentDidMount;
    }()
  }, {
    key: 'componentWillUnmount',
    value: function () {
      function componentWillUnmount() {
        var unsubscribe = this.context.unsubscribe;

        unsubscribe(this);
      }

      return componentWillUnmount;
    }()
  }, {
    key: 'render',
    value: function () {
      function render() {
        var _props = this.props,
            children = _props.children,
            height = _props.height,
            style = _props.style,
            className = _props.className;
        var getIndex = this.context.getIndex;

        this.index = getIndex(this);

        return React.createElement(
          FullpageSectionContext.Provider,
          { value: {
              index: this.index
            }
          },
          React.createElement(
            'section',
            {
              className: className,
              style: _extends({
                height: height
              }, style),
              ref: this.sectionRef
            },
            children
          )
        );
      }

      return render;
    }()
  }]);
  return FullpageSection;
}(PureComponent), _class$2.contextType = FullpageContext, _class$2.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool])),
  className: PropTypes.string,
  onShow: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  onHide: PropTypes.func // eslint-disable-line react/no-unused-prop-types
}, _class$2.defaultProps = {
  height: '100vh',
  style: {},
  className: '',
  onShow: null, // eslint-disable-line no-unused-vars
  onHide: null // eslint-disable-line no-unused-vars
}, _class$2.Number = function (_ref) {
  var _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style;
  return React.createElement(
    FullpageSectionContext.Consumer,
    null,
    function (ctx) {
      return React.createElement(
        'span',
        { style: style },
        '' + String(ctx.index + 1)
      );
    }
  );
}, _temp$2);

var _class$3, _temp$3;

// TODO: do navigation
// eslint-disable-next-line react/prefer-stateless-function
var FullpageNavigation = (_temp$3 = _class$3 = function (_PureComponent) {
  inherits(FullpageNavigation, _PureComponent);

  function FullpageNavigation() {
    classCallCheck(this, FullpageNavigation);
    return possibleConstructorReturn(this, (FullpageNavigation.__proto__ || Object.getPrototypeOf(FullpageNavigation)).apply(this, arguments));
  }

  createClass(FullpageNavigation, [{
    key: 'render',
    value: function () {
      function render() {
        var _this2 = this;

        var _props = this.props,
            style = _props.style,
            itemStyle = _props.itemStyle,
            _props$reverse = _props.reverse,
            reverse = _props$reverse === undefined ? false : _props$reverse;
        var _context = this.context,
            number = _context.number,
            slides = _context.slides,
            transitionTiming = _context.transitionTiming;


        var gotoSlide = function () {
          function gotoSlide(slide) {
            var goto = _this2.context.goto;

            goto(slide);
          }

          return gotoSlide;
        }();

        return React.createElement(
          'div',
          { style: _extends({
              position: 'fixed',
              height: '100vh',
              zIndex: 100,
              top: 0,
              right: 0,
              listStyleType: 'none',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              justifyContent: 'center',
              paddingRight: '1em'
            }, style)
          },
          slides.map(function (slide, i) {
            return React.createElement(
              'div',
              {
                key: i.toString(),
                style: _extends({
                  borderRadius: '50%',
                  height: number === i ? 14 : 10,
                  width: number === i ? 14 : 10,
                  margin: number === i ? 3 : 5,
                  backgroundColor: reverse ? 'white' : 'black',
                  opacity: number === i ? 1 : 0.5,
                  transition: 'all ' + transitionTiming * 0.5 + 'ms ease-in-out'
                }, itemStyle),
                onClick: function () {
                  function onClick() {
                    return gotoSlide(slide);
                  }

                  return onClick;
                }(),
                'aria-label': 'Slide ' + String(i)
              },
              React.createElement(
                'span',
                { style: {
                    display: 'none'
                  }
                },
                '' + String(i)
              )
            );
          })
        );
      }

      return render;
    }()
  }]);
  return FullpageNavigation;
}(PureComponent), _class$3.contextType = FullpageContext, _class$3.propTypes = {
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool])),
  itemStyle: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool])),
  reverse: PropTypes.bool
}, _class$3.defaultProps = {
  style: {},
  itemStyle: {},
  reverse: false
}, _temp$3);

var _class$4, _temp$4;

var FullpageNumber = (_temp$4 = _class$4 = function (_PureComponent) {
  inherits(FullpageNumber, _PureComponent);

  function FullpageNumber() {
    classCallCheck(this, FullpageNumber);
    return possibleConstructorReturn(this, (FullpageNumber.__proto__ || Object.getPrototypeOf(FullpageNumber)).apply(this, arguments));
  }

  createClass(FullpageNumber, [{
    key: 'render',
    value: function () {
      function render() {
        // console.log('FullpageNumber render', this.context);
        return React.createElement(
          FullpageContext.Consumer,
          null,
          function (ctx) {
            return React.createElement(
              'span',
              null,
              '' + String(ctx.number + 1)
            );
          }
        );
      }

      return render;
    }()
  }]);
  return FullpageNumber;
}(PureComponent), _class$4.contextType = FullpageContext, _temp$4);

var _class$5, _temp$5;

var FullpageCount = (_temp$5 = _class$5 = function (_PureComponent) {
  inherits(FullpageCount, _PureComponent);

  function FullpageCount() {
    classCallCheck(this, FullpageCount);
    return possibleConstructorReturn(this, (FullpageCount.__proto__ || Object.getPrototypeOf(FullpageCount)).apply(this, arguments));
  }

  createClass(FullpageCount, [{
    key: 'render',
    value: function () {
      function render() {
        var style = this.props.style;

        return React.createElement(
          FullpageContext.Consumer,
          null,
          function (ctx) {
            return React.createElement(
              'span',
              { style: style },
              ctx.count
            );
          }
        );
      }

      return render;
    }()
  }]);
  return FullpageCount;
}(PureComponent), _class$5.contextType = FullpageContext, _class$5.propTypes = {
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]))
}, _class$5.defaultProps = {
  style: {}
}, _temp$5);

export default Fullpage;
export { Fullpage, FullPageSections, FullpageSection, FullpageContext, FullpageNumber, FullpageCount, FullpageNavigation };
