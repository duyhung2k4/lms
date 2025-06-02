import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// Đọc query từ file hoặc mảng có sẵn
const queries = new SharedArray('queries', function () {
  // Cách 1: hardcoded trong file
  return ['Giải', 'Mến', 'Hùng', 'C', 'Nguyễn', 'Công nghệ'];

  // Cách 2: load từ file CSV hoặc JSON (tuỳ chọn)
  // return JSON.parse(open('./queries.json'));
});

export let options = {
  vus: 1000,             // 10 người dùng ảo
  duration: '30s',     // chạy trong 30 giây
};

export default function () {
  const query = queries[Math.floor(Math.random() * queries.length)];
  const url = `http://localhost:8081/api/search?q=${encodeURIComponent(query)}`;

  let res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // mô phỏng người dùng chờ 1 giây giữa các lần gọi
}
