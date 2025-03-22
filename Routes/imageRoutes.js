import {Router} from 'express'

const imageRoute = Router()

imageRoute.get('/test', (req, res) => {
  res.json('Hitting test route succesfully')
})

export default imageRoute