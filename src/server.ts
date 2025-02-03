import mongoose from "mongoose";
import { environmentVariables } from "./configurations/env.config.js";
import { app } from "./app.js";

(async () => {
  mongoose
    .connect(environmentVariables.DATABASE_CONNECTION_STRING as string)
    // .connect("mongodb://localhost:27017/assignmentFour")
    .then(() => {
      console.log("database connected successfully");
      const databaseName = mongoose.connection.name; // This will give the database name
      console.log(`Connected to the ${databaseName} database successfully.`);
      app.listen(environmentVariables.PORT, () => {
        console.log(
          `The server is running on port ${environmentVariables.PORT}`
        );
      });
    })
    .catch((error) => {
      console.log(
        "database connection failed and hence server also failed to start."
      );
    });
})();
