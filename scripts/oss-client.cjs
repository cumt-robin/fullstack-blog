const OSS = require("ali-oss");

const ossClient = new OSS({
    accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: process.env.OSS_REGION,
    authorizationV4: true,
    // yourBucketName填写Bucket名称。
    bucket: process.env.OSS_BUCKET,
    secure: true,
});

module.exports = {
    ossClient,
};
