const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')

const users = [
    {
        id: '1234',
        username: 'lan',
        email: 'lan@gmail.com',
        password: 'lan',
    }
];
const messages = [];


function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(cors({
    origin: ['http://localhost:5500']
}))
app.use(express.json())
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/auth/register', (req, res) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        id: makeid(4)
    }
    //check existed email
    const existed = users.some((user) => {
        return user.email === newUser.email
    })
    //If existed then return 409 statuscode
    if(existed){
        return res.status(409).json({
            message: 'Email was existed'
        })
    }

    //Add newUser in users array
    users.push(newUser)

    return res.json({
        data: {
            id: newUser.id, 
            email: newUser.email,
            username: newUser.username
        }
    })
})

app.post('/auth/login', (req, res) => {
    //Checkout user array has email and password received
    const body = req.body;
    const user = users.find(user => user.email === body.email && user.password === body.password)
    if(!user){
        return res.status(401).json({
            message: 'Unauthenticated'
        })
    }
    console.log(user.username)
    return res.json({
        data: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    })
})

app.post('/messages', (req, res) => {
    const body = req.body;
    console.log(body)
    console.log(users)
    const user = users.find(user => user.id === body.userId)
    // console.log(user)
    if(!user){
        return res.status(401).json({
            message: 'Unauthenticated.'
        })
    }
    const newMessage = {
        user: user.username,
        content: body.content,
        userId: body.userId
    }
    messages.push(newMessage)
    // console.log(messages)
    return res.json({
        data: newMessage
    })
})

app.get('/messages', (req, res)=> {
    const data = messages.map(message => {
        const user = users.find(user => user.id === message.userId)
        return {
            content: message.content,
            userId: message.userId,
            user: user.username
        }
    })
    return res.json({
        data
    })
})