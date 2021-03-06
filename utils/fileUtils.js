var fs = require('fs');

const addAndPublishFolderToIPFS = (ipfs) => {
  ipfs.addFromFs('./files', {recursive: true}, (err, r) => {
    if (err) {
      return console.log('Error: ', err);
    }
    console.log('Add result: ', r);
    const parentHash = r.find(fileData => fileData.path === 'files').hash;
    ipfs.name.publish('/ipfs/' + parentHash, {key: process.env.IPFS_FILES_KEY}, (e, r) => {
      console.log('Parent hash: ', parentHash);
      console.log('Error: ', e);
      console.log('Publish result: ', r);
    });
  });
};

export const saveFile = (file) => {
  fs.writeFile('./temp_files', file, {}, () => {});
};

export const approveFile = (ipfs, hash) => {
  ipfs.get('/ipfs/' + hash, function (err, files) {
    if (err) {
      return console.log('Error: ', err);
    }
    files.forEach((file) => {
      console.log('File path: ', file.path);
      fs.writeFile("./files/" + hash, file.content, function(err) {
        if(err) {
            return console.log('Error: ', err);
        }
        console.log("The file was saved!");
        addAndPublishFolderToIPFS(ipfs);
      }); 
    })
  });
}

export const deleteFile = (ipfs, hash) => {
  fs.unlink('./files/' + hash, (err) => {
    if(err) {
      return console.log('Error: ', err);
    }
    console.log("The file was removed!");
    addAndPublishFolderToIPFS(ipfs);
  })
}