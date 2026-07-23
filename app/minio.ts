import { Client } from "minio";

const endpoint = process.env.MINIO_SERVER_URL || process.env.MINIO_ENDPOINT;
const bucketName = process.env.MINIO_BUCKET || "ortofernandes";

function getClient() {
  if (!endpoint || !process.env.MINIO_ROOT_USER || !process.env.MINIO_ROOT_PASSWORD) throw new Error("MinIO não configurado");
  const url = new URL(endpoint.includes("://") ? endpoint : `http://${endpoint}`);
  return new Client({ endPoint:url.hostname, port:Number(process.env.MINIO_PORT||url.port||(url.protocol==="https:"?443:80)), useSSL:process.env.MINIO_USE_SSL?process.env.MINIO_USE_SSL!=="false":url.protocol==="https:", accessKey:process.env.MINIO_ROOT_USER, secretKey:process.env.MINIO_ROOT_PASSWORD });
}
export async function getMinio(){const client=getClient();if(!(await client.bucketExists(bucketName)))await client.makeBucket(bucketName,process.env.MINIO_REGION||"us-east-1");return {client,bucket:bucketName};}
export function isMinioKey(value:string|null|undefined){return !!value&&value.startsWith("/api/media/");}
export function keyFromMediaUrl(value:string){return decodeURIComponent(value.replace(/^\/api\/media\//,""));}
