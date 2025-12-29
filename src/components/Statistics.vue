<template>
  <div class="statistics-container">
    <!-- 在线人数卡片 -->
    <div class="online-card">
      <div class="card-header">
        <el-icon class="card-icon"><User /></el-icon>
        <span>在线人数</span>
      </div>
      <div class="online-count">{{ onlineCount }}</div>
      <div class="online-desc">当前活跃用户</div>
    </div>

    <!-- 国家统计卡片 -->
    <div class="country-card">
      <div class="card-header">
        <el-icon class="card-icon"><Location /></el-icon>
        <span>国家统计</span>
      </div>
      <div class="country-list">
        <div 
          v-for="(country, index) in countryStatistics" 
          :key="index"
          class="country-item"
        >
          <div class="country-info">
            <div class="country-name">{{ country.country }}</div>
            <div class="country-users">{{ country.users }}人</div>
          </div>
          <div class="country-progress">
            <div 
              class="progress-bar"
              :style="{ width: `${country.percentage}%` }"
            ></div>
            <div class="progress-percent">{{ country.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { onlineCount, countryStatistics, updateOnlineCount } from '../stores/user.store';
import { User, Location } from '@element-plus/icons-vue';

// 定时更新在线人数
let updateTimer = null;

onMounted(() => {
  // 每5秒更新一次在线人数
  updateTimer = setInterval(() => {
    updateOnlineCount();
  }, 5000);
});

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer);
  }
});
</script>

<style scoped>
.statistics-container {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.online-card {
  background-color: #f0f9ff;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 1px solid #e0f2fe;
}

.country-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  flex: 1;
  min-height: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 12px;
}

.card-icon {
  font-size: 18px;
  color: #3b82f6;
}

.online-count {
  font-size: 32px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 4px;
}

.online-desc {
  font-size: 12px;
  color: #64748b;
}

.country-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.country-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.country-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.country-name {
  font-weight: 500;
  color: #334155;
}

.country-users {
  font-size: 12px;
  color: #64748b;
}

.country-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: #dbeafe;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar::before {
  content: '';
  display: block;
  height: 100%;
  background-color: #3b82f6;
  border-radius: 3px;
}

.progress-percent {
  font-size: 11px;
  color: #64748b;
  min-width: 35px;
  text-align: right;
}

/* 响应式样式 - 侧边栏折叠状态 */
:deep(.left-sidebar.collapsed) .statistics-container {
  padding: 8px;
}

:deep(.left-sidebar.collapsed) .card-header span {
  display: none;
}

:deep(.left-sidebar.collapsed) .online-count {
  font-size: 24px;
}

:deep(.left-sidebar.collapsed) .country-info, .progress-percent {
  display: none;
}
</style>
