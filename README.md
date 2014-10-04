QingyingptAPI
=============
23333333333333333333333

API 23333


the Goal
------------
Just touch Qingying PT easier and more automatic !


the Configure and Use
-----------
Firstly, `QingyingptAPI = require('./')` and 
```javascript
var qpt = new QingyingptAPI({
        addr : 'pt.hit.edu.cn',
        port : 80,
        cookie : {
                id : 'your hit_UID',
                pw : 'your hit_passhash'
        }
});
```
Then you can call `qpt.upload(filePath, arguments, callback)` to upload a torrent.

the TODOs
-----------
Everything....
