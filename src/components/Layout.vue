<template>
  <div class="layout-container">
    <el-container class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-icon" @click="toggleLeftCollapse">
            <component :is="leftCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <div class="logo">
            <el-icon><ElementPlus /></el-icon>
            <span class="title">画布无限！</span>
          </div>
        </div>
        
        <div class="header-right">
          <el-icon class="collapse-icon" @click="toggleRightCollapse">
            <component :is="rightCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="30" :src="avatarUrl" />
              <span class="username">用户</span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container class="content-container">
        <!-- 左侧边栏 -->
        <el-aside 
          :class="['left-sidebar', { 'collapsed': leftCollapse }]"
          :width="leftCollapse ? '64px' : '250px'"
        >
          <div class="sidebar-content">
            <Statistics />
            <div class="sidebar-footer" v-if="!leftCollapse">
              <div class="sidebar-footer-content">
                <el-icon><InfoFilled /></el-icon>
                <span>当前版本：v1.0.0</span>
              </div>
            </div>
          </div>
        </el-aside>

        <!-- 主要内容区域 -->
        <el-main class="main-content">
          <div class="main-content-wrapper">
            <Canvas />
          </div>
        </el-main>

        <!-- 右侧边栏 -->
        <el-aside 
          :class="['right-sidebar', { 'collapsed': rightCollapse }]"
          :width="rightCollapse ? '64px' : '300px'"
        >
          <div class="sidebar-content">
            <Painting />
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Fold,
  Expand,
  InfoFilled,
  ElementPlus,
  ArrowDown
} from '@element-plus/icons-vue'
import Canvas from './Canvas.vue'
import Painting from './Painting.vue'
import Statistics from './Statistics.vue'

// 响应式数据
const leftCollapse = ref(false)
const rightCollapse = ref(false)
const screenWidth = ref(window.innerWidth)
const avatarUrl = ref('')

// 方法
const toggleLeftCollapse = () => {
  leftCollapse.value = !leftCollapse.value
}

const toggleRightCollapse = () => {
  rightCollapse.value = !rightCollapse.value
}

// 响应式处理
const handleResize = () => {
  screenWidth.value = window.innerWidth
  
  // 根据屏幕宽度自动调整布局
  if (screenWidth.value < 768) {
    // 小屏幕：折叠左右侧边栏
    leftCollapse.value = true
    rightCollapse.value = true
  } else if (screenWidth.value < 1200) {
    // 中等屏幕：折叠右侧边栏
    leftCollapse.value = false
    rightCollapse.value = true
  } else {
    // 大屏幕：展开所有
    leftCollapse.value = false
    rightCollapse.value = false
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize() // 初始调用
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-container {
  height: 100%;
}

/* 顶部导航栏样式 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2c3e50;
  color: white;
  padding: 0 20px;
  border-bottom: 1px solid #1a252f;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.collapse-icon:hover {
  color: #409eff;
}

/* 侧边栏样式 */
.content-container {
  height: calc(100vh - 60px);
}

.left-sidebar, .right-sidebar {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  transition: width 0.3s;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.right-sidebar {
  border-right: none;
  border-left: 1px solid #e6e6e6;
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid #f0f0f0;
  background-color: #f9f9f9;
}

.sidebar-footer-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #888;
}

/* 主内容区域样式 */
.main-content {
  background-color: #f5f7fa;
  padding: 0;
  overflow: hidden;
}

.main-content-wrapper {
  background-color: #fff;
  border-radius: 0;
  height: 100%;
  min-height: 100%;
  padding: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .left-sidebar,
  .right-sidebar {
    position: absolute;
    z-index: 1000;
    height: 100%;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }
  
  .left-sidebar:not(.collapsed) {
    width: 250px !important;
  }
  
  .right-sidebar:not(.collapsed) {
    width: 250px !important;
  }
}
</style>