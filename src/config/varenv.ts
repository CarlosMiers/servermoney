const config = {
    port: process.env.PORT || 3000,
    basepath: process.env.BASEPATH || "",
    secretkey: process.env.SECRET_KEY || "",
    db: {
        host: process.env.DB_HOST || "",
        user: process.env.DB_USER || "",
        pass: process.env.DB_PASSWORD || "",
        db: process.env.DB_DATABASE || ""
    }
};

export default config;