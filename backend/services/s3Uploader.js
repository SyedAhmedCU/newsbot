require('dotenv').config();
const AWS = require('aws-sdk');
const bucket = process.env.S3_BUCKET;

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

const uploadJsonToS3 = async (s3Key, newsData) => {
  try {
    if (!newsData || newsData.length === 0) {
      throw new Error('❌ No news data provided'); 
    }
    // Convert to JSON buffer
    const jsonBuffer = Buffer.from(JSON.stringify(newsData, null, 2));
    console.log(bucket, s3Key);
    // Upload to S3
    const uploadParams = {
      Bucket: bucket,
      Key: s3Key,
      Body: jsonBuffer,
      ContentType: 'application/json',
    };

    const result = await s3.upload(uploadParams).promise();
    console.log(`✅ Uploaded to S3: ${result.Location}`);
    return result.Location;

  } catch (error) {
    console.error('❌ Failed to upload news to S3:', error.message);
    throw error;
  }
};

module.exports = uploadJsonToS3;
