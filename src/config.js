// ========= CORS =========
const allowedOrigins = [
    "http://localhost:3000"
];

export const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("The CORS policy for this site does not allow access from the specified origin."));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    //   allowedHeaders: ["Content-Type", "Authorization"],
    //   credentials: true
};
// ========================
