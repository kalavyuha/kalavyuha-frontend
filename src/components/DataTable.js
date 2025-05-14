import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Home", "API Documentation", "Blog", "Contact Us"),
  createData("Top picks", "Privacy & Cookie Policy", "Instagram", "About"),
  createData("Plan & Sign up", "Terms of Service", "Facebook", "Need Help?"),
  createData("Enterprise", "Accessibility Statement", "Twitter", " "),
  createData("Help & Support", "Uptime", " ", " "),
  createData(" ", "Imprint", " ", " "),
];

export default function BasicTable() {
  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <Table
        sx={{
          minWidth: 650,

          "& .MuiTableCell-root": {
            borderBottom: "none",
            padding: "4px",
          },
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", padding: "0px" }}>
              Quick Links
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", padding: "0px" }}> </TableCell>
            <TableCell sx={{ fontWeight: "bold", padding: "0px" }}>
              Follow
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", padding: "0px" }} align="left">
              Company
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row" sx={{ padding: "0px" }}>
                {row.name}
              </TableCell>
              <TableCell align="left" sx={{ padding: "0px" }}>
                {row.calories}
              </TableCell>
              <TableCell align="left" sx={{ padding: "0px" }}>
                {row.fat}
              </TableCell>
              <TableCell align="left" sx={{ padding: "0px" }}>
                {row.carbs}
              </TableCell>
              <TableCell align="left" sx={{ padding: "0px" }}>
                {row.protein}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
