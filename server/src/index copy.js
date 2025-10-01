require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productsRoute = require('./routes/products');
const authRoute = require('./routes/auth');
const quotesRoute = require('./routes/quotes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoute);
app.use('/api/auth', authRoute);
app.use('/api/quotes', quotesRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
