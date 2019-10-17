const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
    entry : {
        'neo4j-data' : './src/index.js',
        'neo4j-data.min' : './src/index.js'
    },
    mode : 'none',
    output : {
        filename : '[name].js',
        library : 'neo4j-data',
        libraryTarget : 'umd',
        libraryExport : 'default'
    },
    optimization : {
        minimize : true,
        minimizer : [
            new TerserPlugin({
                include : /\.min\.js$/
            })
        ]
    }


}