function getType(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s([a-zA-Z]+)\]/, '$1')
}

function handleTask(promiseTask, respList) {
    if (promiseTask.children) {
        // 如果有 children 任务，处理完 task 后，再处理 children
        return promiseTask.task().then((resp) => {
            respList.push(resp)
            // 过滤掉为空的 children item
            promiseTask.children = promiseTask.children.filter(item => !!item)
            // children 并行递归处理
            return Promise.all(
                promiseTask.children.map(item => handleTask(item, respList))
            )
        })
    } else {
        // 没有 children 任务，处理完 task 直接返回
        return promiseTask.task().then(resp => {
            respList.push(resp)
        })
    }
}

function handlePromiseList(list) {
    // 响应集合
    const respList = [];
    // 排除掉 null
    const validList = list.filter(item => item != null);
    // 执行 task，返回 promise list
    const handledList = validList.map((item) => handleTask(item, respList));
    // promise 全部执行完毕后，返回响应集合
    return Promise.all(handledList).then(() => {
        return respList;
    });
}

// demo

// let taskList = [
//     {
//         task: function() {
//             return new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                     console.log(1111)
//                     resolve()
//                 }, 1000)
//             })
//         },
//         children: [
//             {
//                 task: function() {
//                     return new Promise((resolve, reject) => {
//                         setTimeout(() => {
//                             console.log(1112)
//                             resolve()
//                         }, 1000)
//                     })
//                 },
//                 children: [
//                     {
//                         task: function() {
//                             return new Promise((resolve, reject) => {
//                                 setTimeout(() => {
//                                     console.log(1122)
//                                     resolve()
//                                 }, 1000)
//                             })
//                         } 
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         task: function() {
//             return new Promise((resolve, reject) => {
//                 setTimeout(() => {
//                     console.log(2222)
//                     resolve()
//                 }, 2000)
//             })
//         }
//     }
// ]

// handlePromiseList(taskList).then(resp => {
//     console.log(resp)
//     console.log('complete')
// })

module.exports.getType = getType
module.exports.handlePromiseList = handlePromiseList