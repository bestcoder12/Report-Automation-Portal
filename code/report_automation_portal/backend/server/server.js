import express from 'express';
import cors from 'cors';

const app = express()
app.use(express.json())
app.use(cors())
const port = 8080;

/* app.get('/', (req, res) => {
    res.send('Hello World!')
}) */

app.listen(port, () => {
    console.log(`Example app listening on port ${8080}`)
})