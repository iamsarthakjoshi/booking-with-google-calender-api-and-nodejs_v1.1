
import { getDaysTimeSlotStatus } from 'services/googleApi'

export const getMonthlyTimeSlotStatus =  async (req, res) => {

  const { cookies: { token }, query: { year } } = req

  const month = req.query.month - 1
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const days = await getDaysTimeSlotStatus(token, startDate, endDate)

  res.send({ success:  true, days });
}