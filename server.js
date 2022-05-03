import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { steps } from './server/lib.js'

const port = process.env.PORT || 4000
const api = `http://localhost:${port}`

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const lib = []
  steps.forEach((current, index) => {
    lib.push({
      name: current.name,
      url: `${api}/example/${index}`
    })
  })
  res.json(lib)
})

app.get('/example/:id', (req, res) => {
  const index = req.params.id
  res.json(steps[parseInt(index)])
})

app.post('/example/:id', async (req, res) => {
  const index = req.params.id
  console.log('index',index)


  const result = await steps[index].operation(req.body.inputs)
  console.log(result)

  res.json({
    done:true
  })
})


app.listen(port, () => {
  console.log(`listening on ${port}`)
})
