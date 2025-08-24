# 01背包 （0-1 Knapsack）

## 问题描述
在最多能背重量为 `j` 的背包中装入`i` 件物品（每件仅有重量和价值属性，且每个物品仅有一个），求解将哪些物品装入背包里物品价值总和最大，且装入物品的总重量不超过背包的承重重量。

### 问题思考（使用暴力解法，回溯搜索法）
* 每个物品只有两个状态，放入背包或者不放入背包
* 假设背包总承重重量为 `weight = 4`，物品重量数组为 `weights = [1,3,4]`，物品价值数组为 `values = [15,20,30]`
* 假设当前背包内已放入物品的总重量为 `currentWeight`，总价值为 `currentValue`
* 如果第一个物品不放入背包，那么此刻背包内总重量 `currentWight` 和 总价值 `currentValue` 为 `0`
* 如果第一个物品放入背包，且物品的重量不超过背包的总承重重量 `weight`，那么此时背包内总重量 `currentWight` 为 `currentWight = currentWight + weights[0]`，总价值 `currentValue` 为 `currentValue = currentValue + values[0]`
* 如果第二个物品不放入背包，那么此刻背包内总重量为 `currentWight` 和总价值为 `currentValue`
* 如果第二个物品放入背包，且物品的重量小于背包剩余的承重重量，那么此刻背包内总重量为 `currentWight + weight[1]` 和总价值为 `currentValue + value[1]`
* ...直到所有物品都已处理完成

### 暴力解法的代码实现
> 这种解法通过递归尝试所有可能的物品组合（选择或不选择每个物品），因此属于暴力搜索法。具体来说，这是深度优先搜索（DFS）的方式，因为它递归地探索每个分支直到尽头，然后回溯。在算法设计中，这种暴力搜索通常被称为“穷举搜索”或“回溯法”。时间复杂度是O(2^n)，其中n是物品数量。
```javascript
/**
 * 01背包问题
 * @param {number[]} weights 物品重量数组，物品的索引顺序与价值数组一致
 * @param {number[]} values 物品价值数组
 * @param {number} capacity 背包所能承重的重量
 * @return {number} - 最大价值
 */
function knapsackBacktracking(weights, values, capacity) {
  // 记录最大价值
  let maxValue = 0
  const len = weights.length

  /**
   * @param {number} currentWight - 当前背包的重量
   * @param {number} currentValue - 当前背包内价值
   * @param {number} index - 当前物品索引
   */
  function backtracking(currentWight, currentValue, index) {
    // 终止条件：所有物品都已处理
    if(index === len) {
      // 更新最大价值
      if(currentWight <= capacity && currentValue > maxValue) {
        maxValue = currentValue
      }
      return
    }

    // 情况1：选择当前物品不放入，那么继续下一个物品
    backtracking(currentWight, currentValue, index + 1)
    // 情况2：选择当前物品放入，且不超过背包的剩余容量
    if(currentWight + weights[index] <= capacity) {
      backtracking(currentWight + weights[index], currentValue + values[index], index + 1)
    }
  }
  // 从物品索引0开始回溯
  backtracking(0, 0, 0)
  return maxValue
}
// 测试用例
const weights = [1,3,4]
const values = [15,20,30]
const capacity = 4
console.log(knapsackBacktracking(weights, values, capacity)) // 输出35

```

### 暴力解法增加优化操作，减枝（Pruning）
> 在回溯过程中，如果当前价值 currentValue 加上剩余物品的最大可能价值（乐观估计）仍小于 maxValue，则可以提前终止搜索。
```diff
function knapsackBacktracking(weights, values, capacity) {
  // 记录最大价值
  let maxValue = 0
  const len = weights.length

+  // 计算剩余物品的最大可能价值（用于剪枝）
+  function getMaxPossibleValue(index, currentValue) {
+    let remainingValue = currentValue;
+    for (let i = index; i < len; i++) {
+      remainingValue += values[i]; // 乐观估计：假设剩余物品全选
+    }
+    return remainingValue;
+  }

  /**
   * @param {number} currentWight - 当前背包的重量
   * @param {number} currentValue - 当前背包内价值
   * @param {number} index - 当前物品索引
   */
  function backtracking(currentWight, currentValue, index) {
    // 终止条件：所有物品都已处理
    if(index === len) {
      // 更新最大价值
      if(currentWight <= capacity && currentValue > maxValue) {
        maxValue = currentValue
      }
      return
    }
+    // 剪枝：如果当前价值 + 剩余最大价值 <= maxValue，则跳过
+    if (getMaxPossibleValue(index, currentValue) <= maxValue) {
+      return;
+    }

    // 情况1：选择当前物品不放入，那么继续下一个物品
    backtracking(currentWight, currentValue, index + 1)
    // 情况2：选择当前物品放入，且不超过背包的剩余容量
    if(currentWight + weights[index] <= capacity) {
      backtracking(currentWight + weights[index], currentValue + values[index], index + 1)
    }
  }
  // 从物品索引0开始回溯
  backtracking(0, 0, 0)
  return maxValue
}
```

### 使用动态规划（Dynamic Programming）解法，构建二维DP表解决

#### 动态规划解题五部曲
1. 确定dp数组（dp table）以及下标的含义
2. 确定递推公式
3. dp数组如何初始化
4. 确定遍历顺序
5. 举例推导dp数组

#### 动态规划思考
* 定义 `dp` 数组。`dp[i][j]` 理解为：从下标为 `[0-i]` 的物品里任意取，放进容量为 `j` 的背包，价值总和最大是多少
* 如果不放物品 `i`，那么当前最大的价值为 `dp[i-1][j]`
* 如果放物品 `i`，则要考虑放进去之前的背包容量是否还能足够将 `i` 放进去
  - 那么放物品 `i` 之前的容量为 `j - weights[i]`，放物品 `i` 之后的容量为 `j`
  - 那么放进去物品 `i` 后的最大价值为 `dp[i-1][j-weights[i]] + values[i]`
* 确定是否要将 `i` 放入（因为要得到价值最大），则为 `dp[i][j] = Math.max(dp[i-1][j], dp[i-1][j-weights[i]] + values[i])`
* 初始化 `dp` 数组
  |  | 背包容量为0时 | 背包容量为1时 | 背包容量为2时 | 背包容量为3时 | 背包容量为4时 |
  | -- | --------- | ----------- | ----------- | ----------- | ----------- |
  | 物品0 | 0 | 15 | 15 | 15 | 15 |
  | 物品1 | 0 | 15 | 15 | 20 | 35 |
  | 物品2 | 0 | 15 | 15 | 20 | max(35, 0 + 30) |
* 遍历和初始化思考过程：先遍历物品，再遍历背包容量
  - 遍历到物品0
  - 当背包容量为0时，那么当前最大价值为 0
  - 当背包容量为1时，那么当前能放下物品0，那么当前最大价值为 15
  - 当背包容量为2时，因为此刻只能放得下物品0，那么当前最大价值为 15
  - 当背包容量为3时，因为此刻只有一个物品0，那么当前最大价值为 15
  - 当背包容量为4时，因为此刻只有一个物品0，那么当前最大价值为 15
  - 遍历到物品1
  - 当背包容量为0时，那么当前最大价值为 0
  - 当背包容量为1时，那么当前能放下物品0，那么当前最大价值为 15
  - 当背包容量为2时，因为此刻只能放得下物品0，那么当前最大价值为 15
  - 当背包容量为3时，物品0和物品1，只能放得下其中一个，所以选择放入物品价值最大的物品1，当前最大价值为 20
    - 可选放入物品0，当前最大价值为 15
    - 可选放入物品1，当前最大价值为 20
  - 当背包容量为4时，能够放下物品0和物品1，那么当前最大价值为 15 + 20 = 35
  - 遍历到物品2
  - 当背包容量为0时，那么当前最大价值为 0
  - 当背包容量为1时，那么当前能放下物品0，那么当前最大价值为 15
  - 当背包容量为2时，因为此刻只能放得下物品0，那么当前最大价值为 15
  - 当背包容量为3时，选择放入物品价值最大的物品1，当前最大价值为 20
  - 当背包容量为4时，选择放入物品4 or 物品0+物品1，得出最大价值为 35

#### 二维dp代码实现
```javascript
function knapsackDP(weights, values, capacity) {
  // 定义dp二维数组，并初始化
  const dp =  Array.from({length: weights.length}, () => new Array(capacity + 1).fill(0))
  // 初始化第一行
  for(let j = weights[0]; j <= capacity; j++) {
    dp[0][j] = values[0]
  }
  for (let i = 1; i < weights.length; i++) {
    for (let j = 0; j <= capacity; j++) {
      if(j < weights[i]) {
        dp[i][j] = dp[i - 1][j]
      } else {
        dp[i][j] = Math.max(
          dp[i - 1][j],
          dp[i - 1][j - weights[i]] + values[i]
        )
      }
    }
  }

  // 回溯找出放入背包的物品
  let w = capacity
  const selected = []
  // 逆序遍历物品，检查当前物品是否被选中。判断的条件是：如果dp[i][j]不等于dp[i-1][j]，则表示选择了第 i 个物品
  for (let i = weights.length - 1; i >= 0 && w > 0 ; i--) {
    // 如果 i = 0 并且 剩余重量 > 0，则说明已到dp数组的第一行，则需要将第一个物品加入
    if(i === 0) {
      selected.push(i)
      break
    }
    if (dp[i][w] !== dp[i - 1][w]) {
      // 记录被选中的物品，并减去相应的重量，继续回溯
      selected.push(i)
      w -= weights[i]
    }
  }
  console.log('放入背包的物品索引: ', selected.reverse())

  // 返回背包中物品的总价值
  return dp[weights.length - 1][capacity]
}
// 测试用例
const weights = [1,3,4]
const values = [15,20,30]
const capacity = 4
console.log(knapsackDP(weights, values, capacity)) // 输出35
```

#### 一维dp思考
* 在二维dp数组实现中，`dp[i][j]` 表示从下标为 `[0-i]` 的物品里任意取，放进容量为 `j` 的背包，价值总和最大是多少。递推公式为：`dp[i][j] = Math.max(dp[i-1][j], dp[i-1][j-weights[i]] + values[i])`，可以得知在每层中，当前层的`dp[i][j]`都是由上层的 `dp[i-1][j]` 或 `dp[i-1][j-weights[i]]+values[i]` 推导出来的，如果把上一层的数据完全复制到本层，那么递推公式就可以写作为：`dp[i][j] = Math.max(dp[i][j], dp[i][j-weights[i]] + values[i])`
* 那么就可以使用一个一维数组来实现（也可以理解是一个滚动数组）
  - 使用滚动数组需要满足的条件是上一层可以重复利用，直接拷贝到当前层
* 一维dp数组，去掉 `i` 这个维度就好，表示容量为 `j` 的背包所背的最大价值是多少。递推公式就可以写为：`dp[j] = Math.max(dp[j], dp[j-weights[i]] + values[i])`
* 初始化dp数组，由于要取价值最大的数，并且物品的价值都是正数，所以初始化dp数组内都为0，防止被初始值覆盖。
* 遍历顺序思考
  - 遍历背包时，应该使用倒序遍历，避免出现物品重复计算的情况，如：用物品0去遍历背包，`dp[1] = max(0, dp[1 - 1] + 15)`;`dp[2] = max(0, dp[2 - 1] + 15)`，导致物品0重复放入背包。
  - 遍历物品0
  - dp[4] = max(0, dp[4 - 1] + 15)
  - dp[3] = max(0, dp[3 - 1] + 15)
  - dp[2] = max(0, dp[2 - 1] + 15)
  - dp[1] = max(0, dp[1 - 1] + 15)
  - 遍历物品1
  - dp[4] = max(15, dp[4 - 3] + 20)
  - dp[3] = max(15, dp[3 - 3] + 20)
  - dp[2]已放不下物品1
  - 遍历物品2
  - dp[4] = max(35, dp[4 - 4] + 30)

#### 一维dp代码实现
```javascript
function knapsackDP(weights, values, capacity) {
  // 定义dp一维数组，元素并初始化为0
  const dp = new Array(capacity + 1).fill(0)

  // 遍历物品
  for(let i = 0; i < weights.length; i++) {
    // 倒序遍历背包容量，同时确保物品的重量不会超过当前的背包容量
    for(let j = capacity; j >= weights[i]; j--) {
      // 考虑当前物品选择放入与不放入的情况，选择价值最大值
      dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i])
    }
  }

  return dp[capacity]
}
```