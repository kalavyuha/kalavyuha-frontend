import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Stack,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { Clock } from "lucide-react";
// import CustomSwitch from "../components/CustomSwitch";

const BusinessHours = () => {
  const [scheduleType, setScheduleType] = useState("selected_hours");
  const [daysStatus, setDaysStatus] = useState(
    WeekDays.reduce(
      (acc, day) => ({
        ...acc,
        [day.id]: {
          isOpen: true,
          startTime: "09:00",
          endTime: "06:00",
          startMeridian: "AM",
          endMeridian: "PM",
        },
      }),
      {}
    )
  );

  const handleToggle = (dayId) => {
    setDaysStatus((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        isOpen: !prev[dayId].isOpen,
      },
    }));
  };

  const validatedTime = (value) => {
    if (!value) return value;
    let [hours, minutes] = value.split(":");
    hours = parseInt(hours);

    // Limit hours to 12
    if (hours > 12) {
      hours = 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const handlePreview = () => {
    console.log("Business Hours Schedule:");
    WeekDays.forEach((day) => {
      const status = daysStatus[day.id];
      console.log(`${day.name}:`, {
        isOpen: status.isOpen,
        hours: status.isOpen
          ? scheduleType === "selected_hours"
            ? `${status.startTime} ${status.startMeridian} to ${status.endTime} ${status.endMeridian}`
            : scheduleType === "appointment"
            ? "By appointments only"
            : "Open 24 hours"
          : "Closed",
      });
    });
  };

  return (
    <Grid item size={{ xs: 12, sm: 12, md: 8, lg: 8 }}>
      <Box
        sx={{
          my: 8,
          mx: { xs: 1, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: "bold",
            color: "#1b4d69",
            fontSize: { xs: 20, sm: 26, md: 32 },
          }}
        >
          Set Business Hours
        </Typography>
        <Typography
          component="p"
          variant="body1"
          sx={{
            //   mb: 2,
            color: "#555",
            fontSize: { xs: 11, sm: 14, md: 15 },
          }}
        >
          Configure the standard hours of operation for this location.
        </Typography>
        <Box
          sx={{
            width: { xs: "300px", sm: "480px" },
            borderRadius: 2,
            mt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            // bgcolor: "red",
          }}
        >
          {/* ----------------SCHEDULE---------------- */}
          <Box
            sx={{
              mt: 0,
              mb: 1,
              width: "100%",
              justifyContent: "space-between",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Stack
              direction={"row"}
              spacing={{ xs: 1, sm: 2 }}
              alignItems="center"
            >
              <Clock color="#555" size={20} />
              <Typography
                sx={{
                  color: "#555",
                  fontSize: { xs: 14, sm: 16, md: 16 },
                  //   fontWeight: "bold",
                }}
              >
                Schedule
              </Typography>
            </Stack>
            <Select
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
              sx={{
                minWidth: { xs: 130, sm: 250, md: 250 },
                height: { xs: 25, sm: 30 },
                fontSize: { xs: 12, sm: 14, md: 14 },
                "& .MuiSelect-select": {
                  padding: "2px 10px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
              }}
            >
              <MenuItem value="selected_hours">
                Open for selected hours
              </MenuItem>
              <MenuItem value="appointment">By Appointment only</MenuItem>
              <MenuItem value="always_open">Always Open</MenuItem>
            </Select>
          </Box>
          {/* -----------------WEEK DAYS---------------- */}
          {WeekDays.map((day) => (
            <Box
              key={day.id}
              sx={{
                mb: 0,
                width: { xs: "90%", sm: "100%" },
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
                px: 3,
              }}
            >
              <Stack
                direction={"row"}
                spacing={{ xs: 0, sm: 2 }}
                alignItems="center"
              >
                {/* <CustomSwitch
                  checked={daysStatus[day.id].isOpen}
                  onChange={() => handleToggle(day.id)}
                /> */}
                <Typography
                  sx={{
                    color: "#000",
                    fontSize: { xs: 12, sm: 16, md: 16 },
                    fontWeight: "bold",
                  }}
                >
                  {day.name}
                </Typography>
              </Stack>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems="center"
              >
                {!daysStatus[day.id].isOpen ? (
                  <Typography
                    sx={{ color: "grey", fontSize: { xs: 12, sm: 14, md: 15 } }}
                  >
                    Closed
                  </Typography>
                ) : scheduleType === "selected_hours" ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                        border: "1px solid black",
                        px: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <TextField
                        type="time"
                        inputProps={{
                          step: 300,
                          style: { padding: "0px 0px" },
                        }}
                        sx={{
                          width: { xs: 45, sm: 45 },
                            fontSize: { xs: 12, sm: 14 },
                          "& input::-webkit-calendar-picker-indicator": {
                            display: "none",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                        value={daysStatus[day.id].startTime}
                        onChange={(e) => {
                          setDaysStatus((prev) => ({
                            ...prev,
                            [day.id]: {
                              ...prev[day.id],
                              startTime: validatedTime(e.target.value),
                            },
                          }));
                        }}
                      />
                      <Select
                        value={daysStatus[day.id].startMeridian}
                        onChange={(e) => {
                          setDaysStatus((prev) => ({
                            ...prev,
                            [day.id]: {
                              ...prev[day.id],
                              startMeridian: e.target.value,
                            },
                          }));
                        }}
                        sx={{
                          height: 30,
                          minWidth: 55,
                          fontSize: { xs: 14, sm: 14 },
                          "& .MuiSelect-select": {
                            padding: "4px 4px",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </Box>
                    <Typography
                      sx={{ color: "grey", fontSize: { xs: 12, sm: 15 } }}
                    >
                      to
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                        border: "1px solid black",
                        px: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <TextField
                        type="time"
                        inputProps={{
                          step: 300, // 5 min intervals
                          style: { padding: "0px 0px" },
                        }}
                        sx={{
                          width: { xs: 45, sm: 45 },
                            fontSize: { xs: 12, sm: 14 },
                          "& input::-webkit-calendar-picker-indicator": {
                            display: "none",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                        value={daysStatus[day.id].endTime}
                        onChange={(e) => {
                          setDaysStatus((prev) => ({
                            ...prev,
                            [day.id]: {
                              ...prev[day.id],
                              endTime: validatedTime(e.target.value),
                            },
                          }));
                        }}
                      />
                      <Select
                        value={daysStatus[day.id].endMeridian}
                        onChange={(e) => {
                          setDaysStatus((prev) => ({
                            ...prev,
                            [day.id]: {
                              ...prev[day.id],
                              endMeridian: e.target.value,
                            },
                          }));
                        }}
                        sx={{
                          height: 30,
                          minWidth: 55,
                          fontSize: { xs: 14, sm: 14 },
                          "& .MuiSelect-select": {
                            padding: "4px 4px",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                        }}
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </Box>
                  </>
                ) : scheduleType === "appointment" ? (
                  <Typography
                    sx={{ color: "grey", fontSize: { xs: 12, sm: 14, md: 15 } }}
                  >
                    By appointments only
                  </Typography>
                ) : (
                  <Typography
                    sx={{ color: "grey", fontSize: { xs: 12, sm: 14, md: 15 } }}
                  >
                    Open 24 hours
                  </Typography>
                )}
              </Stack>
            </Box>
          ))}

          {/* ------------------BUTTONS------------------ */}
          <Box
            sx={{
              mt: 0,
              //   mb: 2,
              width: "100%",
              justifyContent: "space-evenly",
              display: "flex",
              alignItems: "center",
              //   px: 8,
            }}
          >
            <Button
              sx={{
                textTransform: "none",
                fontSize: { xs: 12, sm: 13 },
                color: "black",
                borderRadius: 10,
                width: 100,
                py: 0.5,
                fontWeight: 600,
                border: "1px solid #999",
              }}
            >
              Go Back
            </Button>
            <Button
              onClick={handlePreview}
              sx={{
                textTransform: "none",
                fontSize: { xs: 12, sm: 13 },
                color: "white",
                bgcolor: "black",
                borderRadius: 10,
                width: 100,
                py: 0.5,
                fontWeight: 600,
                border: "1px solid #999",
              }}
            >
              Preview
            </Button>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

const WeekDays = [
  {
    id: 1,
    name: "Monday",
  },
  {
    id: 2,
    name: "Tuesday",
  },
  {
    id: 3,
    name: "Wednesday",
  },
  {
    id: 4,
    name: "Thursday",
  },
  {
    id: 5,
    name: "Friday",
  },
  {
    id: 6,
    name: "Saturday",
  },
  {
    id: 7,
    name: "Sunday",
  },
];
export default BusinessHours;