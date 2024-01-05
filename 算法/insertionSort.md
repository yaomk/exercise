# 插入排序

## 原理

1. 在待排序的数据元素中将第一个元素看作有序序列，第二个及以后的元素当作未排序序列。
2. 在未排序的序列中取出第一个元素（值记为current），依次与有序序列比较大小（从有序序列的末尾开始）。
3. 将 current 插入有序序列的适当位置（如果 current < 某个有序数列的元素，则将有序数列的值依次“右移”）。
4. 重复以上操作，直到排序完成。

```javascript
const list = [3,2,1]
// 3作为有序序列，2、1作为待排序序列（第一次外循环）
// 内循环
[3,3,1]
// 内层循环终止
[2,3,1]
// 2、3有序序列，1待排序序列（第二次外循环）
// 内循环
[2,3,3]
[2,2,3]
// 内层循环终止
[1,2,3]
```


## 图解

![选择排序图解](../assets/img/insertionSort.gif)

## js 代码实现

```javascript
const arr = [3,6,7,8,1,2,9,5,4]

function insertionSort(list = []) {
    list = [...list]
    const len = list.length
    for(let i = 1; i < len; i++) {
        const current = list[i] // 从待排序序列中选中要插入的值
        let preIdx = i - 1; // 有序序列的最后一个值的索引
        // 从已经有序序列最右边的开始比较
        while(preIdx >= 0 && current < list[preIdx]) {
            list[preIdx + 1] = list[preIdx]
            preIdx--
        }
        preIdx + 1 !== i && (list[preIdx + 1] = current)
    }
    return list
}
```
