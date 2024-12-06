import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import wm from '../assets/WM.png'
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import '../index.css';


const AdvancedLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [password,setPassword] = useState();
  const [email,setEmail] = useState();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to login");
      }

      const data = await response.json();
      const details =data.existingUser;
      console.log(details);
      localStorage.setItem('userInfo',JSON.stringify(details));
            if(details.role === "MANAGER"){
               await navigate("/dashboard");
            }
            else if(details.role === "WORKER"){
                await navigate('/home');
            }
    //   setMessage(`Welcome, ${data.existingUser.email}`);
    } catch (error) {
    //   setMessage(`Error: ${error.message}`);
    console.log(error);
    }
  
   
  };
  //add task, manage,reports
  /*add task -> form
  manage -> table
  */

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(135deg, #020202, #2575FC)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background Animation */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          zIndex: 1,
        }}
      ></motion.div>

      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={4}
        sx={{ zIndex: 2, padding: 2 }}
      >
        <Grid item xs={12} md={6}>
          {/* Welcome Section */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <img src={wm} alt="" className="logo" />
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontWeight: "bold", textAlign:'center',
                textShadow: "2px 4px 6px rgba(0,0,0,0.2)",
              }}
            >
              Welcome to WorkMax
            </Typography>
            {/* <Typography
              variant="h6"
              sx={{
                color: "#ddd",
                marginTop: 2,
                textShadow: "1px 2px 4px rgba(0,0,0,0.2)",  
              }}
            >
             Work Management Platform 
            </Typography> */}
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Login Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <Card
              sx={{
                padding: 4,
                borderRadius: "35px",
                boxShadow: "0px 15px 30px rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(0, 0, 0, 0.23)",
                color:'#fff'
              }}
            >
              <CardContent>
                {/* <Typography
                  variant="h4"
                  sx={{
                    textAlign: "center",
                    marginBottom: 3,
                    fontWeight: "bold",
                    color: "#6A11CB",
                  }}
                >
                  Login 
                </Typography> */}

                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                > 
                  <TextField
                    label="eamil"
                    variant="outlined"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    borderRadius="50px"
                    className="input-fields"
                  />
                  <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    className="input-fields"
                    borderRadius="50px"
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      className="submitBtn"
                      onClick={handleLogin}
                      disabled={loading}
                      sx={{
                        height: "50px",
                        textTransform: "uppercase",
                        fontSize: "16px",
                        borderRadius:"50px",
                        boxShadow:'none', 
                        color: '#fff',
                      }}
                    >
                      {loading ? "Loading..." : "Sign In"}
                    </Button>
                  </motion.div>
                </Box>
                {/* <Typography
                  variant="body2"
                  sx={{
                    marginTop: 2,
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    style={{
                      color: "#6A11CB",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Sign up
                  </a>
                </Typography> */}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedLoginPage;
