import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/note";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async(req, res,next) => {
    const authenticatedUserId = req.session.userId;
    
    try {
        assertIsDefined(authenticatedUserId);

        const notes = await NoteModel.find({userId: authenticatedUserId}).exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
    
}

export const getNote: RequestHandler = async(req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, 'Invalid note ID');
        }
        const note = await NoteModel.findById(noteId).exec();

        //when the id is valid but there is no note of that id
        if (!note){
            throw createHttpError(404,'Note not found');
        }

        if(!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note!");
        }
        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}

interface createNoteBody{
    title?: string,
    text?: string
}

export const createNote: RequestHandler<unknown, unknown, createNoteBody, unknown> = async(req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.session.userId;
    try {
        assertIsDefined(authenticatedUserId);

        if(!title){
            //400 means bad request for eg. when an argument is missing like in this case
            throw createHttpError(400, 'Note must have a title');
        }
        const newNote = await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            text: text,
        });

        //201 is the HTTP status for new resource created
        res.status(201).json(newNote);
    } catch (error) {
        next(error);
    }
}

//updating notes:

interface updateNoteParams{
    noteId: string
}

interface updateNoteBody{
    title?: string,
    text?: string
}

export const updateNote: RequestHandler< updateNoteParams, unknown, updateNoteBody, unknown > = async(req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, 'Invalid note ID');
        }
        if(!newTitle){
            //400 means bad request for eg. when an argument is missing like in this case
            throw createHttpError(400, 'Note must have a title');
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note){
            throw createHttpError(404,'Note not found');
        }

        if(!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note!");
        }
        
        note.title = newTitle;
        note.text = newText;

        //.save saves the changes that we make to the note
        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
}

//deleting notes:

export const deleteNote: RequestHandler = async(req,res,next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);
        
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, 'Invalid note ID');
        }
        const note = await NoteModel.findById(noteId).exec();

        if (!note){
            throw createHttpError(404,'Note not found');
        }
        
        if(!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "You cannot access this note!");
        }

        await note.deleteOne();
        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}