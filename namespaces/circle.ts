/// <reference path="shape.ts"/>
namespace _Drawable {
  export class Circle implements Shape {
    public draw() {
      console.log("circle is being drawn");
    }
  }
}