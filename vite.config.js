const config = {
  outDir: "../wwwroot/",
  proxy: {
    "/api": {
      target: "https://localhost:4000/api",
      changeOrigin: true,
      secure: false,
      ws: true,
    },
  },
};

export default config;
