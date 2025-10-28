const { create, globSource } = require('ipfs-http-client');
const fs = require('fs');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// Initialize IPFS client
const ipfs = create({
  host: process.env.IPFS_API_URL || 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_API_KEY}`
    ).toString('base64')}`
  }
});

// Upload file to IPFS
const uploadToIPFS = async (filePath) => {
  try {
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({
      path: path.basename(filePath),
      content: file
    });
    
    return fileAdded.cid.toString();
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new ErrorResponse('Failed to upload file to IPFS', 500);
  }
};

// Upload JSON data to IPFS
const uploadJSONToIPFS = async (data) => {
  try {
    const result = await ipfs.add(JSON.stringify(data));
    return result.cid.toString();
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw new ErrorResponse('Failed to upload data to IPFS', 500);
  }
};

// Get data from IPFS
const getFromIPFS = async (hash) => {
  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(hash)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString();
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new ErrorResponse('Failed to fetch data from IPFS', 500);
  }
};

// Remove file from IPFS (pinning service required)
const removeFromIPFS = async (hash) => {
  try {
    await ipfs.pin.rm(hash);
    return true;
  } catch (error) {
    console.error('Error removing from IPFS:', error);
    throw new ErrorResponse('Failed to remove data from IPFS', 500);
  }
};

module.exports = {
  uploadToIPFS,
  uploadJSONToIPFS,
  getFromIPFS,
  removeFromIPFS
};
