import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import { MessagesSquare, Send, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo/kalavyuha-favicon/kalavyuha-favicon-color.png";

const LeftPanel = ({
  firstName = "",
  lastName = "",
  email = "",
  countryCode = "",
  phone = "",
  isSignIn = "",
  businessRoleForm = "",
  formData = {},
  selectedBusinessRole = "",
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const scrollContainerRef = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    let completedSteps = 0;
    const totalSteps = 7;

    if (formData.businessRole) completedSteps++;
    if (formData.businessInfoCompleted) completedSteps++;
    if (formData.teamInfoCompleted) completedSteps++;
    if (formData.services?.length > 0) completedSteps++;
    if (formData.businessHours) completedSteps++;

    setProgress((completedSteps / totalSteps) * 100);
  }, [
    firstName,
    email,
    formData.businessRole,
    formData.businessProfile,
    formData.teamPresence,
    formData.services,
    formData.businessHours,
  ]);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollContainerRef.current;
        setCanScrollUp(scrollTop > 0);
        setCanScrollDown(scrollTop + clientHeight < scrollHeight);
        setIsOverflowing(scrollHeight > clientHeight); // Check if content overflows
      }
    };

    if (scrollContainerRef.current) {
      checkScroll();
      scrollContainerRef.current.addEventListener("scroll", checkScroll);
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: direction * 100,
        behavior: "smooth",
      });
    }
  };

  const handleNavigateToSupport = () => {
    navigate("/support");
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        bgcolor: "#e2e6ea",
        minHeight: { xs: "35vh", md: "90vh" },
        margin: 2,
        borderRadius: "16px",
        padding: 2.5,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: "#1b4d69",
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <Box
          component="img"
          src={Logo}
          alt="Kalavyuha Logo"
          sx={{ width: 30, height: 30, mr: 1 }}
        />
        Kalavyuha
      </Typography>

      {/* <Typography variant="h6" sx={{ mb: 0, fontWeight: 'bold', fontSize:{xs:18, sm:20} }}>Chat with us</Typography> */}

      {/* <Button 
        startIcon={<MessagesSquare />} 
        onClick={handleNavigateToSupport}
        sx={{ mb: 1, textTransform: 'capitalize', color: 'black', fontWeight: 'bold', fontSize:{xs:13, sm:14} }}
      >
        Start live chat
      </Button> */}
      <Button
        startIcon={<Send />}
        onClick={handleNavigateToSupport}
        sx={{
          textTransform: "capitalize",
          color: "black",
          fontWeight: "bold",
          fontSize: { xs: 12, sm: 13 },
          bgcolor: "rgba(185, 192, 197, 0.27)",
          borderRadius: "10px",
        }}
      >
        Shoot us an email
      </Button>
      <Typography variant="body2" sx={{ mb: 2, mt: 2 }}>
        Raise a query and let our friendly team help you via support page.
      </Typography>

      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button
          onClick={toggleExpanded}
          sx={{
            mt: 1,
            textTransform: "capitalize",
            color: "#1b4d69",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              backgroundColor: "rgba(27, 77, 105, 0.1)",
            },
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            "&:active": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
            "&.Mui-focusVisible": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
        >
          {isExpanded ? "Hide Details" : "Show Details"}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      )}

      {/* Progress Section */}
      <Box
        sx={{
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
          maxHeight:
            (isSignIn || businessRoleForm) && (!isMobile || isExpanded)
              ? "200px"
              : "0px",
          opacity:
            (isSignIn || businessRoleForm) && (!isMobile || isExpanded) ? 1 : 0,
        }}
      >
        {(isSignIn || businessRoleForm) && (
          <>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
              Profile Completion
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                width: "100%",
                height: 10,
                borderRadius: 5,
                backgroundColor: "#d3d3d3",
                "& .MuiLinearProgress-bar": { backgroundColor: "#1b4d69" },
              }}
            />
            <Typography sx={{ mt: 1, fontSize: 12, fontWeight: "bold" }}>
              {Math.round(progress)}% Completed
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ maxHeight: "47vh", overflow: "hidden", width: "100%" }}>
        <Box
          ref={scrollContainerRef}
          sx={{
            overflowY: "auto",
            padding: "4px 24px 4px 0",
            maxHeight: "45vh",
            transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
            maxHeight: !isMobile || isExpanded ? "45vh" : "0vh",
            opacity: !isMobile || isExpanded ? 1 : 0,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              margin: "4px 0",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(27, 77, 105, 0.6)",
              borderRadius: "8px",
              border: "1px solid rgba(27, 77, 105, 0.1)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(27, 77, 105, 0.8)",
                transform: "scaleX(1.2)",
              },
              "&:active": {
                backgroundColor: "#1b4d69",
              },
            },
            "&::-webkit-scrollbar-corner": {
              backgroundColor: "transparent",
            },
          }}
        >
          {/* Your Details Section */}
          <Box
            sx={{
              transition:
                "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
              overflow: "hidden",
              maxHeight:
                (isSignIn || formData.agreeTerms) && (!isMobile || isExpanded)
                  ? "200px"
                  : "0px",
              opacity:
                (isSignIn || formData.agreeTerms) && (!isMobile || isExpanded)
                  ? 1
                  : 0,
            }}
          >
            {(isSignIn || formData.agreeTerms) && (
              <>
                <Typography
                  variant="h6"
                  sx={{ mb: 0, mt: 2, fontWeight: "bold" }}
                >
                  Your Details
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, fontSize: 12, wordBreak: "break-word" }}
                >
                  <b>Full Name:</b> {firstName} {lastName} <br />
                  <b>Email:</b> {email} <br />
                  <b>Phone no:</b> {countryCode} {phone}
                </Typography>
              </>
            )}
          </Box>

          {/* Business Role Section */}
          <Box
            sx={{
              transition:
                "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
              overflow: "hidden",
              maxHeight:
                ((businessRoleForm && selectedBusinessRole) ||
                  (isSignIn && formData.businessRole)) &&
                (!isMobile || isExpanded)
                  ? "100px"
                  : "0px",
              opacity:
                ((businessRoleForm && selectedBusinessRole) ||
                  (isSignIn && formData.businessRole)) &&
                (!isMobile || isExpanded)
                  ? 1
                  : 0,
            }}
          >
            {((businessRoleForm && selectedBusinessRole) ||
              (isSignIn && formData.businessRole)) && (
              <>
                <Typography
                  variant="h6"
                  sx={{ mb: 0, mt: 2, fontWeight: "bold" }}
                >
                  Business Category
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, fontSize: 12, wordBreak: "break-word" }}
                >
                  <b>Selected Role:</b>{" "}
                  {selectedBusinessRole || formData.businessRole}
                </Typography>
              </>
            )}
          </Box>

          {/* Business Introduction Section */}
          <Box
            sx={{
              transition:
                "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
              overflow: "hidden",
              maxHeight:
                isSignIn &&
                formData.businessInfoCompleted &&
                (!isMobile || isExpanded)
                  ? "300px"
                  : "0px",
              opacity:
                isSignIn &&
                formData.businessInfoCompleted &&
                (!isMobile || isExpanded)
                  ? 1
                  : 0,
            }}
          >
            {isSignIn && formData.businessInfoCompleted && (
              <>
                <Typography
                  variant="h6"
                  sx={{ mb: 0, mt: 2, fontWeight: "bold" }}
                >
                  Business Introduction
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, fontSize: 12, wordBreak: "break-word" }}
                >
                  <b>Business Name:</b> {formData.formData.businessName} <br />
                  <b>Introduction:</b> {formData.formData.introduction} <br />
                  <b>Location:</b> {formData.formData.shopName}
                  {formData.formData.nearBy}, {formData.formData.streetAddress},{" "}
                  {formData.formData.city}, {formData.formData.state}<br />
                   <b>Pincode:</b>
                  {formData.formData.zipCode}
                </Typography>
              </>
            )}
          </Box>

          {/* Staff Presence Section */}
          <Box
            sx={{
              transition:
                "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
              overflow: "hidden",
              maxHeight:
                isSignIn &&
                formData.teamInfoCompleted &&
                (!isMobile || isExpanded)
                  ? "400px"
                  : "0px",
              opacity:
                isSignIn &&
                formData.teamInfoCompleted &&
                (!isMobile || isExpanded)
                  ? 1
                  : 0,
            }}
          >
            {isSignIn && formData.teamInfoCompleted && (
              <>
                <Typography
                  variant="h6"
                  sx={{ mb: 0, mt: 2, fontWeight: "bold" }}
                >
                  Staff Presence
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, fontSize: 12, wordBreak: "break-word" }}
                >
                  <b>Employees:</b> {formData.teamSize || "None"} <br />
                  <b>Team Members:</b>
                  <ul
                    style={{
                      listStyleType: "none",
                      paddingLeft: 0,
                      marginTop: 0,
                    }}
                  >
                    {formData.teamMembers?.length > 0 ? (
                      formData.teamMembers.map((member, index) => (
                        <li key={member.id} style={{ marginBottom: "8px" }}>
                          <b>{index + 1}:</b> <b>Name:</b>{" "}
                          {member.name || "None"}, <b>Experience:</b>{" "}
                          {member.experience || "None"}
                          <br />
                          <b>Role:</b>{" "}
                          {Array.isArray(member.role)
                            ? member.role.join(", ")
                            : member.role || "None"}
                        </li>
                      ))
                    ) : (
                      <li>No team members added.</li>
                    )}
                  </ul>
                </Typography>
              </>
            )}
          </Box>

          {/* Services Section */}
          <Box
            sx={{
              transition:
                "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
              overflow: "hidden",
              maxHeight:
                isSignIn &&
                formData &&
                Array.isArray(formData.services) &&
                formData.services.length > 0 &&
                (!isMobile || isExpanded)
                  ? "500px"
                  : "0px",
              opacity:
                isSignIn &&
                formData &&
                Array.isArray(formData.services) &&
                formData.services.length > 0 &&
                (!isMobile || isExpanded)
                  ? 1
                  : 0,
            }}
          >
            {isSignIn &&
              formData &&
              Array.isArray(formData.services) &&
              formData.services.length > 0 && (
                <>
                  <Typography
                    variant="h6"
                    sx={{ mb: 0, mt: 2, fontWeight: "bold" }}
                  >
                    Services
                  </Typography>

                  <Box
                    sx={{
                      mb: 2,
                      ml: 1.5,
                      fontSize: 12,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      maxHeight: "300px",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "4px",
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#f1f1f1",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#c1c1c1",
                        borderRadius: "4px",
                        "&:hover": {
                          backgroundColor: "#a8a8a8",
                        },
                      },
                    }}
                  >
                    <ul
                      style={{
                        listStyleType: "none",
                        paddingLeft: 0,
                        marginTop: 0,
                      }}
                    >
                      {formData.services.map((category, categoryIndex) => (
                        <li key={category.id} style={{ marginBottom: "6px" }}>
                          {/* Category Header */}
                          <div
                            style={{
                              padding: "2px 2px",
                              borderRadius: "4px",
                              marginBottom: "1px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              // backgroundColor: "#f8f9fa",
                              // border: "1px solid #e9ecef",
                            }}
                            onClick={() => toggleCategory(category.id)}
                          >
                            <b
                              style={{
                                color: "#000",
                                fontSize: "13px",
                                fontWeight: "bold",
                              }}
                            >
                              {categoryIndex + 1}.{" "}
                              {category.name || "Unnamed Category"}
                            </b>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "#666",
                                transition: "transform 0.2s",
                                transform: expandedCategories[category.id]
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              }}
                            >
                              <ChevronDown size={16} />
                            </Box>
                          </div>

                          {/* Services under this category */}
                          <Collapse in={expandedCategories[category.id]} timeout="auto">
                            {category.services &&
                              category.services.length > 0 && (
                                <ul
                                  style={{
                                    listStyleType: "none",
                                    paddingLeft: "12px",
                                    marginTop: "2px",
                                    marginBottom: "8px",
                                  }}
                                >
                                  {category.services.map(
                                    (service, serviceIndex) => (
                                      <li
                                        key={service.id}
                                        style={{
                                          marginBottom: "10px",
                                          // borderBottom: "1px solid #e8e8e8",
                                          paddingBottom: "8px",
                                          // backgroundColor: "#fafafa",
                                          padding: "18px",
                                          borderRadius: "4px",
                                          marginTop: "0px",
                                        }}
                                      >
                                        <b
                                          style={{
                                            marginLeft: -4,
                                            color: "#333",
                                          }}
                                        >
                                          {serviceIndex + 1}.{" "}
                                          {service.name || "Unnamed Service"}
                                        </b>
                                        <br />
                                        <div
                                          style={{
                                            marginLeft: 8,
                                            marginTop: "4px",
                                          }}
                                        >
                                          {service.description && (
                                            <>
                                              <b style={{ color: "#333" }}>
                                                Description:
                                              </b>{" "}
                                              {service.description} <br />
                                            </>
                                          )}
                                          <b style={{ color: "#333" }}>Price:</b>{" "}
                                          ₹{service.price || "N/A"} <br />
                                          <b style={{ color: "#333" }}>
                                            Duration:
                                          </b>{" "}
                                          {service.duration}{" "}
                                          {service.durationType || "N/A"} <br />
                                          <b style={{ color: "#333" }}>
                                            Assigned Staff:
                                          </b>{" "}
                                          {service.staff?.length > 0
                                            ? service.staff.join(", ")
                                            : "None"}{" "}
                                          <br />
                                        </div>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                          </Collapse>

                          {/* Empty category message */}
                          {/* {(!category.services || category.services.length === 0) && (
                          <div style={{ 
                            marginLeft: '12px', 
                            fontSize: '11px', 
                            color: '#888',
                            fontStyle: 'italic'
                          }}>
                            No services added to this category yet.
                          </div>
                        )} */}
                        </li>
                      ))}
                    </ul>
                  </Box>
                </>
              )}
          </Box>

          {/* Business Hours Section */}
          <Box
            sx={{
              transition:
                "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
              overflow: "hidden",
              maxHeight:
                isSignIn &&
                formData &&
                formData.businessHours &&
                (!isMobile || isExpanded)
                  ? "600px"
                  : "0px",
              opacity:
                isSignIn &&
                formData &&
                formData.businessHours &&
                (!isMobile || isExpanded)
                  ? 1
                  : 0,
            }}
          >
            {isSignIn && formData && formData.businessHours && (
              <>
                <Typography
                  variant="h6"
                  sx={{ mb: 0, mt: 2, fontWeight: "bold" }}
                >
                  Business Hours
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    ml: 1.5,
                    fontSize: 12,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {/* <b>Schedule Type:</b> {
                    formData.businessHours.scheduleType === "selected_hours" ? "Open for selected hours" :
                    formData.businessHours.scheduleType === "appointment" ? "By Appointment only" :
                    formData.businessHours.scheduleType === "always_open" ? "Always Open" : "Not Set"
                  } <br /> */}
                  {/* <b>Weekly Schedule:</b> */}
                  <ul
                    style={{
                      listStyleType: "none",
                      paddingLeft: 0,
                      marginTop: 8,
                    }}
                  >
                    {[
                      { id: 1, name: "Monday" },
                      { id: 2, name: "Tuesday" },
                      { id: 3, name: "Wednesday" },
                      { id: 4, name: "Thursday" },
                      { id: 5, name: "Friday" },
                      { id: 6, name: "Saturday" },
                      { id: 7, name: "Sunday" },
                    ].map((day) => {
                      const dayStatus =
                        formData.businessHours.daysStatus?.[day.id];
                      const getDisplayTime = () => {
                        if (!dayStatus || !dayStatus.isOpen) return "Closed";

                        if (
                          formData.businessHours.scheduleType ===
                          "selected_hours"
                        ) {
                          return `${dayStatus.startTime} ${dayStatus.startMeridian} - ${dayStatus.endTime} ${dayStatus.endMeridian}`;
                        } else if (
                          formData.businessHours.scheduleType === "appointment"
                        ) {
                          return "By appointments only";
                        } else if (
                          formData.businessHours.scheduleType === "always_open"
                        ) {
                          return "Open 24 hours";
                        }
                        return "Closed";
                      };

                      return (
                        <li
                          key={day.id}
                          style={{
                            marginBottom: "4px",
                            // borderBottom: "1px solid #e0e0e0",
                            paddingBottom: "6px",
                            fontSize: "11px",
                          }}
                        >
                          <b style={{ marginLeft: -10 }}>{day.name}:</b>{" "}
                          {getDisplayTime()}
                        </li>
                      );
                    })}
                  </ul>
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Scroll Buttons  */}
      {/* {isOverflowing && (
        <Box sx={{ display: 'flex', flexDirection: 'column-reverse', marginRight: '-31px', padding: '8px' }}>
          <Button onClick={() => handleScroll(1)} sx={{ color: canScrollDown ? 'black' : 'gray', fontWeight: 'bold', minWidth: '0px' }} disabled={!canScrollDown}>
            <ChevronDown />
          </Button>
          <Button onClick={() => handleScroll(-1)} sx={{ color: canScrollUp ? 'black' : 'gray', fontWeight: 'bold', minWidth: '0px' }} disabled={!canScrollUp}>
            <ChevronUp />
          </Button>
        </Box>
      )} */}
    </Box>
  );
};

export default LeftPanel;
