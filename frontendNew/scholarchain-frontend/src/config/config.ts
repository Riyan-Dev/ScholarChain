
const config = {
    fastApi: {
      baseUrl: process.env.FASTAPI_BASE_URL || "http://localhost:8000",
      port: parseInt(process.env.FASTAPI_PORT || "8000", 10), // Parse as integer
    },
    jwtSecret: process.env.JWT_SECRET || "scholarchain",
  };
  
  export default config;