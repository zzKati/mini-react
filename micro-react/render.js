function createDOM(fiber) {
    // 创建 dom 节点
    const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)

    // 解析props中除了children外的属性 并将属性赋值给dom
    Object.keys(fiber.props).filter(prop => prop !== 'children').forEach(key => {
        dom[key] = fiber.props[key]
    })

    return dom
}

// commit阶段 渲染界面
function commitRoot() {
    commitWork(wipRoot.child)
}

function commitWork(fiber) {
    if (!fiber) return

    const parentDOM = fiber.parent.dom
    parentDOM.appendChild(fiber.dom)

    // 以下操作二选一 
    commitWork(fiber.child)
    commitWork(fiber.sibling)

}

// 初始化第一个fiber并调用工作
function render(element, container) {

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

    // 将containe作为Fibers Tree的根(root)
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        },
        parent: null,
        sibling: null,
        child: null
    }
    // 浏览器即将开始workLoop
    nextUnitOfWork = wipRoot
}

// 根节点
let wipRoot = null

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

    // 如果没有下次渲染任务并且存在root 表示已经渲染完毕
    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }
}

requestIdleCallback(workLoop)

// 执行工作函数
function performUnitOfWork(fiber) {

    // 创建fiber的dom节点
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }

    // 将fiber添加到其父元素中
    // if (fiber.parent) {
    //     fiber.parent.dom.appendChild(fiber.dom)
    // }
    /**
     * 由于performUnitOfWork是会被打断的
     * 为了确保界面一次性画完 就不能使用以上的方式来添加dom节点
     */

    let prevFiber = null

    // 为children创建fiber
    const children = fiber.props.children
    for (let i = 0; i < children.length; i++) {
        const newFiber = {
            dom: null,
            type: children[i].type,
            props: children[i].props,
            child: null,
            parent: fiber,
            sibling: null
        }

        if (i === 0) {
            // 如果是第一个孩子 则为children
            fiber.child = newFiber
        } else {
            // 如果不是 只能为兄弟
            prevFiber.sibling = newFiber
        }
        prevFiber = newFiber
    }

    // 优先返回 children
    if (fiber.child) {
        return fiber.child
    }

    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            // 有兄弟返回兄弟
            return nextFiber.sibling
        }
        // 没有兄弟返回父母 
        nextFiber = nextFiber.parent
    }
}


export default render