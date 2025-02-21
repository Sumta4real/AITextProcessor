import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import UserInput from './components/UserInput'
import SentTexts from './components/SentTexts'
import Header from './components/Header'

function App() {
  
  const { watch, register, reset, formState:  {errors, isValid}, handleSubmit } = useForm({mode:'all'})
  const [allSentTexts, setAllSentTexts] = useState([])

  const processText = async (data) => {
      const currentUserInput = {
        key: nanoid(),
        text:data.inputText,
        textLanguage: '',
        isTranslating: false,
        nowTranslating:false, 
        translatedText:'',
        translateLanguage:'', 
        nowSummarizing:false,
        summarizedText:'',
        error:''

      }
      console.log(data.inputText)

      setAllSentTexts((prevTexts) => [...prevTexts, currentUserInput])
      detectTextLanguage(currentUserInput)
      reset()
  }

  async function detectTextLanguage(inputObject) {
    try{
    const detector = await self.ai.languageDetector.create()
    console.log(detector)
    const result = await detector.detect(inputObject.text)
    console.log(inputObject.text)

    const detectedLanguageCode = result[0].detectedLanguage
    console.log(detectedLanguageCode)
    setAllSentTexts((prevTexts) => 
      prevTexts.map((item) =>
          item.key === inputObject.key ? { ...item, textLanguage: detectedLanguageCode} : item,
      )
  )
    console.log(detectedLanguageCode)
  }
    catch(error){
      setAllSentTexts((prevTexts) => 
        prevTexts.map((item) =>
            item.key === inputObject.key ? { ...item, error:'Failed to detect your text language, Chrome Language detector API not available'} : item,
        )
    )
    }
    }
    
    
 
  

  async function translateText(inputObject) {
      setAllSentTexts((prevTexts) => 
        prevTexts.map((item) =>
            item.key === inputObject.key ? { ...item, isTranslating: true } : item,
        )
    )
    console.log(inputObject.isTranslating)
  

  }

  async function handleLanguageChange(e,inputObject) {
    try{ 
    const targetLanguage = e.target.value
    setAllSentTexts((prevTexts) =>
      prevTexts.map((item) =>
        item.key === inputObject.key ? {...item, nowTranslating:true} : item)
  )

    const translator = await self.ai.translator.create({
      sourceLanguage: inputObject.textLanguage,
      targetLanguage: targetLanguage
    });

    const translatedText = await translator.translate(inputObject.text)
    setAllSentTexts((prevTexts) =>
      prevTexts.map((item) =>
        item.key === inputObject.key ? {
          ...item, 
          translatedText : translatedText ,
          nowTranslating:false,
          translateLanguage: targetLanguage
        } : item)
  )
  } 
  catch(error){
    console.error(error)
    setAllSentTexts((prevTexts) => 
      prevTexts.map((item) =>
          item.key === inputObject.key ? { ...item, error:'Failed to translate your text , Chrome Translator API not available',
            nowTranslating: false}
           : item
      )
  )
  }
}


  
  async function summarizeText(inputObject) {
    try{ 
    setAllSentTexts((prevTexts) =>
      prevTexts.map((item) =>
        item.key === inputObject.key ? {...item, nowSummarizing:true} : item)
  )

    const summarizer = await self.ai.summarizer.create()
    const summary = await summarizer.summarize(inputObject.text)

    setAllSentTexts((prevTexts) =>
      prevTexts.map((item) =>
        item.key === inputObject.key ? {...item, summarizedText:summary, nowSummarizing:false} : item)
  )
    console.log(summary)
  }
  catch (error) {
    setAllSentTexts((prevTexts) => 
      prevTexts.map((item) =>
          item.key === inputObject.key ? { ...item, error: 'Failed to summarize your text , Chrome Summariser API not available',
                nowSummarizing:false
          } : item
      )
  )

}
  } 

  



  return(
        <main>
          <Header />
          { 
            allSentTexts.map((textObj) => {
              return(
                <SentTexts
                  key = {textObj.key}
                  register={register}
                  isTranslating = {textObj.isTranslating}
                  translateLanguage = {textObj.translateLanguage}
                  handleLanguageChange = {(e) => handleLanguageChange(e,textObj)}
                  sentText = {textObj.text}
                  summarize = {() => summarizeText(textObj)}
                  translate = {() => translateText(textObj)}
                  textLanguage={textObj.textLanguage}
                  translatedText={textObj.translatedText}
                  nowTranslating={textObj.nowTranslating}
                  nowSummarizing={textObj.nowSummarizing}
                  summarizedText={textObj.summarizedText}
                  error={textObj.error}
                />
              )
            })
          }  
          
          <UserInput 
            register = {register}
            handleSend = {handleSubmit(processText)}
            watch = {watch}
            isValid = {isValid}
            errors = {errors}
          />
        </main>
  )
}

export default App