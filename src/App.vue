<script setup>
import VConsole from 'vconsole'
new VConsole()
</script>

<template>
  <!-- <NavBar /> -->
  <RouterView />
</template>

<style lang="less">
@font-face {
  font-family: ShuHei;
  src: url('@/assets/font/Alimama_ShuHeiTi_Bold.ttf') format('truetype');
}

:root:root {
  --van-blue: @blue;
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
}

.page {
  position: relative;
  right: inherit;
  width: 100%;
  font-size: @fontSize;
}

.red {
  color: @red;
}

.blue {
  color: @blue;
}

.green {
  color: @green;
}
</style>
