module.exports = {
    apps: [
      {
        name: "go-scroll-opros",
        script: "yarn",
        args: "start",
        watch: true,
        mode: "fork",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };