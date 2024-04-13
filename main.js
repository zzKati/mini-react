import { createElement, render } from "./micro-react";

// const element = createElement(
//     'h1',
//     {
//         title: 'foo',
//         style: 'background:skyblue'
//     },
//     'Hello World',
//     createElement(
//         'div',
//         {
//             style: "color:red"
//         },
//         'test'
//     )
// )



// render(element, document.getElementById('app'))

const handleInput = (e) => {
    // console.log(1);
    renderer(e.target.value)
}

const renderer = (value) => {
    const element = createElement(
        'div',
        null,
        createElement(
            'input',
            { oninput: (e) => handleInput(e) },
            null
        ),
        createElement('h1', null, value)
    )
    render(element, document.getElementById('app'))
}

renderer('hello world!')