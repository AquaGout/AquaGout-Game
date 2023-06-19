const mode = process.env.NODE_ENV === "production" ? "production" : "development";

export default {
  root: "src",
  base: "/AquaGout-Game",
  mode,
  publicDir: "../public",
  build: {
    outDir: "../dist",
    assetsDir: "./"
  }
};
