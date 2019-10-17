if(process.env.NODE_ENV == 'production'){
    module.exports = require('./dist/neo4j-data.min.js')
}else{
    module.exports = require('./dist/neo4j-data.js')
}