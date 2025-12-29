<template>
  <div class="painting-panel">
    <div class="panel-header">
      <h3>像素信息</h3>
    </div>
    
    <div class="panel-content">
      <!-- 像素坐标信息 -->
      <div class="pixel-info" v-if="selectedPixel">
        <div class="info-item">
          <label>坐标：</label>
          <span>({{ selectedPixel.x }}, {{ selectedPixel.y }})</span>
        </div>
        <div class="info-item">
          <label>颜色：</label>
          <div class="color-preview" :style="{ backgroundColor: currentPixelColor }"></div>
          <span>{{ currentPixelColor }}</span>
        </div>
        
        <!-- 从服务器获取的像素详细信息 -->
        <div class="pixel-details" v-if="selectedPixelData">
          <div class="info-item">
            <label>国家：</label>
            <span>{{ selectedPixelData.country }}</span>
          </div>
          <div class="info-item">
            <label>城市：</label>
            <span>{{ selectedPixelData.city }}</span>
          </div>
          <div class="info-item">
            <label>时间：</label>
            <span>{{ new Date(selectedPixelData.timestamp * 1000).toLocaleString() }}</span>
          </div>
        </div>
        <div v-else-if="currentPixelColor === '#ffffff'" class="info-item">
          <label>状态：</label>
          <span>未被操作过</span>
        </div>
      </div>
      
      <div v-else class="no-selection">
        <p>请选择一个像素</p>
      </div>
      
      <!-- 颜色选择器 -->
      <div class="color-section">
        <h4>选择颜色</h4>
        <div class="color-picker">
          <input
            type="color"
            v-model="drawingColor"
            class="color-input"
          />
          <span class="color-value">{{ drawingColor }}</span>
        </div>
        
        <!-- 预设颜色 -->
        <div class="preset-colors">
          <div
            v-for="color in presetColors"
            :key="color"
            class="preset-color"
            :style="{ backgroundColor: color }"
            @click="selectPresetColor(color)"
          ></div>
        </div>
      </div>
      
      <!-- 绘制按钮 -->
      <div class="action-buttons" v-if="selectedPixel">
        <button class="paint-button" @click="paintPixel">
          上色
        </button>
        <button class="clear-button" @click="clearPixel">
          清除
        </button>
      </div>
      
      <!-- 当前视图信息 -->
      <div class="view-info">
        <h4>视图信息</h4>
        <div class="info-item">
          <label>缩放：</label>
          <span>{{ Math.round(zoom * 100) }}%</span>
        </div>
        <div class="info-item">
          <label>视图位置：</label>
          <span>({{ Math.round(viewX) }}, {{ Math.round(viewY) }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  selectedPixel,
  selectedPixelData,
  drawingColor,
  getPixelColor,
  setPixelColor,
  zoom,
  viewX,
  viewY
} from '../stores/canvas.store';

// 预设颜色
const presetColors = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#9900ff'
];

// 当前选中像素的颜色
const currentPixelColor = computed(() => {
  if (!selectedPixel.value) return '#ffffff';
  const { x, y } = selectedPixel.value;
  return getPixelColor(x, y);
});

// 选择预设颜色
const selectPresetColor = (color) => {
  drawingColor.value = color;
};

// 给像素上色
const paintPixel = async () => {
  if (!selectedPixel.value) return;
  const { x, y } = selectedPixel.value;
  await setPixelColor(x, y, drawingColor.value);
};

// 清除像素颜色
const clearPixel = async () => {
  if (!selectedPixel.value) return;
  const { x, y } = selectedPixel.value;
  await setPixelColor(x, y, '#ffffff');
};
</script>

<style scoped>
.painting-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #f5f5f5;
}

.panel-header {
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
}

.pixel-info {
  background-color: white;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-item {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item label {
  font-weight: bold;
  margin-right: 8px;
  color: #666;
  width: 60px;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  border: 1px solid #ddd;
  margin-right: 8px;
}

.no-selection {
  text-align: center;
  padding: 20px;
  color: #999;
  background-color: white;
  border-radius: 4px;
  margin-bottom: 16px;
}

.color-section {
  background-color: white;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.color-section h4 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.color-picker {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

.color-value {
  font-family: monospace;
  color: #666;
}

.preset-colors {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.preset-color {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
  transition: transform 0.2s;
}

.preset-color:hover {
  transform: scale(1.1);
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.paint-button, .clear-button {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.paint-button {
  background-color: #409eff;
  color: white;
}

.paint-button:hover {
  background-color: #66b1ff;
}

.clear-button {
  background-color: #909399;
  color: white;
}

.clear-button:hover {
  background-color: #a6a9ad;
}

.view-info {
  background-color: white;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.view-info h4 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}
</style>
