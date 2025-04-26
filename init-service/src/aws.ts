import { S3 } from "aws-sdk"

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT
})

export async function copyToS3(saurcePrefix:string, destinationPrefix:string, continuationToken?:string){
    try{
        const listedObject =await s3.listObjectsV2({
            Bucket : process.env.S3_BUCKET || "replit",
            Prefix : saurcePrefix,
            ContinuationToken : continuationToken        
        }).promise()
    
        if(!listedObject.Contents || listedObject.Contents.length === 0){
            return;
        }
        
        await Promise.all(listedObject.Contents.map(async(Object)=>{
            if(!Object.Key) return ;
            const destinationKey = Object.Key.replace(saurcePrefix, destinationPrefix)
            await s3.copyObject({
                Bucket : process.env.S3_BUCKET || "replit",
                CopySource : `${process.env.S3_BUCKET}/${Object.Key}`,
                Key : destinationKey
            }).promise();
        }))

        if(listedObject.IsTruncated){
           await copyToS3(saurcePrefix, destinationPrefix, listedObject.NextContinuationToken)
        }
    }catch(error){
        console.log(error);
        
    }

}

export const saveToS3=async(key:string, filePath:string, content:string)=>{
    await s3.putObject({
        Bucket : process.env.S3_BUCKET || "replit",
        Key : `${key}/${filePath}`,
        Body : content
    }).promise();
}