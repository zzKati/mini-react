function render(element, container) {
    // 创建 dom 节点
    const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type)

    // 解析props中除了children外的属性 并将属性赋值给dom
    Object.keys(element.props).filter(prop => prop !== 'children').forEach(key => {
        dom[key] = element.props[key]
    })

    // // 递归渲染children节点
    // element.props.children.forEach(child => {
    //     render(child, dom)
    // })
    /**
     * 上方的递归处理是不好的 在React中采用了一种名为 Fiber的新调度方法
     * 它会在合适的时刻渲染节点
     * 而不是递归渲染节点 因为递归是无法停止的
     * 此处的核心是requestIdleCallback()
     * 它会在浏览器空闲时执行回调函数
     * 但react官方不再使用这个API 转而使用scheduler package
     */

    container.appendChild(dom)
}

// 下次渲染工作 在render中初始化
let nextUnitOfWork = null

/**
 * // 调度工作函数
 * @param {*} deadLine 剩余可执行时间
 */
function workLoop(deadLine) {
    // 判断是否应该停止工作
    let shouldYield = false

    while (nextUnitOfWork && !shouldYield) {
        // 处理当前任务并获得下次任务
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

        // 检查是否还有时间 小于1ms停止
        shouldYield = deadLine.timeRemaining() < 1
    }

    // 等待浏览器下次空闲时调用
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

// 执行工作函数
function performUnitOfWork() {

}


export default render