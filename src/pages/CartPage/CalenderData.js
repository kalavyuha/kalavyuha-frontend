import React, { useState, useEffect, useRef } from "react";
import {
  Select,
  MenuItem,
  Typography,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthSelect = ({ value, onChange, availableMonths }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      sx={{
        minHeight: "32px",
        width: "120px",
        "& fieldset": { border: "1px solid black" },
        "& .MuiSelect-select": {
          py: 0.5,
          px: 2,
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            borderRadius: 2,
            maxHeight: 160,
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "& .MuiList-root": {
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
        },
      }}
    >
      {availableMonths.map((monthName) => (
        <MenuItem
          key={monthName}
          value={monthName}
          sx={{
            bgcolor: "#fff",
            "&:hover": { bgcolor: "#eaeef2" },
            "&.Mui-selected": { bgcolor: "#1b4d69", color: "#fff" },
            "&.Mui-selected:hover": { bgcolor: "#1b4d69", color: "#fff" },
          }}
        >
          {monthName}
        </MenuItem>
      ))}
    </Select>
  );
};

const Calendar = ({ selectedSlotDate }) => {
  const today = new Date();
  const currentMonth = months[today.getMonth()];
  const currentDate = today.getDate();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [days, setDays] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);

  const generateCalendarDays = () => {
    const calendarDays = [];
    const monthsSet = new Set();

    // Generate next 20 days starting from today
    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const monthName = months[date.getMonth()];
      const dayOfMonth = date.getDate();

      monthsSet.add(monthName);

      calendarDays.push({
        day: dayName.substring(0, 2),
        date: dayOfMonth,
        fullDate: date,
        monthName: monthName,
        isToday: i === 0,
      });
    }

    // Set available months
    setAvailableMonths(Array.from(monthsSet));
    return calendarDays;
  };

  const getFilteredDays = () => {
    return days.filter((day) => day.monthName === selectedMonth);
  };

  useEffect(() => {
    const calendarDays = generateCalendarDays();
    setDays(calendarDays);
    // Set current date as initially selected and call the prop
    selectedSlotDate(currentDate);
  }, []);

  useEffect(() => {
    // Reset selected date when month changes
    setSelectedDate(null);
    // Reset scroll position
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [selectedMonth]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();

      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const isAtStart = () => {
    return !canScrollLeft;
  };

  const isAtEnd = () => {
    return !canScrollRight;
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -250,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 250,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" fontSize={16} sx={{ mb: 2 }}>
        Choose date and time
      </Typography>

      <Paper
        elevation={0}
        sx={{ padding: "1.5rem 2rem", 
          // bgcolor: "#dce1e6", 
          bgcolor: "#d7dbdf", 
          borderRadius: 3 }}
      >
        <Box sx={{ mb: 2 }}>
          <MonthSelect
            value={selectedMonth}
            onChange={handleMonthChange}
            availableMonths={availableMonths}
          />
        </Box>

        {/* Calendar with navigation arrows */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={scrollLeft}
            size="small"
            disabled={isAtStart()}
            sx={{
              bgcolor: isAtStart() ? "#ccc" : "#1b4d69",
              color: isAtStart() ? "#666" : "white",
              width: 22,
              height: 22,
              "&:hover": {
                bgcolor: isAtStart() ? "#ccc" : "#143a50",
              },
              "&:disabled": {
                bgcolor: "#ccc",
                color: "#666",
              },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          <Box
            ref={scrollContainerRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
              flex: 1,
            }}
          >
            {getFilteredDays().map(
              ({ day, date, fullDate, monthName, isToday }) => (
                <Box
                  key={`${monthName}-${date}`}
                  onClick={() => {
                    selectedSlotDate(date);
                    setSelectedDate(date);
                  }}
                  sx={{
                    minWidth: 34,
                    height: 40,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "20%",
                    bgcolor:
                      selectedDate === date
                        ? "#1b4d69"
                        : isToday
                        ? "#f0f8ff"
                        : "transparent",
                    color:
                      selectedDate === date
                        ? "white"
                        : isToday
                        ? "#000"
                        : "inherit",
                    cursor: "pointer",
                    mx: 0.5,
                    border: isToday ? "1px solid #1b4d69" : "none",
                    fontWeight: isToday ? "bold" : "normal",
                    "&:hover": {
                      bgcolor: selectedDate !== date ? "#eaeef2" : "#1b4d69",
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: "inherit" }}>
                    {day}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "inherit" }}>
                    {date}
                  </Typography>
                </Box>
              )
            )}
          </Box>

          <IconButton
            onClick={scrollRight}
            size="small"
            disabled={isAtEnd()}
            sx={{
              bgcolor: isAtEnd() ? "#ccc" : "#1b4d69",
              color: isAtEnd() ? "#666" : "white",
              width: 22,
              height: 22,
              "&:hover": {
                bgcolor: isAtEnd() ? "#ccc" : "#143a50",
              },
              "&:disabled": {
                bgcolor: "#ccc",
                color: "#666",
              },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Calendar;
