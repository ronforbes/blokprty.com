/*import * as express from "express"
import * as http from "http"

let app = express();
let server = require('http').Server(app);

app.use('/',express.static(__dirname + '/bin'));
app.use('/js',express.static(__dirname + '/bin/js'));
app.use('/assets',express.static(__dirname + '/bin/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/bin/index.html');
});

server.listen(process.env.PORT || 3000, function() {
    console.log('Listening on ' + server.address().port);
});*/