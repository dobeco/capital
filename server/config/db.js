
const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect('mongodb://localhost/capital', { useNewUrlParser: true });

db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));
db.once('open',  ()=>  {
    console.log('数据库连接成功')
});



