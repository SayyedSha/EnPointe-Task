import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function uploadFile(fileBuffer, fileName, mimetype, folder) {
  const key = folder ? `${folder}/${fileName}` : fileName;
  // console.log(region)
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: key,
    ContentType: mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  // console.log("uploadParams:",uploadParams);
}

function deleteFile(folder, fileName) {
  const key = folder ? `${folder}/${fileName}` : fileName;

  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

async function getObjectSignedUrl(folder, key) {
  // Construct the full key including the folder name
  const fullKey = folder ? `${folder}/${key}` : key;

  const params = {
    Bucket: bucketName,
    Key: fullKey,
  };

  // Generate a signed URL with an expiration time (e.g., 1 hour)
  const signedUrl = await getSignedUrl(s3Client, new GetObjectCommand(params), {
    expiresIn: 86400,
  });

  return signedUrl;
}

export { uploadFile, deleteFile, getObjectSignedUrl };
