import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    // unique makes sure that can only be one user with a given username/email
    username: {type: String, required: true, unique: true},
    // select: false ensures that email and password are not returned by default
    email: {type: String, required: true, select: false, unique: true},
    password: {type: String, required: true, select: false},
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);