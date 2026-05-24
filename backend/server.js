const express = require('express');
const { MongoDBconfig } = require('./libs/mongoconfig');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const authrouter = require('./routes/authRouther');
const productrouter = require('./routes/ProductRouter');
const orderrouter = require('./routes/orderRouter');
const categoryrouter = require("./routes/categoryRouter")
const notificationrouter = require("./routes/notificationRouters");
const activityrouter = require("./routes/activityRouter");
const inventoryrouter = require('./routes/inventoryRouter');
const salesrouter = require('./routes/salesRouter');
const supplierrouter = require('./routes/supplierrouter');
const stocktransactionrouter = require('./routes/stocktransactionrouter');


require('dotenv').config();
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST',' PUT', 'DELETE'],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
});

io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);
    
    socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
})

app.use(express.json({limit: "10mb"}));
app.use(express.json());
app.set("io", io);
app.use(cookieParser());
app.use('/authRoutes', authrouter);
app.use('/productRoutes', productrouter);
app.use('/orderRoutes', orderrouter);
app.use('/categoryRoutes', categoryrouter);
app.use('/notificationRoutes', notificationrouter);
app.use('/activityRoutes', activityrouter(app));
app.use('/inventoryRoutes', inventoryrouter);
app.use('/salesRoutes', salesrouter);
app.use('/supplierRoutes', supplierrouter);
app.use('/stocktransactionRoutes', stocktransactionrouter);

server.listen(PORT, () => {
  MongoDBconfig();
  console.log(`The server is running at port ${PORT}`);
});

module.exports = { io, server};