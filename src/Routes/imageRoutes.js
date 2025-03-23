import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Image from '../../Model/ImageModel.js';

const imageRoute = Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a new image
 *     tags: [images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image was successfully uploaded
 *       400:
 *         description: Image was not provided
 *       500:
 *         description: Server Error
 */

imageRoute.post('/upload', async (req, res) => {
  try {
    const { image, title } = req.body;

    if (!image) {
      return res.status(400).json({ msg: 'img not found' });
    }

    if(!image.startsWith("data:image/jpeg;base64,")){
      return res.status(400).json({ msg: 'Invalid base64 image provided' });
    }


    const result = await cloudinary.uploader.upload_large(image);

    console.log(result);

    await new Image({
      title,
      imageUrl: result.secure_url,
      public_Id: result.public_id,
    }).save();

    res.status(200).json({ msg: 'img succesfully uploaded' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

/** 
 * @swagger
 * /api/allImages:
 *   get:
 *     summary: Get all images
 *     tags: [images]
 *     responses: 
 *       200:
 *         description: A list of of all images
 *       404:
 *         description: No images found
 *       500:
 *         description: Server error
 * 
 */

imageRoute.get('/allImages', async (req, res) => {
  try {
    const allImages = await Image.find();

    if (!allImages.length) {
      return res.status(404).json({ msg: 'no images found' });
    }

    res.status(200).json(allImages);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

/**
 * @swagger
 * /api/image/{id}:
 *   put:
 *     summary: Update image title
 *     tags: [images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: the image id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newTitle:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image title updated successfully
 *       400:
 *         description: Invalid image id
 *       500:
 *         description: Server Error
 *    
 */

imageRoute.put('/image/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const { newTitle } = req.body;

    const updatedImage = await Image.findByIdAndUpdate(
      id,
      { title: newTitle },
      { new: true }
    );

    if (updatedImage === null) {
      return res.status(404).json({ msg: 'image not found' });
    }

    res.status(200).json({ msg: 'image title updated' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

/**
 * @swagger
 * /api/image/{id}:
 *   delete:
 *     summary: Delete an image
 *     tags: [images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the image to be deleted
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server Error
 */

imageRoute.delete('/image/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deletedImage = await Image.findByIdAndDelete(id);

    if (deletedImage === null) {
      return res.status(404).json({ msg: 'img not found' });
    }

    await cloudinary.uploader.destroy(deletedImage.public_Id);

    res.status(200).json({ msg: 'image deleted succesfully' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

export default imageRoute;
