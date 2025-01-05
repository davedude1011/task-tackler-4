import "./src/env.js";  // Ensure env.js is correctly setting up environment variables

const config = {
  reactStrictMode: true, // Enables strict mode for React
  /**
     * @param {any} config
     */
  webpack(config) {
    // Custom webpack configuration here (if needed)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
};

export default config;
