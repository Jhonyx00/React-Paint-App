//interfaces
import { IconTool } from "../interfaces/IconTool";
//Images
import oval from "../assets/oval.svg";
import star from "../assets/star.svg";
import pencil from "../assets/pencil.svg";
import eraser from "../assets/eraser.svg";
import rhombus from "../assets/rhombus.svg";
import hexagon from "../assets/hexagon.svg";
import triangle from "../assets/triangle.svg";
import pentagon from "../assets/pentagon.svg";
import rectangle from "../assets/rectangle.svg";
import select from "../assets/select.svg";
import LassoSelect from "../assets/free-form-select.svg";

//arrays
export const shapes = [
  { name: "Rectangle", path: "M0 0, L0 150, L300 150, L300 0 Z" },
  { name: "Ellipse", path: "M0 75 A150 75 0 1 0 300 75 A150 75 0 1 0 0 75" },
  {
    name: "Hexagon",
    path: "M75 0, L0 75, L75 150, L225 150, L300 75, L225 0 Z",
  },
  { name: "Triangle", path: "M150 0, L0 150, L300 150 Z" },
  { name: "Pentagon", path: "M150 0, L0 57, L54 150, L246 150, L300 57 Z" },
  {
    name: "Star",
    path: "M150 0, L189 57, L300 57, L207 88.5, L246 150, L150 112.5, L54 150, L93 88.5, L0 57, L111 57, Z",
  },
  {
    name: "Rhombus",
    path: "M150 0, L0 75, L150,150 L300,75 Z",
  },
];

export const resizeButtons = [
  { id: 1, class: "btn1" },
  { id: 2, class: "btn2" },
  { id: 3, class: "btn3" },
  { id: 4, class: "btn4" },
  { id: 5, class: "btn5" },
  { id: 6, class: "btn6" },
  { id: 7, class: "btn7" },
  { id: 8, class: "btn8" },
];

export const colors = [
  { id: 1, color: "#ece6d0" },
  { id: 2, color: "#df9d81" },
  { id: 3, color: "#d7e235" },
  { id: 4, color: "#c5b82b" },
  { id: 5, color: "#f7512b" },
  { id: 6, color: "#008a93" },
  { id: 7, color: "#7b4b59" },
  { id: 8, color: "#b7ce5a" },
  { id: 9, color: "#5f89ca" },
  { id: 10, color: "#b070db" },
  { id: 11, color: "#3b4d1b" },
  { id: 12, color: "#ccdaf0" },
  { id: 13, color: "#ffcac0" },
  { id: 14, color: "#cdeaf0" },
  { id: 15, color: "#abdaf4" },
];

export const toolsItems: IconTool[] = [
  {
    toolGroupID: 3,
    toolId: 1,
    name: "Line",
    icon: pencil,
  },
  {
    toolGroupID: 4,
    toolId: 2,
    name: "Eraser",
    icon: eraser,
  },
  {
    toolGroupID: 5,
    toolId: 3,
    name: "IrregularShape",
    icon: rectangle,
  },
  {
    toolGroupID: 4,
    toolId: 4,
    name: "Eraser 2",
    icon: oval,
  },
];

export const shapeItems: IconTool[] = [
  {
    toolGroupID: 1,
    toolId: 1,
    name: "Rectangle",
    icon: rectangle,
  },
  {
    toolGroupID: 1,
    toolId: 2,
    name: "Ellipse",
    icon: oval,
  },
  {
    toolGroupID: 1,
    toolId: 3,
    name: "Hexagon",
    icon: hexagon,
  },
  {
    toolGroupID: 1,
    toolId: 4,
    name: "Triangle",
    icon: triangle,
  },
  {
    toolGroupID: 1,
    toolId: 5,
    name: "Pentagon",
    icon: pentagon,
  },
  {
    toolGroupID: 1,
    toolId: 6,
    name: "Star",
    icon: star,
  },

  {
    toolGroupID: 1,
    toolId: 7,
    name: "Rhombus",
    icon: rhombus,
  },
];

export const selectItems: IconTool[] = [
  {
    toolGroupID: 2,
    toolId: 1,
    name: "Select",
    icon: select,
  },
  {
    toolGroupID: 10,
    toolId: 2,
    name: "Lasso",
    icon: LassoSelect,
  },
];
