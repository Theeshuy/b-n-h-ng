const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Dữ liệu sản phẩm giả lập
const products = [
    { id: '1', name: 'Thú Nhồi Bông Gấu Trắng', price: 200000, image: 'https://www.google.com.vn/search?q=th%C3%BA+nh%E1%BB%93i+b%C3%B4ng+g%E1%BA%A5u+tr%E1%BA%AFng&udm=2#vhid=ck5qmRPITv1E4M&vssid=mosaic' },
    { id: '2', name: 'Thú Nhồi Bông Thỏ Hồng', price: 250000, image: 'https://via.placeholder.com/200' },
    { id: '3', name: 'Thú Nhồi Bông Chó Con', price: 300000, image: 'https://via.placeholder.com/200' },
    { id: '4', name: 'Thú Nhồi Bông Voi Xám', price: 280000, image: 'https://via.placeholder.com/200' },
    { id: '5', name: 'Thú Nhồi Bông Mèo Dễ Thương', price: 320000, image: 'https://via.placeholder.com/200' },
    { id: '6', name: 'Thú Nhồi Bông Khủng Long Xanh', price: 350000, image: 'https://via.placeholder.com/200' },
    { id: '7', name: 'Thú Nhồi Bông Chim Cánh Cụt', price: 220000, image: 'https://via.placeholder.com/200' },
    { id: '8', name: 'Thú Nhồi Bông Hươu Cao Cổ', price: 270000, image: 'https://via.placeholder.com/200' }
];

// Middleware
app.use(cors());
app.use(express.static('public'));

// API lấy danh sách sản phẩm
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Server chạy tại cổng 3000
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
