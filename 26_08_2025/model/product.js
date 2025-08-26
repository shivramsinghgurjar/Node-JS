import mongoose from "mongoose";

const { Schema, types } = mongoose;

const ImageSchema = new Schema(
    {
        url: {type: String, required: true},
        alt: {type: String, default: "" },
        isPrimary: {type: Boolean, default: false},
    },
    { _id: false}
);

const AttributeSchema = new Schema(
    {
        name: {type: String, requires: true, trim: true},   // e.g., Color
        value: {type: String, required: true, trim: true},  //e.g., Red
        price: {type: Number, default: 0},
    },
    { _id: false }
);