<script setup>
import { useRankStore } from '@/stores/rank'
import { storeToRefs } from 'pinia'
import rankImg from '@/assets/images/rank.png'
import firstImg from '@/assets/images/first.png'
import secondImg from '@/assets/images/second.png'
import thridImg from '@/assets/images/thrid.png'

const { rank } = storeToRefs(useRankStore())
const code = ref('')
const showKeyboard = ref(false)
const isShrink = ref(true)

const title = ref('查查你的手机尾号值多少？')

/* 账号属性 */
// 长度
const len = ref({
  score: 0,
  text: 0,
  rule: [
    {
      score: 100000,
      val: [1, 2, 3, 4, 5]
    },
    {
      score: 10000,
      val: [6]
    },
    {
      score: 1000,
      val: [7]
    },
    {
      score: 500,
      val: [8]
    },
    {
      score: 100,
      val: [9]
    },
    {
      score: 0,
      val: [10, 11, 12]
    }
  ]
})
// 规律性
// 重复数字
const same = ref({
  score: 0,
  text: '',
  rule: {
    2: 500,
    3: 5000,
    4: 10000
  }
})
// 递增数字
const sequent = ref({
  score: 0,
  text: '',
  rule: {
    2: 500,
    3: 5000,
    4: 10000
  }
})
// 对称数字
const symmetric = ref({
  score: 0,
  text: '',
  rule: {
    2: 500,
    3: 1000,
    4: 5000
  }
})
// 特殊字符
const special = ref({
  score: 0,
  text: ''
})

const level = ref([
  {
    range: [0, 500],
    text: '一般'
  },
  {
    range: [500, 2000],
    text: '普通'
  },
  {
    range: [2000, 5000],
    text: '珍贵'
  },
  {
    range: [5000, 10000],
    text: '稀有'
  },
  {
    range: [10000, 100000],
    text: '绝世'
  }
])

const sumScore = ref(0)
const sumList = ref([])

// 计算分数等级
const getLevel = (score) => {
  for (let i in level.value) {
    if (score >= level.value[i].range[0] && score <= level.value[i].range[1]) {
      return level.value[i].text
    }
  }
}

// 计算qq号得分
const scoreCode = () => {
  if (!code.value) return
  // LenScore(code.value)
  SpecialScore(code.value)
  RegScore(code.value)

  // 得分数组
  const list = [
    len.value,
    same.value,
    sequent.value,
    symmetric.value,
    special.value
  ]
  sumList.value = list.map((item) => ({
    score: item.score,
    text: item.text
  }))
  // sumlist参照score从大到小排序
  sumList.value.sort((a, b) => b.score - a.score)
  // 总分
  sumScore.value = list.reduce((pre, cur) => pre + cur.score, 0)

  // 加入排名
  rank.value.push({
    qq: code.value,
    score: sumScore.value
  })
  rank.value.sort((a, b) => b.score - a.score)
}

//计算qq号长度得分
const LenScore = (qq) => {
  const qqStr = qq.toString()
  len.value.rule.forEach((i) => {
    if (i.val.includes(qqStr.length)) {
      len.value.score = i.score
      len.value.text = `账号长度为 <span class="blue"> ${qqStr.length} </span>`
    }
  })
}
// 计算账号规律性
const RegScore = (qq) => {
  const qqStr = qq.toString()
  // 连续且相同
  const sameNum = longestSameDigitSequence(qqStr)
  // 相同且递增
  const sequentNum = longestSequentialString(qqStr)
  // 对称结构、
  const symmetricNum = longestSymmetricSubstring(qqStr)

  same.value.score = same.value.rule[sameNum.length] || 0
  same.value.text = `最长重复数为 <span class="blue"> ${sameNum} </span>`
  sequent.value.score = sequent.value.rule[sequentNum.length] || 0
  sequent.value.text = `最长顺子数为 <span class="blue"> ${sequentNum} </span>`
  symmetric.value.score = symmetric.value.rule[symmetricNum.length] || 0
  symmetric.value.text = `最长对称数为 <span class="blue"> ${symmetricNum} </span>`
}
// 计算特殊数字得分
const SpecialScore = (qq) => {
  const qqStr = qq.toString()
  const Num9 = Array.from(qqStr).reduce((count, currentChar) => {
    return currentChar === '9' ? count + 1 : count
  }, 0)
  const Num8 = Array.from(qqStr).reduce((count, currentChar) => {
    return currentChar === '8' ? count + 1 : count
  }, 0)
  const Num6 = Array.from(qqStr).reduce((count, currentChar) => {
    return currentChar === '7' ? count + 1 : count
  }, 0)

  special.value.score = 99 ** Num9 + 88 ** Num8 + 66 ** Num6
  special.value.text = `高分数字为 <span class="blue">6, 8, 9</span>`
}

// 最长的连续相同数字
function longestSameDigitSequence(qqNumber) {
  let maxLength = 0
  let longestSequence = ''
  let currentLength = 1
  let currentSequence = ''

  for (let i = 1; i < qqNumber.length; i++) {
    if (qqNumber[i] === qqNumber[i - 1]) {
      currentLength++
      currentSequence =
        currentSequence == ''
          ? qqNumber[i - 1] + qqNumber[i]
          : currentSequence + qqNumber[i]
    } else {
      if (currentLength > maxLength) {
        maxLength = currentLength
        longestSequence = currentSequence
      }
      currentLength = 1
      currentSequence = ''
    }
  }

  // 检查最后一个数字序列是否是最长的
  if (currentLength > maxLength) {
    maxLength = currentLength
    longestSequence = currentSequence
  }

  return longestSequence
}

// 最长的连续递增数字
function longestSequentialString(qqNumber) {
  let maxLength = 0
  let longestSequence = ''
  let currentLength = 1
  let currentSequence = ''

  for (let i = 1; i < qqNumber.length; i++) {
    const prevNum = parseInt(qqNumber[i - 1], 10)
    const currNum = parseInt(qqNumber[i], 10)

    if (currNum === prevNum + 1 && currNum <= 9) {
      currentLength++
      currentSequence =
        currentSequence == ''
          ? qqNumber[i - 1] + qqNumber[i]
          : currentSequence + qqNumber[i]
    } else {
      if (currentLength > maxLength) {
        maxLength = currentLength
        longestSequence = currentSequence
      }
      // 当遇到数字不连续递增或达到9后，重置计数和序列
      currentLength = 1
      currentSequence = qqNumber[i]
    }
  }

  // 确保返回最长序列
  if (currentLength > maxLength) {
    maxLength = currentLength
    longestSequence = currentSequence
  }

  return longestSequence
}
// 对称结构
function longestSymmetricSubstring(qqStr) {
  let maxLength = 0
  let longestSubstring = ''

  for (let i = 0; i < qqStr.length; i++) {
    for (let j = i + 1; j < qqStr.length; j++) {
      const subStr = qqStr.slice(i, j + 1)
      if (subStr === subStr.split('').reverse().join('')) {
        if (subStr.length > maxLength) {
          maxLength = subStr.length
          longestSubstring = subStr
        }
      }
    }
  }

  return longestSubstring
}

const handleClick = () => {
  scoreCode()
  isShrink.value = false
}

const handleReset = () => {
  code.value = ''
  sumScore.value = 0
  sumList.value = []
}

const handleResetRank = () => {
  rank.value = []
}
</script>

<template>
  <div class="page">
    <div class="title">{{ title }}</div>
    <div class="formRow">
      <div class="label">手j尾号</div>
      <van-password-input
        :value="code"
        :mask="false"
        length="4"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
        class="code"
      />
      <van-button type="primary" @click="handleClick">查询</van-button>
      <van-button @click="handleReset">重置</van-button>
    </div>
    <div class="table">
      <van-row>
        <div class="total">
          ¥

          <van-rolling-text
            class="score-rolling"
            :start-num="0"
            :target-num="sumScore"
            stop-order="rtl"
            :height="40"
          />
        </div>
      </van-row>
    </div>

    <div class="rank">
      <van-row>
        <div class="total">
          当日排行榜
          <img class="rank-img" :src="rankImg" />

          <van-icon name="replay" class="replay-btn" @click="handleResetRank" />
        </div>
      </van-row>
      <van-row v-for="(item, index) in rank" :key="index" class="rank-row">
        <van-col class="index" span="4">
          <div v-if="[1, 2, 3].includes(index + 1)">
            <img
              v-if="index === 0"
              class="img-1"
              :src="firstImg"
              style="transform: rotateY(180deg) translateX(12px)"
            />
            <img
              v-if="index === 1"
              class="img-2"
              :src="secondImg"
              style="transform: rotateY(180deg) translateX(8px)"
            />
            <img
              v-if="index === 2"
              class="img-3"
              :src="thridImg"
              style="transform: rotateY(180deg) translateX(4px)"
            />
          </div>
          <span v-else>{{ index + 1 }}</span>
        </van-col>
        <van-col class="label" span="8">
          <div v-html="item.qq"></div>
        </van-col>
        <van-col class="value" span="8">{{ item.score }}</van-col>
        <van-col class="level" span="4">{{ getLevel(item.score) }}</van-col>
      </van-row>
    </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      v-model="code"
      :show="showKeyboard"
      @blur="showKeyboard = false"
    />
  </div>
</template>

<style scoped lang="less">
.page {
  --van-cell-value-font-size: 30px;

  overflow-y: auto;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  height: 100vh;
  font-size: 20px;
  // background: url('/src/assets/images/phoneBg.jpg') no-repeat right 20% top 0;
  background-color: @yellow;

  .title {
    font-size: 26px;
    text-align: center;
    font-weight: 600;
  }
}

.formRow {
  --van-password-input-height: 40px;
  --van-button-default-height: 40px;
  --van-password-input-margin: 0 20px 0;

  z-index: 1;
  display: flex;
  align-items: center;
  margin: 20px 16px 0;

  .label {
    font-size: 18px;
    font-weight: 600;
  }

  .code {
    flex: 1;
  }
}

.table {
  display: flex;
  padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
  margin: var(--van-cell-group-inset-padding);
  margin-top: 20px;
  text-align: center;
  background-color: #fff;
  border-radius: var(--van-cell-group-inset-radius);
  flex-direction: column;
  gap: 10px;

  .total {
    width: 100%;
    font-size: 30px;
    font-family: @ShuHei;
    line-height: 60px;

    .score-rolling {
      --van-rolling-text-color: @red;
      --van-rolling-text-font-size: 40px;
      --van-rolling-text-gap: 6px;
      --van-rolling-text-item-width: 24px;
    }
  }

  .label {
    font-size: 18px;
    line-height: 30px;
    text-align: left;
  }

  .value {
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
    color: @red;
  }

  .table-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
    transition: height 0.3s ease;

    .avatar {
      margin: 0 auto;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .name {
      display: flex;
      justify-content: center;
      align-items: center;

      .level {
        padding: 2px 4px;
        margin-left: 4px;
        font-size: 10px;
        color: #fff;
        background: @blue;
        border-radius: 4px;
      }

      .svip {
        .level;

        background: @yellow;
      }

      .vip {
        .level;

        background: @red;
      }
    }
  }

  .table-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: var(--van-cell-vertical-padding);
    width: 100%;
    font-size: 14px;
    gap: 4px;
    border-top: 1px solid #f5f5f5;
  }
}

.rank {
  img {
    width: 22px;
    height: 22px;
    object-fit: cover;
  }
  .table;

  .total {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    text-align: center;
    line-height: 38px;
    gap: 10px;
  }

  gap: 4px;
  position: relative;

  .replay-btn {
    position: absolute;
    right: 20px;

    &:active,
    &:focus {
      background: #f7f7f7;
    }
  }

  .index {
    font-size: 18px;
    font-family: @ShuHei;
    text-align: center;
    line-height: 30px;
    font-weight: bold;

    // img {
    //   transform: rotateY(180deg) translateX(8px);
    // }
  }

  .img-1 {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }

  .img-2 {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .img-3 {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  .rank-row {
    align-items: center;
    height: 40px;
  }
}
</style>
