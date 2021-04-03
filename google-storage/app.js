/**
 * This file includes function which reads object/file from GCS.
 *
 * @author Chetan Patil
 * @version 1.0.0
 */

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

/**
 * This function reads/gets files from GCS bucket
 * and resolves data read from stream
 *
 * @return file data in "string" format
 *
 */
const readFile = async () => {
  const bucketName = 'my-bucket';
  const fileName = 'my-file.json';

  const file = await storage.bucket(bucketName).file(fileName);

  return new Promise((resolve, reject) => {
    // Create readStream from above file
    const readStream = file.createReadStream();

    let data = '';
    readStream.on('data', d => {
      data += d;
    }).on('end', () => {
      console.log(`file data: ${data}`);
      resolve(data);
    }).on('error', error => {
      const errorMsg = `Error occurred in reading stream data: ${error} - "${bucketName}/${fileName}"`;
      console.log(errorMsg);
      reject(errorMsg);
    });
  });
};

module.exports = {
  readFile,
};
