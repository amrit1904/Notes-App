import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected");
        //port! tells compiler that port will always have a value
        app.listen(port, () => {
            console.log("server is running on port " + port);
        });
    })
    .catch(console.error);
