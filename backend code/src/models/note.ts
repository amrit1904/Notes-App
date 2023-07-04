import { InferSchemaType, model, Schema } from "mongoose";

//Think of a schema as a blueprint or a set of rules that defines the structure and properties of an object. It specifies what properties the object should have, what types those properties should be, and any additional constraints or conditions that need to be met.
//this code creates a scehma for notes which has title,text and timestamp. we create a type for typescript and then export the model so that we can use it

const noteSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    text: {type: String},
    }, {timestamps: true});

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);

