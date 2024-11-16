

const {
   GoogleGenerativeAI,
   HarmCategory,
   HarmBlockThreshold,
 } = require("@google/generative-ai");
 
 const apiKey = "AIzaSyBktq-gMtwkK2eqkZ3H0mN5kUPEEWch_8E";
 const genAI = new GoogleGenerativeAI(apiKey);
 
 const model = genAI.getGenerativeModel({
   model: "gemini-1.5-flash",
 });
 
 const generationConfig = {
   temperature: 1,
   topP: 0.95,
   topK: 40,
   maxOutputTokens: 8192,
   responseMimeType: "text/plain",
 };
 
 async function run(prompt) {
   const chatSession = model.startChat({
     generationConfig,
     history: [
     ],
   });
 
   let retries = 3;
   let delay=1000;
   for(let attempt=0;attempt<retries;attempt++){
    try{
      const result = await chatSession.sendMessage(prompt);
      console.log(await result.response.text());
      return  await result.response.text();
    }catch(error){
      console.error("Error encountered:",error);
      if(error.message.includes("503")){
      console.log(`Attempts ${attempt+1} failed.Retrying in ${delay}ms..`);
    delay *=2;
    }else{
      throw error;
    }
   }
  }
throw new Error("Max retries reached. Service may still be unavailable.")
 }
 
export default run;