# polygon.js

Create polygons with text label. They are suitable for data visualization.

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

Click [DEMO](https://nossika.github.io/polygon.js/demo.html) to try it!

## Init options

	let p = new Polygon(options);

* **options** (type: Object)

	* **edges** (required, type: Number): edges of polygon
	
	* **r** (required, type: Number / Array of Number): pixels from origin to each vertex

	* **rotate** (type: Number, default: 0): clockwise rotation angle

	* **bg** (type: String / Array of String):  color for each background 

	* **axis** (type: String / Array of String):  color for each axis

	* **border** (type: String / Array of String):  color for each border

	* **label** (type: Array of Object): label on each vertex, example: `[{text: 'text1', size: 20, color: 'red'}, ...]`


## Methods

* **render({canvas, merge, animation})**

	* **canvas** (required, type: HTMLElement): polygon will render on this canvas

	* **merge** (type: Array of Polygon): draw multi polygon simultaneously

	* **aniamtion** (type: Number, default: 0): ms of animation


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
