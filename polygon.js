(factory => {
    let root = (typeof self === 'object' && self.self === self && self) ||
        (typeof global === 'object' && global.global === global && global);
    if (typeof define === 'function' && define.amd) {
        define([], () => {
            root.Polygon = factory();
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Polygon = factory();
    }
})(() => {
    class Polygon {
        constructor ({
            edges,
            r,
            rotate,
            bg,
            axis,
            border,
            label,
        }) {
            if (!edges || typeof edges !== 'number') {throw new TypeError('edges must be an number');}
            this._edges = edges;
            this._r = r instanceof Array ? r : (new Array(edges)).fill(r);
            this._rotate = 0;
            if (rotate && typeof rotate === 'number') {
                while (rotate < 0) {rotate += 360}
                this._rotate = rotate;
            }
            this._bg = bg && (bg instanceof Array ? bg : (new Array(edges)).fill(bg));
            this._axis = axis && (axis instanceof Array ? axis : (new Array(edges)).fill(axis));
            this._border = border && (border instanceof Array ? border : (new Array(edges)).fill(border));
            this._label = label;
            this._vertices = [];

            this._r.forEach((r, i) => {
                let angle = 360 * (i / this._edges) + this._rotate;
                let quadrant = Math.floor(angle / 90) % 4;
                let radian = (angle % 90) * (Math.PI / 180);
                let [x, y] = [0, 0];

                switch (quadrant) {
                    case 0:
                        [x, y] = [+r * Math.sin(radian), -r * Math.cos(radian)];
                        break;
                    case 1:
                        [x, y] = [+r * Math.cos(radian), +r * Math.sin(radian)];
                        break;
                    case 2:
                        [x, y] = [-r * Math.sin(radian), +r * Math.cos(radian)];
                        break;
                    case 3:
                        [x, y] = [-r * Math.cos(radian), -r * Math.sin(radian)];
                        break;
                }

                let vertex = [x, y];
                vertex.quadrant = quadrant;
                this._vertices.push(vertex);
            });
        }

        render ({
            canvas,
            merge = [],
            animation = -1,
        }) {
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (animation > 0 && !this._tick) { // 初始化动画计时
                this._tick = 1;
                this._tick_end = animation / (1000 / 60);
            }
            let scale = 1;

            if (this._tick) { // 计算缩放比例
                scale = this._tick / this._tick_end;
            }

            [this].concat(...merge).forEach(polygon => { // 渲染每个图形
                polygon.draw(canvas, scale);
            });

            if (this._tick) { // 更新计时
                this._tick++;
                if (this._tick >= this._tick_end) { // 动画结束
                    Reflect.deleteProperty(this, '_tick');
                    Reflect.deleteProperty(this, '_tick_end');
                } else {
                    return requestAnimationFrame(() => {this.render({canvas, merge})});
                }
            }
        }

        draw (canvas, scale = 1) {
            let ctx = canvas.getContext('2d');

            ctx.save();
            ctx.translate(canvas.width / 2 - 0.5, canvas.height / 2 - 0.5);
            ctx.scale(scale, scale);

            this._vertices.forEach((vertex, i) => {
                let [vertex1, vertex2] = [
                    this._vertices[i],
                    this._vertices[i >= this._vertices.length - 1 ? 0 : i + 1]
                ];

                if (this._bg) { // 背景
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(...vertex1);
                    ctx.lineTo(...vertex2);
                    ctx.closePath();
                    ctx.fillStyle = this._bg[i];
                    ctx.fill();
                }

                if (this._axis) { // 轴线
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(...vertex1);
                    ctx.lineWidth = 0.5;
                    ctx.strokeStyle = this._axis[i];
                    ctx.stroke();
                }

                if (this._border) { // 边框
                    ctx.beginPath();
                    ctx.moveTo(...vertex1);
                    ctx.lineTo(...vertex2);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = this._border[i];
                    ctx.stroke();
                }

                if (this._label) { // 标签
                    let {
                        text,
                        size = 20,
                        color = '#000'
                    } = this._label[i] || {};
                    if (!text) return;

                    ctx.font = size + 'px "Microsoft YaHei Mono", Arial';
                    ctx.fillStyle = color;
                    let [t_w, t_h] = [ctx.measureText(text).width, size];
                    let margin = size / 3;
                    let [x, y] = [...vertex1];

                    switch (vertex1.quadrant) {
                        case 0:
                            [x, y] = [
                                Math.abs(x) < 10 ? x - t_w / 2 : x + margin,
                                y - margin
                            ];
                            break;
                        case 1:
                            [x, y] = [
                                x + margin,
                                Math.abs(y) < 10 ? y + t_h / 2 : y + margin + t_h
                            ];
                            break;
                        case 2:
                            [x, y] = [
                                Math.abs(x) < 10 ? x - t_w / 2 : x - margin - t_w,
                                y + margin + t_h
                            ];
                            break;
                        case 3:
                            [x, y] = [
                                x - margin - t_w,
                                Math.abs(y) < 10 ? y + t_h / 2 : y - margin
                            ];
                            break;
                    }
                    ctx.fillText(text, x, y);
                }
            });
            ctx.restore();
        }
    }

    return Polygon;

});



