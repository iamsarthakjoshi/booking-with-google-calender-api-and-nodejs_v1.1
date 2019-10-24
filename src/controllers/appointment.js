import moment from 'moment'
import { countBy } from 'loadsh'

import { makeMonthlyTimeSlotsStatus, makeTimeSlotsForGivenDay } from 'services/calendar'

export const getMonthlyTimeSlotsStatus =  async (req, res) => {
  const { cookies: { token }, query: { year }, query: { month } } = req
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month + 1, 0);
  const days = await makeMonthlyTimeSlotsStatus(startDate, endDate)

  res.send({ success: true, days });
}

export const getTimeSlotsForGivenDay = async (req, res) => {
  const { query: { year }, query: { month }, query: { day } } = req

  // const startTime = new Date(year, month - 1, day, 9, 30); // time not needed
  // const endTime =new Date(year, month + 1, day, 18, 30);
  const startTime = new Date(year, month - 1, day);
  const endTime =new Date(year, month + 1, day);

  const timeslots = await makeTimeSlotsForGivenDay(startTime, endTime)
  res.send(timeslots)
}

export const bookNewAppointment = (req, res) => {
  res.send('new appointment booked')
}