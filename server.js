import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { exampleSteps } from './lib/exampleSteps.js'
import { getOutputChunksWithInfo, toQuads, toString } from './lib/serialization.js'
import { prepareInputStream, run } from './lib/runner.js'

const port = process.env.PORT || 4000
const api = `http://localhost:${port}`

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const lib = []
  exampleSteps.forEach((current, index) => {
    lib.push({
      title: current.title,
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

    const operationQuads = toQuads(req.body.operation)
    const inputChunksQuads = req.body.inputChunks.map(toQuads)
    const parametersQuads = req.body.inputParameters.map(toQuads)

    const inputStream = await prepareInputStream(inputChunksQuads, req.body.inputStreamMode)
    const resultStream = await run(operationQuads, inputStream, parametersQuads, exampleSteps[index].overwriteParams)
    const outputChunks = await getOutputChunksWithInfo(resultStream, async (quads) => await toString(quads))

    res.json({
      outputChunks
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
