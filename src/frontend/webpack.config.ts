import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

type Configuration = WebpackConfiguration & WebpackDevServerConfiguration;

const configuration: (environment: any, flags: any) => Configuration = (
  _,
  flags
) => {
  const isProduction = flags?.mode === "production";

  return {
    devServer: {
      disableHostCheck: true,
      historyApiFallback: true,
    },

    devtool: "source-map",

    entry: "./src/Application.tsx",

    mode: "development",

    module: {
      rules: [
        {
          test: /\.(c|le)ss$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          exclude: /node_modules/,
          test: /\.tsx?$/,
          use: ["ts-loader"],
        },
      ],
    },

    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
      publicPath: isProduction ? process.env.PATH_TO_SERVE : "/",
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html",
      }),
    ],

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"],
    },

    watchOptions: {
      aggregateTimeout: 1000,
      poll: 1000,
    },
  };
};

export default configuration;
