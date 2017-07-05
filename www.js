(function Module(factory) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		define(factory);
	}
	else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	}
	else {
		window["Dondrag"] = factory();
	}
})(function Factory() {
	"use strict";

	if (typeof window == "undefined" || !window.document) {
		return function DondragError() {
			throw new Error("Dondrag.js requires a window with a document");
		};
	}
	console.log("I Need a Job: nathanpro@pku.edu.cn");
	var draggedEle,
		draggedRect,
		parentEl,

		cloneEle,
		hideCloneNode,
		wwwEle,

		lastEle,
		lastCSS,
		lastParentCSS,


		expando = 'Dondrag' + (new Date).getTime(),

		R_FLOAT = /left|right|inline/,

		_silent = false,

		supportDraggable = true;

	function Dondrag(ele, options) {
		
		this.ele     = ele;
		this.options = options;

		var defaults = {
			group: Math.random(),
			clone: false,
			// sort: true,
			// disabled: false,
			// store: null,
			// handle: null,
			// scroll: true,
			// scrollSensitivity: 30,
			// scrollSpeed: 10,
			// draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			// ghostClass: 'sortable-ghost',
			// chosenClass: 'sortable-chosen',
			// dragClass: 'sortable-drag',
			// ignore: 'a, img',
			// filter: null,
			// preventOnFilter: true,
			// animation: 0,
			// setData: function (dataTransfer, dragEl) {
				// dataTransfer.setData('Text', dragEl.textContent);
			// },
			// dropBubble: false,
			// dragoverBubble: false,
			// dataIdAttr: 'data-id',
			// delay: 0,
			// forceFallback: false,
			// fallbackClass: 'sortable-fallback',
			// fallbackOnBody: false,
			// fallbackTolerance: 0,
			fallbackOffset: {x: 0, y: 0}
		};


		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}


		for (var fn in this) {
			if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
				this[fn] = this[fn].bind(this);
			}
		}

		// Setup drag mode
		this.nativeDraggable = supportDraggable;

		// Bind events
		_on(ele, 'mousedown', this._onMouseDown);

		if (this.nativeDraggable) {
			
			_on(ele, 'dragenter', this._onDragEnter);
			_on(document, 'dragover',  this._onDragOver);
		}
		
	}

	Dondrag.prototype = {
		constructor: Dondrag,
		_onMouseDown: function(evt){
			var _this = this,
				ele = this.ele,
				options = this.options,
				// preventOnFilter = options.preventOnFilter,
				type = evt.type,
				target = evt.target,
				// originalTarget = evt.target.shadowRoot && evt.path[0] || target,
				// filter = options.filter,
				startIndex;
			
			var draggable =  /[uo]l/i.test(ele.nodeName) ? 'li' : '>*';
			
			target = _located(target, ele);
			
			this._prepareOnDragStart(evt, target);

		},
		_prepareOnDragStart: function(evt, target){
			var _this = this,
				ele = _this.ele;
			
			draggedEle = target;
			draggedEle.draggable = _this.nativeDraggable;
			draggedEle.style['will-change'] = 'transform';

			_toggleClass(draggedEle, "dondrag-chosen", true);
			
			_on(window, 'dragend', this._onDrop);
			if(this.nativeDraggable){
				_on(ele, 'dragstart', this._onDragStart);
			}
		},
		_onDragStart: function(evt){
			hideCloneNode = draggedEle.cloneNode(true)
			hideCloneNode.classList.remove("dondrag-chosen");
			hideCloneNode.style = false;
			hideCloneNode.style.display = "none";
			hideCloneNode.draggable = false
			draggedEle.before(hideCloneNode)
			setTimeout(function(){
      			draggedEle.classList.add('dondrag-ghost');
      		}, 0);
		},
		_onDragEnter: function (evt) {
			var ele    = this.ele,
				_this  = this,
				options= this.options,
				targetRect, 
				draggedRect,
				target= _located(evt.target, ele);
			
			draggedRect = draggedEle.getBoundingClientRect();

			/*
			 * > 在其他的parentNode下, 且
			 * > target 没有设置 pull:true    时
			 * > 无法放置
			 */
			// if(!draggedEle.parentNode.contains(target) && Object.keys(options.group).indexOf("pull")){
			if(!draggedEle.parentNode.contains(target) && !options.group["pull"]){
				// console.log(123,Object.keys(options.group).indexOf("pull"))
				return
			}

			/**
			 * clone 设置为 true, 且
			 * 隐藏节点和目标节点为兄弟节点, 且
			 * 没有设置pull为true
			 * 
			 */
			// if( options.clone == true && 
			// 	hideCloneNode.parentNode.contains(target) && 
			// 	!options.group.hasOwnProperty("pull")
			// 	// (Object.keys(options.group).indexOf("pull")===-1) 
			// ){
			// 	console.log(32131,Object.keys(options.group).indexOf("pull"))
			// 	return
			// }

			if(target!==null){
				// if(   target !== draggedEle && target.nodeName===draggedEle.nodeName){
				// if( target!==null && target !== draggedEle && target.nodeName!="UL"){
				if( target!==null && target !== draggedEle && target.nodeName===draggedEle.nodeName){
					if (lastEle !== target) {
							lastEle = target;							
							lastCSS = _css(target);
							lastParentCSS = _css(target.parentNode);
						}
						targetRect = target.getBoundingClientRect();

						var width = targetRect.right - targetRect.left,
							height = targetRect.bottom - targetRect.top,
							floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display)
								|| (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),
							isWide = (target.offsetWidth > draggedEle.offsetWidth),
							isLong = (target.offsetHeight > draggedEle.offsetHeight),
							halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
							nextSibling = target.nextElementSibling,
							moveVector = _onMove(ele, ele, draggedEle, draggedRect, target, targetRect, evt),
							after = false
						;

						if (moveVector !== false) {
							_silent = true;
							setTimeout(_unsilent, 30);

						// _cloneHide(activeSortable, isOwner);

						
						after = (nextSibling !== draggedEle) && !isLong || halfway && isLong;
						

						if (!draggedEle.contains(ele)) {
							if (after && !nextSibling) {
							//	ele.appendChild(draggedEle);
							} else {
								// draggedEle.before(draggedEle.cloneNode(true))
								
								// draggedEle.before(draggedEle.cloneNode(true))
							}
						}
						
						
						}
				
				}
			}
	    },
      	_onDragLeave: function (e) { },	
      	_onDragOver: function (e) {  e.preventDefault();  wwwEle = (e.target) },
      	_onDrop: function (e) {
      		var ele    = this.ele,
				_this  = this,
				options= this.options;
			
      		if( (hideCloneNode !==null && options.clone !== true) ||
      			(	options.clone == true && 
      				hideCloneNode !==null && 
      				hideCloneNode.parentNode.contains(draggedEle)  
      			))
      		{
				hideCloneNode.parentNode.removeChild(hideCloneNode)
				hideCloneNode = null
			}
			
      		draggedEle.classList.remove('dondrag-chosen');
      		draggedEle.style = null;
      		draggedEle.removeAttribute("draggable");
			draggedEle.removeAttribute("class");
			if (draggedEle.parentNode != wwwEle.parentNode && hasClass(wwwEle.parentNode, "demo1")) {
				wwwEle.innerHTML = draggedEle.innerHTML
				addClass(wwwEle, "focus")
			}
      	}      	
	}



	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt) {
		var evt,
			dondragit = fromEl[expando],
			onMoveFn,
			retVal;

		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);

		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || toEl.getBoundingClientRect();

		fromEl.dispatchEvent(evt);

		if (onMoveFn) {
			retVal = onMoveFn.call(dondragit, evt, originalEvt);
		}

		return retVal;
	}
	function _unsilent() {
		_silent = false;
	}
	function _animate(prevRect, target) {
		var ms =150;

		if (ms) {
			var currentRect = target.getBoundingClientRect();

			if (prevRect.nodeType === 1) {
				prevRect = prevRect.getBoundingClientRect();
			}

			_css(target, 'transition', 'none');
			_css(target, 'transform', 'translate3d('
				+ (prevRect.left - currentRect.left) + 'px,'
				+ (prevRect.top - currentRect.top) + 'px,0)'
			);

			target.offsetWidth; // repaint

			_css(target, 'transition', 'all ' + ms + 'ms');
			_css(target, 'transform', 'translate3d(0,0,0)');

			clearTimeout(target.animated);
			target.animated = setTimeout(function () {
				_css(target, 'transition', '');
				_css(target, 'transform', '');
				target.animated = false;
			}, ms);
		}
	}
	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			}
			else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}
				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}
	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
			}
		}
	}
	
	function _on(ele, evt, fn){
		ele.addEventListener(evt, fn, false);
	}

	function _located(target, ele){
		var tmp = target;
		if (ele) {
			target = target || document;
			do {
				if ( target.parentNode === ele ){
					return target;
				}
			} while (target = _getParent(target));
		}
		return null;
	}

	function _getParent(ele) {
		var parent = ele.host;
		return (parent && parent.nodeType) ? parent : ele.parentNode;
	}
	
	function hasClass(elem, cls) {
  cls = cls || '';
  if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}
 
function addClass(ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
  }
}
 
function removeClass(ele, cls) {
  if (hasClass(elem, cls)) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
      newClass = newClass.replace(' ' + cls + ' ', ' ');
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '');
  }
}




	Dondrag.create = function (ele, options) {
		return new Dondrag(ele, options);
	};

	Dondrag.version = '1.0.0';
	return Dondrag;
});

