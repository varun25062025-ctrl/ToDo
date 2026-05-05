const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
		new CopyPlugin({
			patterns: [
			  { from: "./node_modules/todomvc-common/base.js", to: "base.js" },
			],
		}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), 
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        // Prevent Terser from removing unused code too aggressively
                        unused: false,
                    },
                    mangle: {
                        // Keep function names to help with debugging
                        keep_fnames: /^(useSensor|DndContext|SortableContext)/,
                    },
                },
            })
        ],
        // Disable module concatenation which can cause issues with @dnd-kit
        concatenateModules: false,
    },
});
