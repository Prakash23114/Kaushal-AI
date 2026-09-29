require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectToDB = require('./src/config/db')

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);


connectToDB()




server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
