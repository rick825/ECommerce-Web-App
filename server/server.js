const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require("morgan"); 
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const app = express();

const envPath = path.join(__dirname, 'config.env'); 
const result = dotenv.config({ path: envPath });
if (result.error) {
    throw result.error;
}

const connectDb = require('./services/db/db');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/server',(req,res)=>{
    res.send("Express Welcomes You to the Server");
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

connectDb();


//route
app.use('/',require('./services/routes/routes'));

//build
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
