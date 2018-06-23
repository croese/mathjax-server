const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

module.exports = {
  storeImage : function(data) {
    return new Promise((resolve, reject) => {
      // configuring the AWS environment
      AWS.config.update({
        accessKeyId : process.env.AWS_ACCESS_KEY,
        secretAccessKey : process.env.AWS_SECRET_KEY
      });

      var s3 = new AWS.S3();

      const id = uuidv4();

      // configuring parameters
      var params = {
        ACL : 'public-read',
        Bucket : process.env.S3_BUCKET_NAME,
        Body : data,
        Key : `${id}.png`
      };

      s3.upload(params, function(err, data) {
        // handle error
        if (err) {
          reject(err);
        } else if (data) {
          resolve(data.Location);
        }
      });
    });
  }
};
