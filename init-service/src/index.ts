import express from "express";
import cors from "cors";
import { copyS3Object } from "./aws";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/project",async (req,res)=>{
    const {replId, language} = req.body;

    if(!replId && language){
        res.status(403).send("replId or language is empty")
        return ;
    }

    await copyS3Object(`base/${language}`, `userCode/${replId}`)
    res.send("project Created Successfully")
})

const port = process.env.port || 3001 ;

app.listen(port,()=>{
    console.log(`app is listening on PORT ${port}`);
})
