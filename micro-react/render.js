function render(element, container) {
    // 创建 dom 节点
    const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type)

    // 解析props中除了children外的属性 并将属性赋值给dom
    Object.keys(element.props).filter(prop => prop !== 'children').forEach(key => {
        dom[key] = element.props[key]
    })

    // 递归渲染children节点
    element.props.children.forEach(child => {
        render(child, dom)
    })

    container.appendChild(dom)
}


export default render