import { createElement } from "./micro-react";

const testNode = createElement(
    'h1',
    {
        title: 'foo'
    },
    'aaa',
    createElement(
        'div',
        {},
        'hahaha'
    )
)

console.log(testNode);