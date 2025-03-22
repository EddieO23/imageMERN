import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Image from '../Model/ImageModel.js';

const imageRoute = Router();

imageRoute.post('/upload', async (req, res) => {
  try {
    const { image, title } = req.body;
    if (!image) {
      return res.status(400).json({ msg: 'img not found' });
    }

    const result = await cloudinary.uploader.upload_large(image);

    console.log(result);

    await new Image({
      title,
      imageUrl: result.secure_url,
      public_Id: result.public_id,
    }).save();

    res.status(200).json({msg: 'img succesfully uploaded'})
  } catch (error) {
    res.status(500).json({msg: error    })  
  }
});

export default imageRoute;
