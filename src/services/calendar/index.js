import moment from 'moment'
import { forEach, isEqual, isUndefined, differenceWith } from 'loadsh'

import { totalFixedTimeSlots } from 'constants/common'
import { getBookedEvents } from 'services/googleApi'
import { getFilteredBookedAppoinments, getBookedEventsForEachDay, getFixedISOTimeSolts} from 'utils'

export const makeMonthlyTimeSlotsStatus = async (startDate, endDate) => {
  const days = [];
  const totalNoOfDays = endDate.getDate();

  const { data: { items } } = await getBookedEvents(startDate, endDate)
  const bookedEventsForEachDay = getBookedEventsForEachDay(items)
  
  for(let i = 1; i <= totalNoOfDays; i++) {
    if(bookedEventsForEachDay[i] < totalFixedTimeSlots 
      || isUndefined(bookedEventsForEachDay[i]))
      days.push({day: i, hasTimeSlots: true})
    else
      days.push({day: i, hasTimeSlots: false})
  }

  return days
}

export const makeTimeSlotsForGivenDay = async (startTime, endTime) => {
  const { data: { items } } = await getBookedEvents(startTime, endTime)
  const bookedApps = getFilteredBookedAppoinments(items)
  const fixedTimeSlots = getFixedISOTimeSolts(startTime)

  // TODO: get start and end time from bookedApps to compare with fixedTimeSlots

  const a = differenceWith(fixedTimeSlots, bookedApps, isEqual)

  return a
}