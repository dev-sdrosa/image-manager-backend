export const config = {
    db: {
      // entities: [`${__dirname}/../../entity/**/*.entity.{js,ts}`],
      // migrations: [`${__dirname}/../../migration/**/*.entity.{js,ts}`],
      // subscribers: [`${__dirname}/../../subscriber/**/*.{js,ts}`],
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  };