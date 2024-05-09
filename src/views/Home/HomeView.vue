<script setup>
import { getQQMsg } from '@a'
import { useRankStore } from '@/stores/rank'
import { storeToRefs } from 'pinia'
import rankImg from '@/assets/images/rank.png'
import firstImg from '@/assets/images/first.png'
import secondImg from '@/assets/images/second.png'
import thridImg from '@/assets/images/thrid.png'

const qq = ref('939962768')
const { rank } = storeToRefs(useRankStore())
const isShrink = ref(true)

/* 账号属性 */
// 基础信息
const qqMsg = ref({})
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
    2: 100,
    3: 500,
    4: 1000,
    5: 5000,
    6: 10000,
    7: 50000,
    8: 100000
  }
})
// 递增数字
const sequent = ref({
  score: 0,
  text: '',
  rule: {
    2: 100,
    3: 500,
    4: 1000,
    5: 5000,
    6: 10000,
    7: 50000,
    8: 100000
  }
})
// 对称数字
const symmetric = ref({
  score: 0,
  text: '',
  rule: {
    2: 100,
    3: 500,
    4: 1000,
    5: 5000,
    6: 10000,
    7: 50000,
    8: 100000
  }
})

const level = ref({
  score: 0,
  text: ''
})
const svip = ref({
  score: 0,
  text: ''
})
const vip = ref({
  score: 0,
  text: ''
})
const active = ref({
  score: 0,
  text: ''
})

const sumScore = ref(0)
const sumList = ref([])

// 计算qq号得分
const scoreQQ = () => {
  if (!qq.value) return
  LenScore(qq.value)
  RegScore(qq.value)
  MsgScore(qq.value)

  // 得分数组
  const list = [
    len.value,
    same.value,
    sequent.value,
    symmetric.value,
    level.value,
    svip.value,
    vip.value,
    active.value
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
    qq: qq.value,
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
// 计算账号信息得分
const MsgScore = (qq) => {
  level.value = {
    score: qqMsg.value.level * 8,
    text: `qq等级 <span class="blue"> ${qqMsg.value.level} </span>`
  }
  svip.value = {
    score: qqMsg.value.svip * 28,
    text: `qq大会员等级 <span class="blue"> ${qqMsg.value.svip} </span>`
  }
  vip.value = {
    score: qqMsg.value.vip * 12,
    text: `qq会员等级 <span class="blue"> ${qqMsg.value.vip} </span>`
  }
  active.value = {
    score: Number(qqMsg.value.activeday) / 10,
    text: `账号活跃度 <span class="blue"> ${qqMsg.value.activeday} </span>`
  }
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
  // getQQMsg(qq.value).then((res) => {
  //   qqMsg.value = {
  //     avatar: res.result.sFaceUrl,
  //     name: res.result.sNickName || '未知名称',
  //     level: res.result.iQQLevel || 0,
  //     svip: res.result.iBigClubLevel || 0,
  //     vip: res.result.iVipLevel || 0,
  //     activeday: res.result.iTotalActiveDay || 0
  //   }
  //   scoreQQ()
  //   isShrink.value = false
  // })

  scoreQQ()
  isShrink.value = false
}
</script>

<template>
  <div class="page">
    <van-cell-group inset>
      <van-field
        v-model="qq"
        center
        clearable
        label="qq号"
        label-width="3em"
        placeholder="请输入qq号"
      >
        <template #button>
          <van-button size="small" type="primary" @click="handleClick"
            >查询</van-button
          >
        </template>
      </van-field>
    </van-cell-group>
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
      <div class="table-body" :style="{ height: isShrink ? '0' : '440px' }">
        <img :src="qqMsg.avatar" class="avatar" />
        <div class="name">
          {{ qqMsg.name || '未知昵称' }}
          <span class="level">Lv {{ qqMsg.level || 0 }}</span>
          <span class="svip">SVip {{ qqMsg.svip || 0 }}</span>
          <span class="vip">Vip {{ qqMsg.vip || 0 }}</span>
        </div>
        <van-row v-for="(item, index) in sumList" :key="index">
          <van-col class="label" span="16">
            <div v-html="item.text"></div>
          </van-col>
          <van-col class="value" span="8">{{ item.score }}</van-col>
        </van-row>
      </div>
      <van-row>
        <div class="table-footer" @click="isShrink = !isShrink">
          {{ isShrink ? `展开` : `收起`
          }}<van-icon
            :name="isShrink ? `arrow-down` : `arrow-up`"
            size="18px"
          />
        </div>
      </van-row>
    </div>

    <div class="rank">
      <van-row>
        <div class="total">
          当日排行榜
          <img class="rank-img" :src="rankImg" />
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
        <van-col class="label" span="12">
          <div v-html="item.qq"></div>
        </van-col>
        <van-col class="value" span="8">{{ item.score }}</van-col>
      </van-row>
    </div>
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
  background: url('/src/assets/images/qqBg.jpg') no-repeat right 20% top 0;
  background-color: #36b4c3;
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
