export const transformHours = (hours) => {
  const weekDaysMap = {
    1: 1, // Monday
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 0, // Sunday 
  };

  const convertTo24Hour = (time12, meridian) => {
    if (!time12) return "00:00";

    let [hours, minutes] = time12.split(":");
    hours = parseInt(hours);

    if (meridian === "PM" && hours !== 12) {
      hours += 12;
    } else if (meridian === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  return Object.entries(hours.daysStatus || {}).map(([dayId, d]) => {
    const day_of_week = weekDaysMap[dayId];

    if (!d.isOpen) {
      return {
        day_of_week,
        open_time: "00:00",
        close_time: "00:00",
        is_closed: true,
      };
    }

    return {
      day_of_week,
      open_time: convertTo24Hour(d.startTime, d.startMeridian),
      close_time: convertTo24Hour(d.endTime, d.endMeridian),
      is_closed: false,
    };
  });
};