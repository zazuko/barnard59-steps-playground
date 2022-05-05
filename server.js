import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { exampleSteps } from './lib/exampleSteps.js'
import { jsonToQuads, getQuadsAndInfo, quadsToJson } from './lib/serialization.js'
import { run } from './lib/runner.js'

const port = process.env.PORT || 4000
const api = `http://localhost:${port}`

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const lib = []
  exampleSteps.forEach((current, index) => {
    lib.push({
      name: current.name,
      url: `${api}/example/${index}`
    })
  })
  res.json(lib)
})

app.get('/example/:id', (req, res) => {
  const index = parseInt(req.params.id)
  res.json(exampleSteps[index])
})

app.post('/example/:id', async (req, res) => {

  try {
    const index = parseInt(req.params.id)

    const inputChunksQuads = await Promise.all(req.body.inputChunks.map(jsonToQuads))
    const parametersQuads = await Promise.all(req.body.inputParameters.map(jsonToQuads))
    const operationQuads = await jsonToQuads(req.body.operation)

    const resultStream = await run(operationQuads, inputChunksQuads, parametersQuads, exampleSteps[index].overwriteParams)
    const { info, quads } = await getQuadsAndInfo(resultStream)

    res.json({
      flowInfo: info,
      output: await quadsToJson(quads)
    })

  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({
      message: error.message
    })
  }

})

app.listen(port, () => {
  console.log(`listening on ${port}`)
})
