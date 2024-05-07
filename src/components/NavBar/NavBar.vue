<script setup>
import { Return, Home } from '@icon-park/vue-next'


const router = useRouter()
const meta = computed(() => {
  return useRoute().meta
})

const onClickLeft = () => {
  if (meta.value.hasBack) router.back()
  if (meta.value.hasHome) router.push('/')
}

const themeVars = computed(() => {
  if (useRoute().name == 'user') {
    return {
      'nav-bar-background': ` url('/src/assets/body-bg.png') no-repeat center top / 100% auto,#2699FB`
    }
  }
  return {
    'nav-bar-background': ` url('/src/assets/body-bg.png') no-repeat center top / 100% auto,linear-gradient(
      137.23deg,
      #d3ecff 0%,
      #def 17.44%,
      #eff6ff 71.43%,
      #fff 100%,
      #596e80 100%
    )`
  }
})
</script>

<template>
  <van-config-provider :theme-vars="themeVars">
    <van-nav-bar @click-left="onClickLeft" fixed placeholder safe-area-inset-top :border="false"
      v-if="meta.hasBack || meta.hasHome || meta.hasUser">
      <template #left>
        <return theme="outline" :size="px2vw(24)" fill="#000" v-show="meta.hasBack" />
        <home theme="outline" :size="px2vw(24)" fill="#fff" v-show="meta.hasHome" />
      </template>
      <template #right>
        <user-float v-show="meta.hasUser" />
      </template>
    </van-nav-bar>
  </van-config-provider>
</template>
<style lang="less">
.van-nav-bar {
  background-attachment: fixed;
  z-index: 10000;

  --van-nav-bar-height: 74px;
}
</style>
