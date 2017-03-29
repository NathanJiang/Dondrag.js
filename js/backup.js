 (function () {
 		var dragged,
		dragDom,
		donDrag,
		dragEl,

		R_SPACE = /\s+/g,
		R_FLOAT = /left|right|inline/;
	var _on = function(ele, event, fn){
		ele.addEventListener(event, fn, false);
	};

	var _dragStart = function(dragged){
		addClass(dragged, "sortable-ghost")
	};
	var _animate =  function (prevRect, target) {
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
		};
	var _css = function (el, prop, val) {
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
	};
	function hasClass(ele, cls) {
    return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        ele.className = ele.className.replace(reg, " ");
    }
}
function addClass(ele, cls) {
    	if (!this.hasClass(ele, cls)) ele.className = (ele.className + " " + cls).trim();
}
 	function _index(el) {
		var index = 0;

		if (!el || !el.parentNode) {
			return -1;
		}

		while (el && (el = el.previousElementSibling)) {
				index++;
		}

		return index;
	}

    var dnd = {
    
      // 初始化
      init: function () {
        var me = this;
        me.src = document.querySelector('#demo1-src');
        me.panelList = document.querySelector('.panel-list');


        me.src.addEventListener('dragstart', me.onDragStart, false);


        me.panelList.addEventListener('dragenter', me.onDragEnter, false);

        // 取消元素dragover默认行为,使其可拖放
        me.panelList.addEventListener('dragover', me.onDragOver, false);

        // 拖拽移出元素,清除视觉反馈
        me.panelList.addEventListener('dragleave', me.onDragLeave, false);

        // 鼠标释放,在拖放目标上接收数据并处理
        me.panelList.addEventListener('drop', me.onDrop, false);
      },
      onDragStart: function (e) {
      	dragged = e.target
      	dragEl = e.target
      	// console.log("start", "---------->",e.target.innerHTML)
        e.dataTransfer.setData('text/plain', 'demo1-src');
        setTimeout(function(){
      		e.target.classList.add('sortable-ghost');
      	}, 0);

      },
      onDragEnter: function (e) {
        if(e.target != dragged){
      		// console.log("enter", "---------->",e.target.nodeName)
      	}
      	var target= e.target;

		dragRect = dragEl.getBoundingClientRect();
		// if ( !target.animated && (target !== dragEl )) {


		if(e.target != dragged && !target.animated  && e.target.nodeName!="UL"){
			// console.log("enter")
			var lastEl;
			if (lastEl !== target) {
					lastEl = target;
					lastCSS = _css(target);
					lastParentCSS = _css(target.parentNode);
				}
				targetRect = target.getBoundingClientRect();
				
				var width = targetRect.right - targetRect.left,
					height = targetRect.bottom - targetRect.top,
					floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display)
						|| (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),
					isWide = (target.offsetWidth > dragEl.offsetWidth),
					isLong = (target.offsetHeight > dragEl.offsetHeight),
					halfway = (floating ? (e.clientX - targetRect.left) / width : (e.clientY - targetRect.top) / height) > 0.5,
					nextSibling = target.nextElementSibling,
					// moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, e),
					after = false
				;
				after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
				if (!dragEl.contains(document.querySelector('#Dondrag'))) {
						// console.log(1)
						target.parentNode.insertBefore(dragEl, after ? nextSibling : target);

				}
				parentEl = dragEl.parentNode; // actualization
				_animate(dragRect, dragEl);
				_animate(targetRect, target);
			// targetRect = target.getBoundingClientRect();
		
		}
      },
      onDragLeave: function (e) {
       if(e.target != dragged)
      		// console.log("leave", "---------->",e.target.innerHTML)
        if (e.target.classList.contains('panel-item')) {
          e.target.classList.remove('over');
        }
      },
      onDragOver: function (e) {
      	if(e.target != dragged)
      		// console.log("over", "---------->",e.target.innerHTML)
        e.preventDefault();
      },
      onDrop: function (e) {
      	// console.log("drop", "---------->",e.target.innerHTML)
      	e.target.classList.remove('sortable-ghost');
    	var id = e.dataTransfer.getData('text/plain');
    	var src = document.getElementById(id);
    	var target = e.target;
    	// dest = _index(target)
    	console.log(srcIndex)
      }
       


    };

    dnd.init();
  }());