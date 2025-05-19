import express from 'express';

const app = express();

const user=[];
app.use(express.json());

app.post('/usuarios', (req, res) => {
    //console.log(req.body);
    user.push(req.body);
    res.status(201).send('post');
});

app.get('/usuarios', (req, res) => {
    res.status(200).json(user);
    //res.status(200);
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});