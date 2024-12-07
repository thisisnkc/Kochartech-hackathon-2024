import React from "react";
import { Box, Grid, Card, CardContent, Typography, Avatar, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import GroupIcon from "@mui/icons-material/Group";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const Reports = () => {
  // Dummy Data
  const workerSummary = [
    { title: "Total Workers", value: 150, icon: <GroupIcon fontSize="large" />, color: "#3f51b5" },
    { title: "Avg Productivity", value: "87%", icon: <AssessmentIcon fontSize="large" />, color: "#00C49F" },
    { title: "Attendance Rate", value: "92%", icon: <EventAvailableIcon fontSize="large" />, color: "#FFBB28" },
    { title: "Projects Completed", value: 230, icon: <DoneAllIcon fontSize="large" />, color: "#FF8042" },
  ];

  const workerDistribution = [
    { name: "Engineering", value: 40 },
    { name: "Marketing", value: 30 },
    { name: "HR", value: 20 },
    { name: "Finance", value: 10 },
  ];

  const monthlyProductivity = [
    { month: "Jan", productivity: 80 },
    { month: "Feb", productivity: 85 },
    { month: "Mar", productivity: 78 },
    { month: "Apr", productivity: 90 },
    { month: "May", productivity: 88 },
  ];

  const performanceTrend = [
    { week: "Week 1", performance: 80 },
    { week: "Week 2", performance: 85 },
    { week: "Week 3", performance: 82 },
    { week: "Week 4", performance: 88 },
  ];

  const detailedData = [
    { id: 1, name: "Alice", department: "Engineering", productivity: "High", status: "Active" },
    { id: 2, name: "Bob", department: "Marketing", productivity: "Medium", status: "Inactive" },
    { id: 3, name: "Charlie", department: "HR", productivity: "Low", status: "Active" },
    { id: 4, name: "Diana", department: "Finance", productivity: "High", status: "Active" },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
        Worker Analysis Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {workerSummary.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2, backgroundColor: item.color + "15" }}>
              <Avatar sx={{ bgcolor: item.color, mr: 2 }}>{item.icon}</Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: item.color }}>
                  {item.title}
                </Typography>
                <Typography variant="h6">{item.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Worker Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={workerDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {workerDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Monthly Productivity
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyProductivity}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="productivity" fill="#3f51b5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Line Chart */}
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Performance Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrend}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="performance" stroke="#00C49F" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Data Table */}
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Detailed Worker Data
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Productivity</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {detailedData.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell>{worker.id}</TableCell>
                    <TableCell>{worker.name}</TableCell>
                    <TableCell>{worker.department}</TableCell>
                    <TableCell>{worker.productivity}</TableCell>
                    <TableCell>{worker.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Reports;
