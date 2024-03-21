import  express  from "express";
import mongoose from "mongoose";
import cors from "cors";
import  dotenv  from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";
import path from "path";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js"
import postRoutes from  "./routes/posts.js"
import {createPost} from "./controllers/posts.js"
import userRoutes from "./routes/users.js"
import { verifyToken } from "./middleware/auth.js";
const PORT = process.env.PORT || 6001

const __filename = fileURLToPath(import.meta.url);  // absoulute file path 
const __dirname = path.dirname(__filename);  // directory path from the absolute path

dotenv.config();

const app = express();

app.use(express.json({ limit:"30mb", extended:true }));

app.use(helmet());

app.use(helmet.crossOriginResourcePolicy({ policy:"cross-origin" }));

app.use(morgan("common"));

app.use(cors());

app.use("/assets",express.static(path.join(__dirname,'public/assets')));


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");

    },

    filename:function(req,file,cb){

        cb(null,file.originalname)

    }


})

const upload = multer({ storage });
//

// ROUTES WITH FILES
app.post("/auth/register",upload.single("picture"),register)
app.post("/posts",verifyToken,upload.single("picture"),createPost)

//Routes//
    app.use("/auth",authRoutes); 
    app.use("/users",userRoutes);
    app.use("/posts",postRoutes);


//mongo setup

mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        app.listen(PORT,()=>{
        console.log("connected mongo and server " + PORT);
    })
})  .catch((err)=>{
console.log(err);
})

