<template>
  <div class="canvas-container" ref="containerRef">
    <canvas
      ref="canvasRef"
      @mousedown="startPan"
      @mousemove="pan"
      @mouseup="endPan"
      @mouseleave="endPan"
      @wheel="handleZoom"
      @click="selectPixel"
      :width="canvasWidth"
      :height="canvasHeight"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import {
  viewX,
  viewY,
  zoom,
  selectedPixel,
  getPixelColor,
  setPixelColor,
  selectPixel as selectPixelStore,
  drawingColor
} from '../stores/canvas.store';

const canvasRef = ref(null);
const containerRef = ref(null);
const canvasWidth = ref(0);
const canvasHeight = ref(0);

// 平移相关
const isPanning = ref(false);
const lastMouseX = ref(0);
const lastMouseY = ref(0);

// 像素大小
const pixelSize = 10;

// 初始化画布
onMounted(() => {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  render();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
});

// 监听视图变化，重新渲染
watch([viewX, viewY, zoom, selectedPixel], () => {
  render();
}, { deep: true });

// 调整画布大小
const resizeCanvas = () => {
  if (!containerRef.value) return;
  
  const container = containerRef.value;
  canvasWidth.value = container.clientWidth;
  canvasHeight.value = container.clientHeight;
  
  render();
};

// 渲染可见像素
const render = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const centerX = canvasWidth.value / 2;
  const centerY = canvasHeight.value / 2;
  
  // 清空画布
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  
  // 计算可见区域边界
  const scaledPixelSize = pixelSize * zoom.value;
  const visibleWidth = Math.ceil(canvasWidth.value / scaledPixelSize) + 2;
  const visibleHeight = Math.ceil(canvasHeight.value / scaledPixelSize) + 2;
  
  const startX = Math.floor((-centerX / scaledPixelSize) - viewX.value) - 1;
  const startY = Math.floor((-centerY / scaledPixelSize) - viewY.value) - 1;
  
  // 渲染可见像素
  for (let x = startX; x < startX + visibleWidth; x++) {
    for (let y = startY; y < startY + visibleHeight; y++) {
      const color = getPixelColor(x, y);
      const screenX = centerX + (x + viewX.value) * scaledPixelSize;
      const screenY = centerY + (y + viewY.value) * scaledPixelSize;
      
      ctx.fillStyle = color;
      ctx.fillRect(screenX, screenY, scaledPixelSize, scaledPixelSize);
      
      // 绘制网格线
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(screenX, screenY, scaledPixelSize, scaledPixelSize);
    }
  }
  
  // 如果有选中的像素，绘制选中边框
  if (selectedPixel.value) {
    const { x, y } = selectedPixel.value;
    const screenX = centerX + (x + viewX.value) * scaledPixelSize;
    const screenY = centerY + (y + viewY.value) * scaledPixelSize;
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, screenY, scaledPixelSize, scaledPixelSize);
  }
};

// 开始平移
const startPan = (event) => {
  isPanning.value = true;
  lastMouseX.value = event.clientX;
  lastMouseY.value = event.clientY;
  
  // 阻止选择文本
  event.preventDefault();
};

// 平移
const pan = (event) => {
  if (!isPanning.value) return;
  
  const deltaX = (event.clientX - lastMouseX.value) / (pixelSize * zoom.value);
  const deltaY = (event.clientY - lastMouseY.value) / (pixelSize * zoom.value);
  
  viewX.value += deltaX;
  viewY.value += deltaY;
  
  lastMouseX.value = event.clientX;
  lastMouseY.value = event.clientY;
  
  event.preventDefault();
};

// 结束平移
const endPan = () => {
  isPanning.value = false;
};

// 处理缩放
const handleZoom = (event) => {
  event.preventDefault();
  
  const delta = event.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = zoom.value * delta;
  
  // 限制缩放级别
  zoom.value = Math.max(0.1, Math.min(10, newZoom));
};

// 选择像素
const selectPixel = async (event) => {
  if (isPanning.value) return;
  
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  
  const centerX = canvasWidth.value / 2;
  const centerY = canvasHeight.value / 2;
  const scaledPixelSize = pixelSize * zoom.value;
  
  // 计算选中的像素坐标
  const x = Math.floor((mouseX - centerX) / scaledPixelSize - viewX.value);
  const y = Math.floor((mouseY - centerY) / scaledPixelSize - viewY.value);
  
  // 选择像素
  await selectPixelStore(x, y);
  
  // 如果是按住Shift键，同时上色
  if (event.shiftKey) {
    await setPixelColor(x, y, drawingColor.value);
    render();
  }
};
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
  position: relative;
  cursor: grab;
  display: flex;
  flex-direction: column;
}

.canvas-container:active {
  cursor: grabbing;
}

canvas {
  display: block;
}
</style>
