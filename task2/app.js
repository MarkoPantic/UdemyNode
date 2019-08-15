const app = require('express')();



app.use('/users', (req, res, next) => {
    console.log('/users middleware');
    res.send('dummy users');
})


app.use('/', (req, res, next) => {
    console.log('/ middleware');
    console.log(req.method, req.url)
    res.send({});
})


app.listen(3000);