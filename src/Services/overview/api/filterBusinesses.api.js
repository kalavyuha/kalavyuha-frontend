import { constant } from '../../../constant';
import { dummyFilteredBusinesses } from '../utils/filteredBusinesses.dummy';
import { transformFilteredBusinesses } from '../transformers/filteredBusinesses.transformer';

export const fetchFilteredBusinesses = async ({
  serviceName = '',
  location = '',
  businessType = '',
  date = '',
  time = '',
  timeSlot = '',
  startTime = '',
  endTime = ''
}) => {
  try {
    let queryParams = `ServiceName=${serviceName}&Location=${location}&BussinessType=${businessType}`;
    
    if (date) {
      queryParams += `&Date=${date}`;
    }
    if (time) {
      queryParams += `&Time=${time}`;
    }
    if (timeSlot && timeSlot !== '24 Hours') {
      queryParams += `&TimeSlot=${timeSlot}`;
    }
    if (startTime) {
      queryParams += `&StartTime=${encodeURIComponent(startTime)}`;
    }
    if (endTime) {
      queryParams += `&EndTime=${encodeURIComponent(endTime)}`;
    }

    const response = await fetch(`${constant.baseUrl}/api/v1/BussinessDetails/filter/?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (data?.Status === 200 && data?.Data) {
      return transformFilteredBusinesses(data.Data);
    }

    return transformFilteredBusinesses(dummyFilteredBusinesses);
  } catch (error) {
    console.error('Filter businesses API failed:', error);
    return transformFilteredBusinesses(dummyFilteredBusinesses);
  }
};
