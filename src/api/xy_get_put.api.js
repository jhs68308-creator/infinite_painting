// 阿里云ESA边缘函数的URL（根据实际部署情况修改）
// const API_URL = 'https://your-edge-function-url.com';
// const API_URL = 'https://xy-read-put.77686ce9.er.aliyun-esa.net';

// 使用代理后的 API 地址
const API_URL = '/api';

/**
 * 获取指定坐标的像素数据
 * @param {number} x - 像素X坐标
 * @param {number} y - 像素Y坐标
 * @returns {Promise<Object|null>} 像素数据对象或null（如果不存在）
 */
export const getPixelData = async (x, y) => {
  console.log('开始调用getPixelData API:', { x, y });
  console.log('x and y types:', { xType: typeof x, yType: typeof y });
  try {
    // 将 x 和 y 转换为字符串格式，避免类型问题
    const xStr = String(x);
    const yStr = String(y);
    const url = `${API_URL}?action=get&x=${xStr}&y=${yStr}`;
    console.log('请求URL:', url);
    const response = await fetch(url);
    console.log('获取像素数据响应:', response);
    console.log('响应状态:', response.status, response.statusText);
    
    // 检查响应是否成功
    if (!response.ok) {
      console.error('HTTP错误:', response.status, response.statusText);
      const textResponse = await response.text();
      console.error('错误响应内容:', textResponse);
      return null;
    }
    
    // 尝试解析为 JSON
    const contentType = response.headers.get('content-type');
    console.log('响应内容类型:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
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
    } else {
      // 如果响应不是 JSON，尝试以文本形式读取
      const textData = await response.text();
      console.error('非 JSON 响应:', textData);
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
  console.log('x and y types:', { xType: typeof x, yType: typeof y });
  try {
    // 将 x 和 y 转换为字符串格式，避免类型问题
    const xStr = String(x);
    const yStr = String(y);
    const url = `${API_URL}?action=set&x=${xStr}&y=${yStr}&color=${color}`;
    console.log('请求URL:', url);
    const response = await fetch(url);
    console.log('设置像素数据响应:', response);
    console.log('响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('HTTP错误:', response.status, response.statusText);
      const textResponse = await response.text();
      console.error('错误响应内容:', textResponse);
      return false;
    }
    
    const contentType = response.headers.get('content-type');
    console.log('响应内容类型:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('设置像素数据响应内容:', data);
      
      if (data.status === 'success') {
        console.log('设置像素数据成功:', { x, y, color });
        return true;
      } else {
        console.error('设置像素数据失败:', data.message);
        return false;
      }
    } else {
      const textData = await response.text();
      console.error('非 JSON 响应:', textData);
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
  console.log('开始调用deletePixelData API:', { x, y });
  console.log('x and y types:', { xType: typeof x, yType: typeof y });
  try {
    // 将 x 和 y 转换为字符串格式，避免类型问题
    const xStr = String(x);
    const yStr = String(y);
    const url = `${API_URL}?action=delete&x=${xStr}&y=${yStr}`;
    console.log('请求URL:', url);
    const response = await fetch(url);
    console.log('删除像素数据响应:', response);
    console.log('响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('HTTP错误:', response.status, response.statusText);
      const textResponse = await response.text();
      console.error('错误响应内容:', textResponse);
      return false;
    }
    
    const contentType = response.headers.get('content-type');
    console.log('响应内容类型:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('删除像素数据响应内容:', data);
      
      if (data.status === 'success') {
        console.log('删除像素数据成功:', { x, y });
        return true;
      } else {
        console.error('删除像素数据失败:', data.message);
        return false;
      }
    } else {
      const textData = await response.text();
      console.error('非 JSON 响应:', textData);
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