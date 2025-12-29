import { ref, reactive } from 'vue';
import { getPixelData, setPixelData } from '../api/xy_get_put.api';

// 像素颜色存储，键为 "x,y" 坐标字符串，值为颜色值
const pixels = reactive(new Map());

// 视图位置，(0,0) 为画布中心
const viewX = ref(0);
const viewY = ref(0);

// 缩放级别
const zoom = ref(1);

// 选中的像素坐标
const selectedPixel = ref(null);

// 选中像素的详细信息
const selectedPixelData = ref(null);

// 绘制颜色
const drawingColor = ref('#000000');

// 设置像素颜色
const setPixelColor = async (x, y, color) => {
  console.log('canvas.store.js: 开始设置像素颜色:', { x, y, color });
  pixels.set(`${x},${y}`, color);
  // 保存到服务器
  try {
    const result = await setPixelData(x, y, color);
    console.log('canvas.store.js: 设置像素颜色结果:', result);
  } catch (error) {
    console.error('canvas.store.js: 设置像素颜色时发生错误:', error);
  }
};

// 获取像素颜色
const getPixelColor = (x, y) => {
  return pixels.get(`${x},${y}`) || '#ffffff';
};

// 选择像素
const selectPixel = async (x, y) => {
  selectedPixel.value = { x, y };
  // 从服务器获取像素数据
  const data = await getPixelData(x, y);
  selectedPixelData.value = data;
};

// 取消选择像素
const deselectPixel = () => {
  selectedPixel.value = null;
};

// 更新视图位置
const updateViewPosition = (x, y) => {
  viewX.value = x;
  viewY.value = y;
};

// 更新缩放级别
const updateZoom = (newZoom) => {
  // 限制缩放级别在 0.1 到 10 之间
  zoom.value = Math.max(0.1, Math.min(10, newZoom));
};

// 设置绘制颜色
const setDrawingColor = (color) => {
  drawingColor.value = color;
};

// 获取像素数据（包括服务器数据）
const getPixelInfo = async (x, y) => {
  const color = getPixelColor(x, y);
  const data = await getPixelData(x, y);
  return {
    color,
    ...data
  };
};

export {
  pixels,
  viewX,
  viewY,
  zoom,
  selectedPixel,
  selectedPixelData,
  drawingColor,
  setPixelColor,
  getPixelColor,
  getPixelInfo,
  selectPixel,
  deselectPixel,
  updateViewPosition,
  updateZoom,
  setDrawingColor
};
