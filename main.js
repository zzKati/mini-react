import { createElement, render } from "./micro-react";

const element = createElement(
    'h1',
    {
        title: 'foo',
        style: 'background:skyblue'
    },
    'Hello World',
    createElement(
        'div',
        {
            style: "color:red"
        },
        'test'
    )
)



render(element, document.getElementById('app'))