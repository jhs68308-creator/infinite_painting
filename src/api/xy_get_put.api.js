// 阿里云ESA边缘函数的URL（根据实际部署情况修改）
// const API_URL = 'https://your-edge-function-url.com';
const API_URL = 'https://xy-read-put.77686ce9.er.aliyun-esa.net';

/**
 * 获取指定坐标的像素数据
 * @param {number} x - 像素X坐标
 * @param {number} y - 像素Y坐标
 * @returns {Promise<Object|null>} 像素数据对象或null（如果不存在）
 */
export const getPixelData = async (x, y) => {
  console.log('开始调用getPixelData API:', { x, y });
  try {
    const url = `${API_URL}?action=get&x=${x}&y=${y}`;
    console.log('请求URL:', url);
    const response = await fetch(url);
    console.log('获取像素数据响应:', response);
    const data = await response.json();
    console.log('获取像素数据响应内容:', data);
    
    if (data.status === 'success') {
      if (data.data === null) {
        console.log('像素未被操作过:', { x, y });
        return null; // 像素未被操作过
      }
      // 解析数据格式：color_country_city_time
      const [color, country, city, timestamp] = data.data.split('_');
      console.log('获取像素数据成功:', { x, y, color, country, city, timestamp });
      return {
        color,
        country,
        city,
        timestamp: parseInt(timestamp)
      };
    } else {
      console.error('获取像素数据失败:', data.message);
      return null;
    }
  } catch (error) {
    console.error('获取像素数据时发生错误:', error);
    return null;
  }
};

/**
 * 设置指定坐标的像素数据（添加或覆盖）
 * @param {number} x - 像素X坐标
 * @param {number} y - 像素Y坐标
 * @param {string} color - 像素颜色（十六进制格式，如#000000）
 * @returns {Promise<boolean>} 操作是否成功
 */
export const setPixelData = async (x, y, color) => {
  console.log('开始调用setPixelData API:', { x, y, color });
  try {
    const url = `${API_URL}?action=set&x=${x}&y=${y}&color=${color}`;
    console.log('请求URL:', url);
    const response = await fetch(url);
    console.log('设置像素数据响应:', response);
    const data = await response.json();
    console.log('设置像素数据响应内容:', data);
    
    if (data.status === 'success') {
      console.log('设置像素数据成功:', { x, y, color });
      return true;
    } else {
      console.error('设置像素数据失败:', data.message);
      return false;
    }
  } catch (error) {
    console.error('设置像素数据时发生错误:', error);
    return false;
  }
};

/**
 * 删除指定坐标的像素数据
 * @param {number} x - 像素X坐标
 * @param {number} y - 像素Y坐标
 * @returns {Promise<boolean>} 操作是否成功
 */
export const deletePixelData = async (x, y) => {
  try {
    const response = await fetch(`${API_URL}?action=delete&x=${x}&y=${y}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return true;
    } else {
      console.error('删除像素数据失败:', data.message);
      return false;
    }
  } catch (error) {
    console.error('删除像素数据时发生错误:', error);
    return false;
  }
};

/**
 * 更新指定坐标的像素数据（与set功能相同，用于API一致性）
 * @param {number} x - 像素X坐标
 * @param {number} y - 像素Y坐标
 * @param {string} color - 像素颜色（十六进制格式，如#000000）
 * @returns {Promise<boolean>} 操作是否成功
 */
export const updatePixelData = async (x, y, color) => {
  return setPixelData(x, y, color);
};
