import Sentence from '../models/sentenceModel.js';

export const getSentence= async(req,res)=>{
    try{
        const result= await Sentence.find();
        res.json(result);
    }

    catch(error){
        console.error("Error in getSentence:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}