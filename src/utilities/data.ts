//interfaces

//Images
import pencil from "../assets/pencil.svg";
import eraser from "../assets/eraser.svg";
import select from "../assets/select.svg";
import LassoSelect from "../assets/free-form-select.svg";
import { ToolIcon } from "../interfaces/ToolIcon";

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
  { id: 1, color: "#577399" },
  { id: 2, color: "#efe8d3" },
  { id: 3, color: "#e2bf46" },
  { id: 4, color: "#a867f1" },
  { id: 5, color: "#cbe5a6" },
  { id: 6, color: "#67c6aa" },
  { id: 7, color: "#b35056" },
  { id: 8, color: "#45afd7" },
  { id: 9, color: "#b0008d" },
  { id: 10, color: "#70995e" },
  { id: 11, color: "#97a8ff" },
  { id: 13, color: "#f1b9b1" },
];

export const toolItems: ToolIcon[] = [
  {
    groupId: 3,
    id: 1,
    name: "Line",
    url: pencil,
  },
  {
    groupId: 4,
    id: 2,
    name: "Eraser",
    url: eraser,
  },
  {
    groupId: 5,
    id: 3,
    name: "IrregularShape",
    svg: {
      tagname: "path",
      attributes: {
        d: "M21.3, -31.1C25.9, -26.1,26.5,-17.5,29,-9.5C31.6,-1.5,36.1,5.8,35.1,12.2C34.1,18.5,27.6,23.8,20.9,29.9C14.1,36,7,43,1.1,41.4C-4.8,39.8,-9.6,29.8,-16.4,23.7C-23.2,17.6,-32,15.4,-37.5,9.6C-43,3.8,-45,-5.8,-40.4,-11C-35.8,-16.3,-24.6,-17.3,-16.7,-21.2C-8.8,-25.1,-4.4,-31.9,2,-34.6C8.4,-37.3,16.8,-36,21.3,-31.1Z",
        transform: "translate(50 50), scale(1.2), rotate(60)",
      },
    },
  },
  {
    groupId: 6,
    id: 4,
    name: "Text",
    svg: {
      tagname: "text",
      attributes: {
        x: "10",
        y: "90",
        fontFamily: "arial",
        fontSize: "110",
        content: "A",
        fontWeight: "600",
      },
    },
  },
];

export const selectItems: ToolIcon[] = [
  {
    groupId: 2,
    id: 1,
    name: "Select",
    url: select,
  },
  {
    groupId: 10,
    id: 2,
    name: "Lasso",
    url: LassoSelect,
  },
];

export const iconShapes: ToolIcon[] = [
  {
    groupId: 1,
    id: 1,
    name: "Rectangle",
    svg: {
      tagname: "polygon",
      attributes: { points: "0 0, 100 0, 100 100, 0 100" },
    },
  },

  {
    groupId: 1,
    id: 2,
    name: "Ellipse",
    svg: {
      tagname: "ellipse",
      attributes: { cx: "50", cy: "50", rx: "50", ry: "40" },
    },
  },
  {
    groupId: 1,
    id: 3,
    name: "Hexagon",
    svg: {
      tagname: "polygon",
      attributes: { points: "25,0 75,0 100,50 75,100 25,100 0,50" },
    },
  },

  {
    groupId: 1,
    id: 4,
    name: "Triangle",
    svg: {
      tagname: "polygon",
      attributes: { points: "50,0 0,100 100,100" },
    },
  },

  {
    groupId: 1,
    id: 5,
    name: "Pentagon",
    svg: {
      tagname: "polygon",
      attributes: { points: "50,0 0,38 18,100 82,100 100,38" },
    },
  },

  {
    groupId: 1,
    id: 6,
    name: "Star",
    svg: {
      tagname: "polygon",
      attributes: {
        points:
          "50 0, 63 38, 100 38, 69 59, 82 100, 50 75, 18 100, 31 59, 0 38, 37 38",
      },
    },
  },

  {
    groupId: 1,
    id: 7,
    name: "Rhombus",
    svg: {
      tagname: "polygon",
      attributes: { points: "50,0 0,50 50,100 100,50" },
    },
  },
];
