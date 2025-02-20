import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import UserInput from './components/UserInput'
import SentTexts from './components/SentTexts'
import Header from './components/Header'

function App() {
  
  const { watch, register, reset, formState:  {errors, isValid}, handleSubmit } = useForm({mode:'all'})
  const [textLanguage, setTextLanguage] = useState('');
  const [allSentTexts, setAllSentTexts] = useState([])

  const processText = async (data) => {
      const currentUserInput = {
        key: nanoid(),
        text:data.inputText,
        isTranslating: false,
        nowTranslating:false, 
        translatedText:'',
        translateLanguage:'', 
        nowSummarizing:false,
        summarizedText:''
      }
      console.log(data.inputText)

      setAllSentTexts((prevTexts) => [...prevTexts, currentUserInput])
      detectTextLanguage(data.inputText)
      reset()
      //const languageDetected = await detectTextLanguage(data.inputText)
      console.log(textLanguage)
  }

  async function detectTextLanguage(text) {
    console.log(`deecin ${text}`)
    const detector = await self.ai.languageDetector.create()
    console.log(detector)
    const result = await detector.detect(text)
    const detectedLanguageCode = result[0].detectedLanguage
    setTextLanguage(detectedLanguageCode)
    console.log(detectedLanguageCode)
 
  }

  async function translateText(inputObject) {
    console.log(`translateinngg ${inputObject.text}  `)
    console.log(inputObject.isTranslating)
    setAllSentTexts((prevTexts) => 
        prevTexts.map((item) =>
            item.key === inputObject.key ? { ...item, isTranslating: true } : item,
        )
    )

    console.log(inputObject.isTranslating)
  }

  async function handleLanguageChange(e,inputObject) {
    const targetLanguage = e.target.value
    setAllSentTexts((prevTexts) =>
      prevTexts.map((item) =>
        item.key === inputObject.key ? {...item, nowTranslating:true} : item)
  )

    const translator = await self.ai.translator.create({
      sourceLanguage: textLanguage,
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

  
  async function summarizeText(inputObject) {
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
                  textLanguage={textLanguage}
                  translatedText={textObj.translatedText}
                  nowTranslating={textObj.nowTranslating}
                  nowSummarizing={textObj.nowSummarizing}
                  summarizedText={textObj.summarizedText}
                />
              )
            })
          }
          
          <UserInput 
            register = {register}
            handleSend = {handleSubmit(processText)}
            textLanguage = {textLanguage}
            watch = {watch}
            isValid = {isValid}
            errors = {errors}
          />
        </main>
  )
}

export default App