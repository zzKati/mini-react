// 创建元素函数
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(item => typeof item === 'object' ? item : createTextElement(item))
        }
    }
}

// 如果元素的children类型为string 说明是文本
function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }

}



export default createElement