   import { createContext, useState } from "react";
   import run from "../Config/gemini";

   export const Context = createContext();

   const  ContextProvider = (props)=>{

      const [Input,setInput] = useState("");
      // hold the data
      const [RecentPrompt,setRecentPrompt] = useState([]); 
      // weather the preveous chat displayed or not
      const [PrevPrompts,setPrevPrompts] = useState([]);
      const [ShowResult,setShowResult] = useState(false);
      const [Loading,setLoading] = useState(false);
      const [ResultData,setResultData] = useState("");
      const delayPara = (index,nextWord) =>{
            setTimeout(function (){
               setResultData(prev=>prev+nextWord);
            },75*index)
      }
      const newChat = () =>{
         setLoading(false);
         setShowResult(false);
      }
      const onSent = async (prompt) =>{ 
         setResultData(" ");
         setLoading(true);
         setShowResult(true);
         let response;
         if(prompt !== undefined){
            response = await run(prompt);
            setRecentPrompt(prompt)
         }else{
            setPrevPrompts(prev=>[...prev,Input]);
            setRecentPrompt(Input);
            response=await run(Input);

         }
      let responseArry = response.split("**")
      let newResponse="";
      for(let i=0;i<responseArry.length;i++){
         if(i===0 || i%2 !==1){
            newResponse +=responseArry[i];
         }else{
            newResponse +="<b>"+responseArry[i]+"</b>"
         }
      }
      let newResponse2 = newResponse.split("*").join("</br>")
      // setResultData(newResponse2)
      let newResponseArray = newResponse2.split(" ");
      for(let i=0;i<newResponseArray.length;i++){
         const nextWord = newResponseArray[i];
         delayPara(i,nextWord+" ");
      }
      setLoading(false)
      setInput("")
      }

      // onSent("What is react js?")

      const contextValue ={
         PrevPrompts,
         setPrevPrompts,
         onSent,
         setRecentPrompt,
         RecentPrompt,
         ShowResult,
         Loading,
         ResultData,
         Input,
         setInput,
         newChat
      }


      return (
         <Context.Provider value={contextValue}>
               {props.children}
         </Context.Provider>
      
      )
   }
   export default ContextProvider