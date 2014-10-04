/* just a example */
var QingyingptAPI = require('./');
var fs = require('fs');

var qpt = new QingyingptAPI({
        addr : 'pt.hit.edu.cn',
        port : 80,
        cookie : {
                id : 'your hit_uid',
                pw : 'your hit_passhash'
        }
});


qpt.upload(args.torrent, { name : "just for test --- this is the the title",
                        small_descr : "just for test --- this is the the subtitle",
                        descr : "just for test --- this is the description",
                        cat : "402",// category  - TVseries
                        sou : "25" }, function(err, result){
              if(err) throw err;
              console.log(result);
        });
});
