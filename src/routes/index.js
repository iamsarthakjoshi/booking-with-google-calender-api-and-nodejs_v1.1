import express from 'express'

const router = express.Router()

router.get('/days', (req, res) => {
  res.send("days")
})

router.get('/timeslot', (req, res) => {
  res.send("timeslot")
})

router.get('/book', (req, res) => {
  res.send("book")
})

module.exports = router;