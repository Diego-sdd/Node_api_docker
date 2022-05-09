import express from 'express'
import routesV1 from '@routes/v1/routes'

const port = 3000
const host = '0.0.0.0'

const app = express()

app.use(express.json())

app.use(routesV1)

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, host)
