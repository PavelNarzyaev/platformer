const path = require("path");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const pj = require(path.resolve(__dirname, "package.json"));

module.exports = env => {
	const outFolder = "./out";
	const sourceFolder = "./src";
	const assetsFolder = "./assets";
	
	const envRelease = !!(env && env["release"]);
	const envServer = !!(env && env["server"]);
	
	const config = {
		cache: true,
		mode: envRelease ? "production" : "development",
		entry: {
			main: sourceFolder + "/Main.ts",
			vendor: [
				"babel-polyfill",
			]
		},
		externals: {
			PIXI: "pixi.js"
		},
		output: {
			path: path.resolve(__dirname, outFolder),
			filename: "[name].js",
			chunkFilename: "[chunkhash].js",
			library: "home"
		},
		devtool: envRelease ? "(none)" : "inline-source-map",
		module: {
			rules: [{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [{
					loader: "babel-loader",
					options: {
						"presets": [
							"env"
						]
					}
				}, {
					loader: "ts-loader"
				}]
			}, {
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: "babel-loader",
					options: {
						"presets": [
							"env"
						]
					}
				}]
			}]
		},
		resolve: {
			extensions: [".ts", ".js"],
		},
	};
	
	const plugins = [];
	
	plugins.push(
		new webpack["EnvironmentPlugin"]({
			PROJECT_NAME: pj.name,
			PROJECT_VERSION: pj.version,
			PROJECT_AUTHOR: pj.author,
			RELEASE: envRelease,
			LOCAL: !envServer,
		})
	);

	if (!envServer) {
		plugins.push(
			new CleanWebpackPlugin(
				outFolder,
				{
					verbose: false,
				}
			)
		);
	}

	plugins.push(
		new CopyWebpackPlugin(
		[
			{from:assetsFolder + "/style.css"},
			{from:assetsFolder + "/favicon.ico"},
			{from:assetsFolder + "/img/files", to:"img", toType:"dir"},
			{from:assetsFolder + "/sounds/files", to: "sounds", toType: "dir"},
		],
		{debug: "debug"})
	);

	plugins.push(
		new HtmlWebpackPlugin({
			templateParameters: {
				"title": pj.name
			},
			filename: "index.html",
			template: assetsFolder + "/default.html",
			inject: false,
		})
	);

	if (!envRelease) {
		plugins.push(
			new CircularDependencyPlugin({
				entry: "src",
				exclude: /a\.js|node_modules/,
				cwd: process.cwd(),
			})
		);
	}

	if (!envServer) {
		let params = {};
		params["host"] = "localhost";
		params["port"] = 3000;
		params["server"] = {baseDir: [outFolder]};
		plugins.push(new BrowserSyncPlugin(params));
	}
	
	config.plugins = plugins;
	return config;
};
