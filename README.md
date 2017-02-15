# polygon.js

Create arbitrary polygons, which are suitable for data analysis, with label on canvas.

## Examples

	<canvas id="example"></canvas>
	<script src="polygon.min.js"></script>
	<script>
		let p = new Polygon({
			edges: 5,
			r: [40, 50, 60, 70, 80],
			bg: '#eef'
		});
		p.render({
			canvas: document.querySelector('#example'),
			animation: 800
		});
	</script>

click [demo](https://nossika.github.io/polygon.js/demo.html) to try it online.

## Options

|Parameter|Type|Default|Description|
|:-:|:-:|:-:|---|
|edges|Number|\\|edges of polygon|
|r|Number / Array|\\|distance from origin to vertex|
|rotate|Number|0|clockwise rotation|
|bg|String / Array|\\|background color|
|axis|String / Array|\\|axis color|
|border|String / Array|\\|border color|
|label|Array|\\|label on each vertex<br>*example:* `[{text: 'text1', size: 20, color: 'red'}, ...]`|
 
## Methods

### render: 

|Parameter|Type|Default|Description|
|:-:|:-:|:-:|---|
|canvas|HTMLElement|\\|target canvas|
|merge|Array|[]|draw multi polygon simultaneously<br>*Array member are instances of Polygon*|
|animation|Number|0|length of animation<br>*unit: ms*|

## Tips

* First axis is set on 12 o'clock direction, the rests would be set follow by clockwise. We can use parameter `rotate` to change it.

* Parameter's type `Number / Array` or `String / Array` means we can set each item by `Array` or set single value to all items by `Number` / `String`.

* If we don't need label for some vertices, use `{}` to skip them.
	
	for example:
	
		let p = new Polygon({
			edges: 3,
			...
			label: [
				{text: 'text1', size: 20, color: 'red'},
				{},
				{text: text3', size: 20, color: 'blue'},
			]
		}) ;

* `render` with parameter `merge` would draw multi concentric polygons simultaneously on one canvas. The render order is based on Array.

	for example:

		let p_bg = new Polygon({...});
		let p1 = new Polygon({...});
		let p2 = new Polygon({...});
		let p3 = new Polygon({...});
		p_bg.render({
			...
			merge: [p1, p2, p3]
		});
