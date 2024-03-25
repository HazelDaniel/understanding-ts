/// <reference path="shape.ts"/>

namespace _Drawable {
  export class Triangle implements Shape {
    public draw() {
      console.log("triangle is being drawn.");
    }
  }
}