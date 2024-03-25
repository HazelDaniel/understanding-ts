/// <reference path="circle.ts"/>
/// <reference path="triangle.ts"/>
/// <reference path="shape.ts"/>

namespace _Drawable {
  function drawShapes(...shapes: Shape[]) {
    shapes.forEach((shape) => {
      shape.draw();
    });
  }
  
  const circle = new Circle();
  const triangle = new Triangle();
  drawShapes(circle, triangle);
}
