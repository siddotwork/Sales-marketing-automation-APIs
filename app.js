const express = require('express');
const fs = require('fs');

// load environment variables
require('dotenv').config();


const webhookRoutes = require('./routes/webhook');
const graphyRoutes = require('./routes/graphy');

const app = express();

app.get("",(req,res)=>{
  // res.send("Is this supposed to be working? Perhaps not.");
  if (req.url === '/') {
    fs.readFile('./www/index.html', (err, html) => {
      if (err) throw err;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(html);
      res.end();
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('<h1>404 Page Not Found</h1>');
    res.end();
  }
})

app.use(express.static("www"));

// your app global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// routing your http requests
app.use('/webhook', webhookRoutes);
app.use('/graphy', graphyRoutes);


// `Not Found` request handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  throw error;
});


// thrown erros handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ message: error.message || 'Internal Server Error' });
});


// bootstrap your server
app.listen(process.env.PORT, '0.0.0.0', function() {
  console.log("Server running on %d in %s mode", process.env.PORT, app.settings.env);
});
