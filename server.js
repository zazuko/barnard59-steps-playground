import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { transforms } from './lib/transforms.js'
import { jsonToQuads, getQuadsAndInfo, quadsToJson } from './lib/serialization.js'

const port = process.env.PORT || 4000
const api = `http://localhost:${port}`

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const lib = []
  transforms.forEach((current, index) => {
    lib.push({
      name: current.name,
      url: `${api}/example/${index}`
    })
  })
  res.json(lib)
})

app.get('/example/:id', (req, res) => {
  const index = parseInt(req.params.id)
  res.json(transforms[index])
})

app.post('/example/:id', async (req, res) => {
  const index = parseInt(req.params.id)

  // Change this to a parallel mapping or something like that
  const chunks = []
  for (const jsonld of req.body.inputs) {
    chunks.push(await jsonToQuads(jsonld))
  }
  // Sometimes these things return quads, quad arrays or datasets
  const resultStream = await transforms[index].operation(...chunks)
  const { info, quads } = await getQuadsAndInfo(resultStream)
  res.json({
    flowInfo: info,
    output: await quadsToJson(quads)
  })
})

app.listen(port, () => {
  console.log(`listening on ${port}`)
})
