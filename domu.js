(function(global) {

  'use strict';

  var lib = {};

  /**
   * @desc Check wheter item is an object.
   *
   * @func  isObject
   * @param {*} item - any item
   * @return {boolean} boolean - is object
   *
   * @example
   * console.log(isObject({})); // true
   * console.log(isObject(2)); // false
   */
  function isObject(o) {
      return Object.prototype.toString.call(o) === '[object Object]';
  }


  /**
   * @desc Check wheter item is an array.
   *
   * @func isArray
   * @param {*} item - any item
   * @return {boolean} boolean - is array
   *
   * @example
   * console.log(isArray([])); // true
   * console.log(isObject({})); // false
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
   * addEvent(document.body, 'click', function(event) {
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
   * createPixel('http://example.com', function() {
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
   * @function createElement
   * @param {string} - type
   * @param {object} - attributes
   * @return {HTMLElement} - element
   */
  function createElement(type, attrs) {
      var el = document.createElement(type);
      setAttributes(el, attrs);
      return el;
  }

  /**
   * @function htmlContents
   * @param {HTMLElment} - element
   * @return {string} - contents
   */
  function htmlContents(el) {
      var div = createElement('div');
      var contents = append(div, el).innerHTML;
      remove(div);
      return contents;
  }

  /**
   * @function remove
   * @param {HTMLElment} - element
   * @return {undefined}
   */
  function remove(el) {
      return el.parentElement.removeChild(el);
  }

  /**
   * @function elementById
   * @param {string} - element id
   * @return {undefined}
   */
  function elementById(id) {
      return document.getElementById(id);
  }

  /**
   * @function anchor
   * @alias anchorElement
   * @param {string} - url
   * @param {boolean} - is external
   * @return {HTMLElement} - element
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
   * @function setAtributes
   * @param {HTMLElement} - element
   * @param {object} - attributes
   * @return {HTMLElement} - element
   */
  function setAttributes(el, attrs) {
      attrs = (typeof attrs === 'object' ? attrs : {});
      forOwn(attrs, function(k, v) {
          el.setAttribute(k, v);
      });
      return el;
  }

  /**
   * @function appendStylesheet
   * @param {string} - url
   * @param {function} - callback
   * @return {HTMLElement} - element
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
   * @function appendScript
   * @param {string} - url
   * @return {HTMLElement} - element
   */
  function appendScript(url) {
      var tag = createElement('script', {
          src: url,
          type: 'script/javascript'
      });
      append(document.getElementsByTagName('head')[0], tag);
      return tag;
  }

  /**
   * @function image
   * @alias imageElement
   * @param {string} - url
   * @param {object} - attributes
   * @return {HTMLElement} - element
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
   * @function hasClass
   * @param {HTMLElement} - element
   * @param {string} - class name
   * @return {boolean} - has class
   */
  function hasClass(el, name) {
      return new RegExp(' ' + name + ' ').test(' ' + el.className + ' ');
  }

  /**
   * @function addClass
   * @param {HTMLElement} - element
   * @param {string} - class name
   * @return {HTMLElement} - element
   */
  function addClass(el, name) {
      if (!hasClass(el, name)) {
          el.className += ' ' + name;
      }
      return el;
  }

  /**
   * @function removeClass
   * @param {HTMLElement} - element
   * @param {string} - class name
   * @return {HTMLElement} - element
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
   * @function textNode
   * @return {HTMLElement} - element
   */
  function textNode() {
      return document.createTextNode.bind(document)();
  }

  /**
   * @function wrap
   * @param {string} - element type
   * @return {function}
   */
  function wrap(type) {
    /**
     * @param {HTMLElement} - child element
     * @return {HTMLElement} - parent of element
     */
      return function(child) {
          var parent = document.createElement(type);
          parent.appendChild(child);
          return parent;
      };
  }

  /**
   * @function append
   * @param {HTMLElement} - parent element
   * @param {HTMLElement} - child element
   * @return {HTMLElement} - parent element
   */
  function append(parent, child) {
      parent.appendChild(child);
      return parent;
  }

  /**
   * @function getParams
   * @param {string} - url
   * @return {object} - parameters
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
   * @function setQueryStringParam
   * @param {string} - url
   * @param {string} - key
   * @param {string} - value
   * @return {string} - new url
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
   * @function parseHashtag
   * @param {string} - content string
   * @param {string} - url
   * @return {HTMLElement} - anchor element
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
   * @function parseUsername
   * @param {string} - content string
   * @param {string} - url
   * @return {HTMLElement} - anchor element
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
   * @function parseUrl
   * @param {string} - url
   * @return {HTMLElement} - anchor element
   */
  function parseUrl(str) {
      return str.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
          return url.link(url);
      });
  }

  /**
   * @function isMobileDevice
   * @param {string} [device=null] - device
   * @return {boolean} - is device
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
   * @function stripTags
   * @param {string} - HTML string
   * @return {string} - new HTML string
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
      global.domu = domu;
  }
})(this);
