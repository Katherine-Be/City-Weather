const express = require('express')
const app = express()
const path = require('path');


app.use(express.static('public'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/window', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'window.html'));
  });

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
});