import app from "./app";
import dbConnect from "./config/db.config";
import envVars from "./config/env.config";

app.listen(envVars.PORT, () => {
  console.log("Server is running on port 5000");
});

dbConnect();
