(function(global) {

  'use strict';

  var lib = {};

  /**
   * @desc Check wheter item is an object.
   *
   * @func  isObject
   * @param {*} item - any item
   * @return {boolean} - is object
   *
   * @example
   * console.log(domu.isObject({})); // true
   * console.log(domu.isObject(2)); // false
   */
  function isObject(o) {
      return Object.prototype.toString.call(o) === '[object Object]';
  }


  /**
   * @desc Check wheter item is an array.
   *
   * @func isArray
   * @param {*} item - any item
   * @return {boolean} - is array
   *
   * @example
   * console.log(domu.isArray([])); // true
   * console.log(domu.isObject({})); // false
   */
  function isArray(o) {
      return Object.prototype.toString.call(o) === '[object Array]';
  }

  /**
   * @desc Bind event to element.
   *
   * @func addEvent
   * @param {HTMLElement} element - element
   * @param {string} eventName - event name
   * @param {function} eventCallback - event callback function
   * @return {undefined}
   *
   * @example
   * domu.addEvent(document.body, 'click', function(event) {
   *    console.log('click');
   * });
   */
  function addEvent(el, name, fn) {
      if (el.addEventListener) {
          return el.addEventListener(name, fn, false);
      } else if (el.attachEvent) {
          return el.attachEvent('on' + name, fn);
      }
  }

  /**
   * @desc Append an image to body. Used for pixel tracking.
   *
   * @func createPixel
   * @param {string} url - - url
   * @param {function} callback - callback
   * @return {string} url - url
   *
   * @example
   * domu.createPixel('http://example.com', function() {
   *    console.log('appended');
   * });
   */
  function createPixel(url, cb) {
      var img = document.createElement('img');
      img.style.visibility = 'hidden';
      img.style.width = '0px';
      img.style.height = '0px';
      img.src = url;
      img.onload = function() {
          img.src = '';
          cb && cb(null, url);
      };
      img.onerror = function(e) {
          cb && cb(e, url);
      };
      document.body.appendChild(img);
      return url;
  }

  /**
   * @desc Create a DOM element with attributes.
   *
   * @func createElement
   * @param {string} type - element type
   * @param {object} attributes - object with attributes
   * @return {HTMLElement} - element
   *
   * @example
   * var el = domu.createElement('div', {id: 'foo'});
   */
  function createElement(type, attrs) {
      var el = document.createElement(type);
      setAttributes(el, attrs);
      return el;
  }

  /**
   * @desc Get HTML contents of element.
   *
   * @func htmlContents
   * @param {HTMLElment} element - element
   * @return {string} - contents
   *
   * @example
   * var myDiv = document.getElementById('myDiv');
   * var contents = domu.htmlContents(myDiv);
   */
  function htmlContents(el) {
      var div = createElement('div');
      var contents = append(div, el).innerHTML;
      remove(div);
      return contents;
  }

  /**
   * @desc Remove element from DOM.
   *
   * @func remove
   * @param {HTMLElment} element - element
   * @return {undefined}
   *
   * @example
   * var myDiv = document.getElementById('myDiv');
   * domu.remove(myDiv);
   */
  function remove(el) {
      return el.parentElement.removeChild(el);
  }

  /**
   * @desc Get element by ID.
   *
   * @func elementById
   * @param {string} id - element id
   * @return {undefined}
   *
   * @example
   * var el = domu.elementById('myDiv');
   */
  function elementById(id) {
      return document.getElementById(id);
  }

  /**
   * @desc create an anchor element.
   *
   * @func anchorElement
   * @alias anchor
   * @param {string} url - url
   * @param {boolean} isExternal - is external (adds target="_blank")
   * @return {HTMLElement} - element
   *
   * @example
   * var a = domu.anchorElement('http://example.com', true);
   */
  function anchor(url, ext) {
      var a = document.createElement('a');
      a.href = url;
      if (isObject(ext)) {
          setAttributes(a, ext);
      } else if (isTruthy(ext)){
          a.target = '_blank';
      }
      return a;
  }

  /**
   * @desc Set attributes on element.
   *
   * @func setAtributes
   * @param {HTMLElement} element - element
   * @param {object} attributes - attributes
   * @return {HTMLElement} - element
   *
   * @example
   * var myDiv = document.getElementsById('myDiv');
   * domu.setAttributes(myDiv, {'data-foo': 'bar'});
   */
  function setAttributes(el, attrs) {
      attrs = (typeof attrs === 'object' ? attrs : {});
      forOwn(attrs, function(k, v) {
          el.setAttribute(k, v);
      });
      return el;
  }

  /**
   * @desc Append stylesheet to head.
   *
   * @func appendStylesheet
   * @param {string} url - url
   * @param {function} callback - callback
   * @return {HTMLElement} - element
   *
   * @example
   * domu.appendStylesheet('//example.com/style.css', function() {
   *    console.log('appended');
   * });
   */
  function appendStylesheet(url, cb) {
      var tag = document.createElement('link');
      setAttributes(tag, {
          href: url,
          type: 'text/css',
          rel: 'stylesheet'
      });
      if (cb) {
          addEvent(tag, 'load', cb);
      }
      append(document.getElementsByTagName('head')[0], tag);
      return tag;
  }

  /**
   * @desc Append script to head.
   *
   * @func appendScript
   * @param {string} url - url
   * @param {function} callback - callback
   * @return {HTMLElement} - element
   *
   * @example
   * domu.appendScript('//example.com/script.js', function() {
   *    console.log('appended');
   * });
   */
  function appendScript(url, cb) {
      var tag = createElement('script', {
          src: url,
          type: 'script/javascript'
      });
      if (cb) {
          addEvent(tag, 'load', cb);
      }
      append(document.getElementsByTagName('head')[0], tag);
      return tag;
  }

  /**
   * @desc Create image element.
   *
   * @func imageElement
   * @alias image
   * @param {string} url - url
   * @param {object} attributess - attributes
   * @return {HTMLElement} - element
   *
   * @example
   * var image = domu.imageElement('/images/kitty.png', {alt: 'Kitty'});
   */
  function image(url, attrs) {
      var img = document.createElement('img');
      img.src = url;
      img.alt = '';
      if (isObject(attributes)) {
          setAttributes(el, attributes);
      }
      return img;
  }

  /**
   * @desc Check if element has class.
   *
   * @func hasClass
   * @param {HTMLElement} element - element
   * @param {string} className - class name
   * @return {boolean} - has class
   *
   * @example
   * var myDiv = document.getElementById('myDiv');
   * if (domu.hasClass(myDiv, 'foo')) {
   *   console.log('Has class "foo"');
   * }
   */
  function hasClass(el, name) {
      return new RegExp(' ' + name + ' ').test(' ' + el.className + ' ');
  }

  /**
   * @desc Add class to element.
   *
   * @func addClass
   * @param {HTMLElement} element - element
   * @param {string} className - class name
   * @return {HTMLElement} - element
   *
   * @example
   * var myDiv = document.getElementById('myDiv');
   * domu.addClass(myDiv, 'foo');
   */
  function addClass(el, name) {
      if (!hasClass(el, name)) {
          el.className += ' ' + name;
      }
      return el;
  }

  /**
   * @desc Remove class from element.
   *
   * @func removeClass
   * @param {HTMLElement} - element
   * @param {string} className - class name
   * @return {HTMLElement} - element
   *
   * @example
   * var myDiv = document.getElementById('myDiv');
   * domu.removeClass(myDiv, 'foo');
   */
  function removeClass(el, name) {
      var newClass = ' ' + el.className.replace( /[\t\r\n]/g, ' ') + ' ';
      if (hasClass(el, name)) {
          while (newClass.indexOf(' ' + name + ' ') >= 0 ) {
              newClass = newClass.replace(' ' + name + ' ', ' ');
          }
          el.className = newClass.replace(/^\s+|\s+$/g, '');
      }
      return el;
  }

  /**
   * @desc Create a text node.
   *
   * @func textNode
   * @return {HTMLElement} - element
   *
   * @example
   * var myTextNode = domu.textNode();
   */
  function textNode() {
      return document.createTextNode.bind(document)();
  }

  /**
   * @desc wrap an element with another type of element.
   *
   * @func wrap
   * @param {string} elementType - element type
   * @return {function}
   *
   * @example
   * var mySpan = document.getElementById('mySpan');
   * var wrapped = domu.wrap('div')(mySpan); // <div><span id="mySpan"></span></div>
   */
  function wrap(type) {
    /**
     * @param {HTMLElement} childElement - child element
     * @return {HTMLElement} - parent of element
     */
      return function(child) {
          var parent = document.createElement(type);
          parent.appendChild(child);
          return parent;
      };
  }

  /**
   * @desc Append element to another element.
   *
   * @func append
   * @param {HTMLElement} parentElement - parent element
   * @param {HTMLElement} childElement - child element
   * @return {HTMLElement} - parent element
   *
   * @example
   * var myDiv = document.getElementById('myDiv');
   * var myOutterDiv = document.createElement('div');
   *
   * domu.append(myOutterDiv, myDiv);
   */
  function append(parent, child) {
      parent.appendChild(child);
      return parent;
  }

  /**
   * @desc Get parameter from url.
   *
   * @func getParams
   * @param {string} url - url
   * @return {object} - parameters
   *
   * @example
   * var params = domu.getParam('http://example.com?foo=bar');
   * console.log(params.foo); // 'bar'
   */
  function getParams(url) {
      var params;
      try {
          var prmstr = window.location.search.substr(1);
          if (url) {
              prmstr = url.split('?')[1];
          }
          var prmarr = prmstr.split('&');
          if (prmarr[0]) {
              params = [];
              for (var i = 0; i < prmarr.length; i++) {
                  var tmparr = prmarr[i].split('=');
                  params[tmparr[0]] = tmparr[1];
              }
          }
      } catch(err) {}
      return params;
  }

  /**
   * @desc Set a query string paramater.
   *
   * @func setQueryStringParam
   * @param {string} url - url
   * @param {string} key - key
   * @param {string} value - value
   * @return {string} - new url
   *
   * @example
   * var newUrl = domu.setQueryStringParam('http://example.com/?foo=bar', 'foo', 'qux');
   * console.log(newUrl); // http://example.com/?foo=qux
   */
  function setQueryStringParam(uri, key, value) {
      var regex = new RegExp('([?|&])' + key + '=.*?(&|#|$)', 'i');
      var separator = uri.indexOf('?') !== -1 ? '&' : '?';
      if (regex.test(uri)) {
          return uri.replace(regex, '$1' + key + '=' + value + '$2');
      } else {
          return uri + separator + key + '=' + value;
      }
  }

  /**
   * @desc Wrap hashtag in an anchor element.
   *
   * @func parseHashtag
   * @param {string} contentString - content string
   * @param {string} url - url
   * @return {HTMLElement} - anchor element
   *
   * @example
   * var string = 'some content #foo';
   * var newString = domu.parseHashtag(string, 'http://example.com/?search={{hashtag}}');
   * console.log(newString); // 'some content <a href="http://example.com/?search=%23foo">#foo</a>'
   */
  function parseHashtag(str, url) {
      return str.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
          var tmpUrl = url;
          var tag = t.replace('#','%23');
          tmpUrl = tmpUrl.replace(/\{\{\w+\}\}/g, tag);
          return t.link(tmpUrl);
      });
  }

  /**
   * @desc Wrap username in an anchor element.
   *
   * @func parseUsername
   * @param {string} contentString - content string
   * @param {string} url - url
   * @return {HTMLElement} - anchor element
   *
   * @example
   * var string = 'some content @foo';
   * var newString = domu.parseUsername(string, 'http://example.com/?search={{username}}');
   * console.log(newString); // 'some content <a href="http://example.com/?search=foo">@foo</a>'
   */
  function parseUsername(str, url) {
      return str.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
          var tmpUrl = url;
          var username = u.replace('@','');
          tmpUrl = tmpUrl.replace(/\{\{\w+\}\}/g, username);
          return u.link(tmpUrl);
      });
  }

  /**
   * @desc Wrap url string in an anchor element.
   *
   * @func parseUrl
   * @param {string} contentString - content string containing url
   * @return {HTMLElement} - anchor element
   *
   * @example
   * var string = 'some content http://example.com/';
   * var newString = domu.parseUrl(string);
   * console.log(newString); // 'some content <a href="http://example.com/">http://example.com/</a>'
   */
  function parseUrl(str) {
      return str.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
          return url.link(url);
      });
  }

  /**
   * @desc Return if is mobile device based on user agent.
   *
   * @func isMobileDevice
   * @param {string} [device=null] - device
   * @return {boolean} - is device
   *
   * @example
   * var isIphone = domu.isMobileDevice('iphone');
   */
  function isMobileDevice(device) {
      device = device || '';
      var regex = '';
      switch(device.toLowerCase()) {
          case 'android':
              regex = new RegExp('Android', 'i');
              break;
          case 'webos':
              regex = new RegExp('webOS', 'i');
              break;
          case 'iphone':
              regex = new RegExp('iPhone', 'i');
              break;
          case 'ipad':
              regex = new RegExp('iPad', 'i');
              break;
          case 'ios':
              regex = new RegExp('(iPhone|iPad)', 'i');
              break;
          case 'ios7':
              regex = new RegExp('(iPad|iPhone);.*CPU.*OS 7_\\d', 'i');
              break;
          case 'blackberry':
              regex = new RegExp('BlackBerry', 'i');
              break;
          case 'ie':
              regex = new RegExp('IEMobile', 'i');
              break;
          case 'opera':
              regex = new RegExp('Opera Mini', 'i');
              break;
          default:
              regex = new RegExp('(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)', 'i');
              break;
      }
      return regex.test(navigator.userAgent);
  }

  /**
   * @desc Strip HTML tags from a string.
   *
   * @func stripTags
   * @param {string} htmlString - HTML string
   * @return {string} - new HTML string
   *
   * @example
   * var htmlString = '<strong>Hi</strong>';
   * var newString = domu.stripTags(htmlString);
   * console.log(newString); // Hi
   */
  function stripTags(str) {
      return (str ? str.replace(/(<([^>]+)>)/ig, '') : str);
  }

  var _ = function(override) {
      var mixinObj = {};
      for (var k in lib) {
          if (lib.hasOwnProperty(k)) {
              var exists = _ !== 'undefined' && _[k];
              if (!override && exists) {
                  return;
              }
              mixinObj[k] = lib[k];
          }
      }
      delete mixinObj.domu;
      delete mixinObj.validate;
      delete mixinObj._;
      return mixinObj;
  };

  lib.addEvent = addEvent;
  lib.createPixel = createPixel;
  lib.createElement = createElement;
  lib.textNode = textNode;
  lib.image = lib.imageElement = image;
  lib.anchor = lib.anchorElement = anchor;
  lib.remove = remove;
  lib.getParams = getParams;
  lib.setQueryStringParam = setQueryStringParam;
  lib.parseHashtag = parseHashtag;
  lib.parseUsername = parseUsername;
  lib.parseUrl = parseUrl;
  lib.isMobileDevice = isMobileDevice;
  lib.stripTags = stripTags;
  lib.wrap = wrap;
  lib.append = append;
  lib.elementById = elementById;
  lib.hasClass = hasClass;
  lib.addClass = addClass;
  lib.removeClass  = removeClass;
  lib.setAttributes = setAttributes;
  lib.appendStylesheet = appendStylesheet;
  lib.appendScript = appendScript;
  lib.htmlContents = htmlContents;

  lib._ = _;

  if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = lib;
      }
      exports.domu = lib;
  } else if (typeof define === 'function' && define.amd) {
      define([], function() {
          return lib;
      });
  } else {
      global.domu = lib;
  }
}).call(this);
