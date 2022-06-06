import { CloudinaryConfig } from "../config";
import cloudinary from "cloudinary";
export default class Cloudinary {
    /**
     * 
     * @param {typeof CloudinaryConfig} config 
     */
    constructor (config: typeof CloudinaryConfig = CloudinaryConfig) {
        cloudinary.v2.config(config);
    }

    /**
     * Upload image to Cloudinary
     * 
     * @param {string} imagePath images path 
     * @returns image link
     */
    async upload(imagePath: string): Promise<string> {
      try {
        const url = await cloudinary.v2.uploader.upload(imagePath, (err, res) => {
          if (err) console.log(err)
        }).then(res => res.url);

        return url
      } catch {
        return undefined;
      }
    }

    /**
     * Delete image from  cloud
     * 
     * @param {string} publicId asset's public id
     */
    async delete(publicId: string) {
      return await cloudinary.v2.uploader.destroy(publicId);
    }
}

async function createImageUpload() {
    const timestamp = new Date().getTime()
    const signature = cloudinary.v2.utils.api_sign_request(
      {
        timestamp,
      },
      CloudinaryConfig.api_secret
    )
    return { timestamp, signature }
  }