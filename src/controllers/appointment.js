
import { getDaysTimeSlotStatus } from 'services/calendar'

export const getMonthlyTimeSlotsStatus =  async (req, res) => {

  const { cookies: { token }, query: { year } } = req

  const month = req.query.month - 1
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const days = await getDaysTimeSlotStatus(token, startDate, endDate)

  res.send({ success: true, days });
}

export const getTimeSlotsForGivenDay = (req, res) => {
  res.send('timeslots')
}

export const bookNewAppointment = (req, res) => {
  res.send('new appointment booked')
}