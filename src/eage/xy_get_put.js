export default {
   async fetch(request) {
     // 统一 CORS 头 - 移到外部确保在catch块中也能访问
     const corsHeaders = {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
       'Access-Control-Allow-Headers': 'Content-Type, X-Client-Country, X-Client-City',
       'Content-Type': 'application/json'
     };

     // 处理 OPTIONS 预检请求 
     if (request.method === 'OPTIONS') {
       return new Response(null, {
         headers: {
           ...corsHeaders,
           'Access-Control-Max-Age': '86400'
         }
       });
     }
     
     try {
       const url = new URL(request.url);
       const action = url.searchParams.get('action');
       let x = url.searchParams.get('x');
       let y = url.searchParams.get('y');
       const color = url.searchParams.get('color');

       console.log('Edge function received parameters:', { action, x, y, color });
       console.log('Parameter types:', { action: typeof action, x: typeof x, y: typeof y });

       // 更严格的字符串转换
       x = x != null ? String(x) : '0';
       y = y != null ? String(y) : '0';

       console.log('After conversion - x:', x, 'type:', typeof x, 'y:', y, 'type:', typeof y);

       // 获取客户端地理位置（阿里云 ER 提供的头）
       const country = request.headers.get('X-Client-Country') || 'XX';
       const city = request.headers.get('X-Client-City') || 'Unknown';

       // 时间戳（秒级）
       const timestamp = Math.floor(Date.now() / 1000).toString();

       // 初始化 EdgeKV
       const edgeKv = new EdgeKV({ namespace: 'Pixel_data' });

       // 验证必要参数
       if (!action) {
         return new Response(JSON.stringify({ status: 'error', message: 'Missing action parameter' }), {
           status: 400,
           headers: corsHeaders
         });
       }

       // 明确构造字符串键
       const key = `${x}_${y}`;
       console.log('Constructed key:', key);
       console.log('Key type:', typeof key);

       // 强制确保 key 是字符串
       const safeKey = String(key);
       console.log('Safe key:', safeKey);
       console.log('Safe key type:', typeof safeKey);

       switch (action) {
         case 'set':
         case 'update':
           if (!x || !y || !color) {
             return new Response(JSON.stringify({ status: 'error', message: 'Missing x, y or color for set/update' }), {
               status: 400,
               headers: corsHeaders
             });
           }
           // 值格式：color_country_city_time
           const value = `${color}_${country}_${city}_${timestamp}`;
           console.log('Storing value with safeKey:', safeKey, 'type:', typeof safeKey);
           await edgeKv.put(safeKey, value);
           return new Response(JSON.stringify({ status: 'success', data: { key: safeKey, value } }), {
             headers: corsHeaders
           });

         case 'get':
           if (!x || !y) {
             return new Response(JSON.stringify({ status: 'error', message: 'Missing x or y for get' }), {
               status: 400,
               headers: corsHeaders
             });
           }
           console.log('Getting value with safeKey:', safeKey, 'type:', typeof safeKey);
           const storedValue = await edgeKv.get(safeKey, { type: 'text' });
           if (storedValue === undefined) {
             return new Response(JSON.stringify({ status: 'success', data: null }), {
               headers: corsHeaders
             });
           }
           return new Response(JSON.stringify({ status: 'success', data: storedValue }), {
             headers: corsHeaders
           });

         case 'delete':
           if (!x || !y) {
             return new Response(JSON.stringify({ status: 'error', message: 'Missing x or y for delete' }), {
               status: 400,
               headers: corsHeaders
             });
           }
           console.log('Deleting safeKey:', safeKey, 'type:', typeof safeKey);
           await edgeKv.delete(safeKey);
           return new Response(JSON.stringify({ status: 'success', message: 'Deleted' }), {
             headers: corsHeaders
           });

         default:
           return new Response(JSON.stringify({ status: 'error', message: 'Invalid action. Use: set, get, delete, update' }), {
             status: 400,
             headers: corsHeaders
           });
       }
     } catch (e) {
       console.error('Edge function error:', e);
       return new Response(JSON.stringify({ status: 'error', message: e.message || 'Internal error' }), {
         status: 500,
         headers: corsHeaders
       });
     }
   }
 };