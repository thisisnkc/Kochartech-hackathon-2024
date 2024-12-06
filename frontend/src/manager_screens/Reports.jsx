import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const Reports = () => {
  const reports = [
    { title: "Weekly Report", description: "Overview of weekly tasks." },
    { title: "Monthly Report", description: "Detailed analysis of monthly progress." },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Reports
      </Typography>
      {reports.map((report, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              {report.title}
            </Typography>
            <Typography>{report.description}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Reports;
