import mongoose from "mongoose";

const {Schema} = mongoose

const ImageSchema = new Schema({
  title: String,
  imageUrl: String,
  public_Id: String
}) 

const Image = mongoose.model('ImageCollection', ImageSchema)

export default Image
