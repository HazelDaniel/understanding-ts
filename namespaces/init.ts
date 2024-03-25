/// <reference path="circle.ts"/>
/// <reference path="triangle.ts"/>
/// <reference path="shape.ts"/>


function drawShapes(...shapes: _Drawable.Shape[]) {
  shapes.forEach((shape) => {
    shape.draw();
  });
}

const circle = new _Drawable.Circle();
const triangle = new _Drawable.Triangle();
drawShapes(circle, triangle);