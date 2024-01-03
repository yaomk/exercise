# 选择排序

## 原理

1. 在未排序的数据元素中选出最小的一个元素。
2. 将该元素放在序列的起始位置。
3. 再从剩余的未排序元素中寻找到最小元素。
4. 再将该元素放到已排序的序列的末尾。
5. 重复以上操作，直到待排序的元素个数为0。

## 图解

![选择排序图解](../assets/img/selectionSort.gif)

## js 代码实现

```javascript
const arr = [3,6,7,8,1,2,9,5,4]

function selectionSort(list = []) {
    list = [...list]
    for(let i = 0; i < list.length - 1; i++) {
        let minIdx = i
        for(let j = i + 1; j < list.length; j++) {
            if(list[minIdx] > list[j]) {
                // 保存待排序元素中最小值的索引
                minIdx = j
            }
        }
        if(minIdx === i) continue
        // 将待排序元素的最小值放到已排序的末尾
        [list[i], list[minIdx]] = [list[minIdx], list[i]]
    }
    return list
}
```
