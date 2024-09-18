//import { create } from '@web3-storage/w3up-client'
import {create} from 'ipfs-http-client';
import * as multihashes from 'multihashes';

async function makeFileObjects (contents) {
const files = [
  new File([contents[0]], 'post/title.txt'),new File([contents[1]], 'post/content.txt'),new File([contents[2]], 'post/fee.txt')
  //new File([blob], 'hello.json')
]
    return files;
}
//读取图片url，并转换为file
async function makeImage (image) {
  let response = await fetch(image);
  let blob = await response.blob();
  let file = new File([blob], 'image.jpg', {type: blob.type});
  return file;
}

//储存文本函数，输入参数为内容，返回值为该内容的CID
async function storeFile (content) {
  const ipfs = create({ url: "http://127.0.0.1:5001/api/v0" });
  let file = new File([content],'content.txt');
  var CID =await ipfs.add(file);
  //CID = multihashes.toB58String(CID);
  console.log('存储成功了：', CID.path);
  return CID.path;
}

//储存图像函数，输入参数为内容，返回值为该内容的CID
async function storeImage (image) {
  const ipfs = create({ url: "http://127.0.0.1:5001/api/v0" });
  let file = await makeImage(image[0].thumbUrl);
  var CID =await ipfs.add(file);
  return CID.path;
}

//储存函数，输入参数为内容，返回值为该内容的CID
async function storeFiles (contents) {
  const ipfs = create({ url: "http://127.0.0.1:5001/api/v0" });
  let files = await makeFileObjects(contents);
  let cids = [];
  var cid=''
  for await(cid of ipfs.addAll(files,{ wrapWithDirectory: true })){
    console.log(cid);
    cids.push(cid);
  }
  var CID = cids[3].cid['/'];
  CID = multihashes.toB58String(CID);
  console.log('存储成功了：', ipfs.ls(CID));
  return CID;
}

async function retrieveText (cid) {
  const ipfs = create({ url: "http://127.0.0.1:5001/api/v0" });
  let content = '';
  for await (content of ipfs.cat(cid)) {
    ;
  }
  console.log('获取到了：',content);
  const decoder = new TextDecoder();
  const text = decoder.decode(content);
  return text;
}

//单独取回某个文件的函数，输入参数为文件的CID，返回值为文件内容
async function retrieveFiles (cid) {
  const ipfs = create({ url: "http://127.0.0.1:5001/api/v0" });
  let content = '';
  let contents = [];
  for await(content of ipfs.ls(cid)){
    console.log('获取到的是：',content);
    contents.push(content);
  }
  console.log('全部是：',contents);
  for await (content of ipfs.cat(contents[0].name)) {
    ;
  }
  const decoder = new TextDecoder();
  const text = decoder.decode(content);
  
  return text;
}

export {storeFiles, retrieveText, storeFile, storeImage};
