# Donsort
The JavaScript plugin for dom structure to sorted.

**Donsort.js** is a JavaScript plugin for dom structure to be sorted by its own rules. Donsort helps you to sort table's column by desc or asc order. The only work is to add "#id" on some special tags, such as `<table>`, `<tbody>`, the prepared `<td>`. When the binding work finished, users can click the binded `<td>`. Then, the column of clicked tags would sorted by asc order, and another click would have the desc order result.

[Demo](http://www.jiangyu.me/web/Donsort)｜[中文文档](https://github.com/NathanJiang/Donsort/)

Download the latest version (1.0.0) here:

- [Donsort.zip](https://github.com/NathanJiang/Donsort/archive/master.zip)

To link directly to the latest release, copy this snippet:

``` html
<script src="http://www.jiangyu.me/web/Donsort/js/Donsort.js"></script>
```

The full source and tests are also available for download on GitHub.

# Introduction

Donsort allows you to bind sort function with Dom by rule of "table - [thead,tbody]", and then click the binded `<td>` Tag, the data below it would sort automatically. For example, a table has a column called "score", when you click `<td>`score`</td>`, the score column would be sorted.

The odd click event would get asc order result, the even click event would get desc order.

# Usage

For example, to bind the sort function in Chris Paul's scores in career.

The result is as follows, you can click the "green" tag to sort the column:

```JavaScript
// HTML Part
...
<td id="score1">得分</td>

// JavaScript part
Donsort.config({
    tableID: 'table1',
    tbodyID: 'tbody1', 
    sortedID: 'score1'
}).listen('table');
```

![img](http://www.jiangyu.me/img/0326/1.png)

Donsort also supported the rule without special td id but set sortedID="all".

Under these circumstances, table would bind event with all <td> in the <thead><tr></tr></thead>.
The example is as follows:

```JavaScript
Donsort.config({
    tableID: 'table1',
    tbodyID: 'tbody1', 
    sortedID: 'all'    
}).listen('table');
```

![img](http://www.jiangyu.me/img/0326/2.png)
