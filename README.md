# Dondrag.js
The JavaScript library for dom structure to be dragged randomly.

**Dondrag.js** is a JavaScript library for dom structure to be randomly or under some rules. Dondrag.js helps you to regularize your `<ul>` or `<ol>` in your HTML. The only work is to bind `#id` on destination `ul` / `ol` tags. After prepared work, user can drag `li` between one list or some lists, also clone work is supported. Moreover, user can set every list’s special binded rules. What a pity, now, **touch event is not supported.**

[Demo](http://jiangyu.me/web/Dondrag/) | [中文文档](http://jiangyu.me/2017/03/29/Dondrag-js/)

Download the latest version (1.0.0) here:

- [Dondrag.zip](https://github.com/NathanJiang/Dondrag.js/archive/master.zip)

To link directly to the latest release, copy this snippet:

``` html
<script src="http://www.jiangyu.me/web/Dondrag/js/Dondrag.js"></script>
```

The full source and tests are also available for download on GitHub.

# Features
- Supports modern browsers, but touch devices not supported now
- Can drag from one list to another or within the same list
- CSS animation when moving items
- Smart auto-scrolling
- Built using native HTML5 drag and drop API
- No jQuery


# Usage
```JavaScript
// HTML Part
...
<ul id="demo">
	<li>item 1</li>
	<li>item 2</li>
	<li>item 3</li>
</ul>

// JavaScript part
Dondrag.create(document.getElementById('demo'), {
	group: {
		pull: true
	},
	clone: false,
	animation: 150,
});
```
~~You can use any element for the list and its elements, not just ul/li. Here is an example with divs.~~ Only support for `ol` || `ul`, other tags will be supported continuously.

# Options
#### `group` options
To drag elements from one list into another, if you set `pull: true`, this list can received the element from other lists.

#### `clone` Boolean
To clone the current element and drag it, the cloned element can be dragged into other **pull** lists.

#### `animation` time
Animation speed moving items when sorting. Unit of this is ms.


# Reference
- https://github.com/webplus/blog/issues/5
- https://github.com/RubaXa/Sortable
