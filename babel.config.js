module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "prismjs",
      {
        languages: [
          "html",
          "css",
          "javascript",
          "php",
          "dart",
          "bash",
          "nginx",
          "sql",
          "json",
          "jsx"
        ],
        theme: "okaidia"
      }
    ]
  ]
};
