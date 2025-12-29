import { ref, reactive } from 'vue';

// 在线人数
const onlineCount = ref(1234);

// 国家统计数据（假数据）
const countryStatistics = reactive([
  { country: '中国', users: 543, percentage: 44.0 },
  { country: '美国', users: 234, percentage: 18.9 },
  { country: '日本', users: 156, percentage: 12.7 },
  { country: '德国', users: 98, percentage: 7.9 },
  { country: '英国', users: 87, percentage: 7.0 },
  { country: '其他', users: 116, percentage: 9.4 }
]);

// 模拟更新在线人数
const updateOnlineCount = () => {
  // 随机波动在线人数
  onlineCount.value = Math.max(1000, onlineCount.value + Math.floor(Math.random() * 100) - 50);
};

export {
  onlineCount,
  countryStatistics,
  updateOnlineCount
};
