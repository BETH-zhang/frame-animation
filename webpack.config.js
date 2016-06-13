/**********************************************
 * created by beth on 2016年6月13日
 * placeholder
 **********************************************/
 module.exports = {
 	entry: {
 		animation: './src/animation.js'
 	},
 	output: {
 		path: __dirname + '/build',
 		filename: '[name].js',
 		library: 'animation',
 		libraryTarget: 'umd'
 	}
 }