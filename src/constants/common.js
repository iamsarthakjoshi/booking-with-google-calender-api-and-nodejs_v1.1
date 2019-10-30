export const fixedTimeSlots = [
  { start: '09:00:00.000Z', end: '09:40:00.000Z' }, // first appointment
  { start: '09:45:00.000Z', end: '10:25:00.000Z' },
  { start: '10:30:00.000Z', end: '11:10:00.000Z' },
  { start: '11:15:00.000Z', end: '11:55:00.000Z' },
  { start: '12:00:00.000Z', end: '12:40:00.000Z' },
  { start: '12:45:00.000Z', end: '13:25:00.000Z' },
  { start: '13:30:00.000Z', end: '14:10:00.000Z' },
  { start: '14:15:00.000Z', end: '14:55:00.000Z' },
  { start: '15:00:00.000Z', end: '15:40:00.000Z' },
  { start: '15:45:00.000Z', end: '16:25:00.000Z' },
  { start: '16:30:00.000Z', end: '17:10:00.000Z' },
  { start: '17:15:00.000Z', end: '17:55:00.000Z' } // last appointment
]

// Get the totatl numbers of appointment in a day
export const totalFixedTimeSlots = fixedTimeSlots.length

// Get start time of first appointment
export const startTime = fixedTimeSlots[0].start

// Get end time of last appointment
export const endTime = fixedTimeSlots[0].end

// declare error message for POST requests
export const msgInvalidTime = 'Invalid time slot'
export const msgPastTime = 'Cannot book time in the past'
export const msgLessThan24hr = 'Cannot book with less than 24 hours in advance'
export const msgIsBetween = 'Cannot book outside bookable timeframe'

// declare error message for missing params
export const msgMissingParams = 'Request is missing parameter:'
