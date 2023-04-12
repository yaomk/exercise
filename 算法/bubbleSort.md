# 冒泡排序

## 原理

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素做同样的工作，从开始第一对到结尾的最后一对。在这一点，最后的元素应该会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

## 图解

![冒泡排序图解](../assets/img/bubblesort.gif)

## js 代码实现

```javascript
const arr = [3,6,7,8,1,2,9,5,4]

function bubbleSort(list = []) {
    list = [...list]
    let length = list.length
    while(length > 1) {
        for(let j = 0; j < length - 1; j++) {
            if(list[j] > list[j + 1]) {
                [list[j], list[j + 1]] = [list[j + 1], list[j]]
            }
        }
        length--
    }
    return list
}
```

## 可优化地方

* 外层循环优化

   - 如 `[3,2,4,6]`，外层循环在第一次循环后已经排序完成，在第二次循环中未进行交换，直接退出循环。

```javascript
const arr = [3,6,7,8,1,2,9,5,4]

function bubbleSort(list = []) {
    list = [...list]
    let length = list.length
    while(length > 1) {
        // 增加 flag 控制，如果没有进行交换，则说明已经从小到大排序完成，可以直接退出循环。
        let flag = false
        for(let j = 0; j < length - 1; j++) {
            if(list[j] > list[j + 1]) {
                [list[j], list[j + 1]] = [list[j + 1], list[j]]
                flag = true
            }
        }
        if(!flag) break
        length--
    }
    return list
}
```

* 外层 + 内层循环优化

   - 记录内层循环最后一次排序后的索引，表明从该索引后的排序已完成，不用在进行循环遍历。
   - `[1,2,4,3,5]`（不太好的列子），第一次外层循环，内层循环执行 **4** 次， 记录标识索引 **2**；进入第二次外层循环，内层循环只需执行 **2** 次。

```javascript
const arr = [3,6,7,8,1,2,9,5,4]

function bubbleSort(list = []) {
    list = [...list]
    let length = list.length
    // 内层循环最后遍历的索引值
    let lastIdx = length - 1
    while(length > 1) {
        // 记录结束标识索引
        let flagIdx = lastIdx
        for(let j = 0; j < lastIdx; j++) {
            if(list[j] > list[j + 1]) {
                [list[j], list[j + 1]] = [list[j + 1], list[j]]
                // 发生交换后，将当前索引赋值标识索引
                flagIdx = j
            }
        }
        if(lastIdx === flagIdx) {
            break
        } else {
            lastIdx = flagIdx
        }
        length--
    }
    return list
}
```