import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  forcePathStyle: true,
  region: process.env.SUPABASE_STORAGE_REGION!,
  endpoint: process.env.SUPABASE_STORAGE_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.SUPABASE_STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY!,
  },
});

export async function uploadProductImage(
  file: File,
  tenantId: string
): Promise<string> {
  const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
  const fileKey = `uploads/${tenantId}/${fileName}`;
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "products";

  // Convert File to Buffer/ArrayBuffer for Node.js environment if needed,
  // but Server Actions receive FormData which gives us a File object.
  // AWS SDK v3 `PutObjectCommand` accepts Blob, string, Uint8Array, Buffer.

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read", // Request public read access if the bucket allows it
      })
    );

    // IMPORTANT:
    // If the bucket is public, we can construct the URL manually.
    // If it's private, we would need to generate a signed URL.
    // Assuming Public Bucket as per "Retorne a URL pública" requirement.

    // Construct Public URL
    // Format: https://[project_id].supabase.co/storage/v1/object/public/[bucket]/[key]
    const projectId =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1].split(".")[0];
    const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${bucketName}/${fileKey}`;

    return publicUrl;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Failed to upload image to storage");
  }
}
