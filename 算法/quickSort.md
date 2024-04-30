# 快速排序

## 原理

- 快速排序采用的是分治思想
- 即在一个无序的序列中选取一个任意的基准元素 pivot
- 利用 pivot 将待排序的序列分成两部分
- 将所有比基准值小的放在基准值左边，比基准值大的放在基准值右边
- 然后采用递归的方法分别对前后两部分重复上述操作，直到将无序序列排列成有序序列

<table>
  <capital>快速排序</capital>
  <thead>
    <tr>
      <th colspan="3">时间复杂度</th>
      <th>空间复杂度</th>
      <th>稳定性</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">最好</td>
      <td align="center">平均</td>
      <td align="center">最坏</td>
      <td align="center">辅助存储</td>
      <td></td>
    </tr>
    <tr>
      <td>O(N*log₂N)</td>
      <td>O(N*log₂N)</td>
      <td>O(N²)</td>
      <td>O(log₂N) ~ O(N)</td>
      <td>不稳定</td>
    </tr>
  </tbody>
</table>

## 图解

![快速排序图解](../assets/img/quickSort.gif)

## js 代码实现

```javascript
// 左右指针交换法
function quickSort(arr, left, right) {
  left = typeof left === 'number' ? left : 0
  right = typeof right === 'number' ? right : arr.length - 1
  // 当左右指针索引相减<=0，此时无需再排序
  if (right - left <= 0) return
  // 定义基准值
  const pivot = arr[left]
  // 定义左右指针
  let l = left
  let r = right
  while (l < r) {
    // 如果右侧指针指向的数小于基准值，则停止循环，否则继续向左移动一位
    while (l < r && arr[r] > pivot) r--
    // 如果左侧指针指向的数大于基准值，则停止循环，否则继续向右移动一位
    // 注意，左右指针遍历条件中至少有一个写=，否则会陷入死循环
    while (l < r && arr[l] <= pivot)
      l++
      // 当上面两个循环停止，此时交换满足左指针指向的元素大于基准值，右指针指向的元素小于基准值，则将左右元素交换
    ;[arr[l], arr[r]] = [arr[r], arr[l]]
  }
  // 整体遍历结束后，说明 left=right，这时候左右指针相遇，则相遇的位置即为基准值应该被排好序的位置，这时候将基准值与相遇位置的元素进行交换
  if (left !== l) {
    ;[arr[left], arr[l]] = [arr[l], arr[left]]
  }
  // 递归左右两侧
  quickSort(arr, left, l - 1)
  quickSort(arr, l + 1, right)
  return arr
}
```

```javascript
// 定义两个左右数组，最容易理解，空间复杂度高
function quickSort(arr) {
  if (arr.length <= 1) return arr
  const pivot = arr[0]
  const left = []
  const right = []
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(pivot, quickSort(right))
}
```
