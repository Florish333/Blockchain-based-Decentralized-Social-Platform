import React from 'react';
import { retrieveAllFiles } from './web3Storage';
let contents=await retrieveAllFiles()

for(const _content of contents){
  console.log("文件内容是",_content);

}
const App=()=>{
        return(
            <div>{contents}</div>
        )
    }
export default App;