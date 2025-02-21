export default function SentTexts(props){
 
    const languageCode = { 
        'en': 'English',
        'pt':'Portuguese',
        'es':'Spanish',
        'ru':'Russian',
        'tr':'Turkish',
        'fr':'French'
      }


    return(
        <div className="singleText">
            <div className="userSide">
                <p className='userInput'> {props.sentText} </p>
                <div className="buttons">
                    { (props.sentText.length > 150 && props.textLanguage === 'en') &&
                        <button onClick={props.summarize} className="button">Summarize</button>
                    }
                    <button onClick={props.translate} className="button"> Translate </button>
                     { props.isTranslating && 
                        <select 
                        name="languageList" 
                        id="languageList" 
                        value={props.translateLanguage}
                        onChange={props.handleLanguageChange}
                        aria-label="languageList" 
                        className="languageList button"
                        >
                        <option value="">--select language--</option>
                            <option value='en'>English</option>
                            <option value='pt'>Portuguese</option>
                            <option value='es'>Spanish</option>
                            <option value='ru'>Russian</option>
                            <option value='tr'>Turkish</option>
                            <option value='fr'>French</option>
                        </select>
                     }
                 </div>
             </div>
             <div className="AISide"> 
             {props.error && <p className="error">{props.error}</p>}
             { props.textLanguage &&
                <p className="output prompt">{`Your text is in ${languageCode[props.textLanguage]} Language`} </p>
            }
             { props.nowTranslating && <p className="notification">Your text is translating...</p>}
             
             {props.translatedText &&
             <p className="output"> {`Your text in ${languageCode[props.translateLanguage]} is : ${props.translatedText}`} </p>
             
             }

            { props.nowSummarizing && <p className="notification">Your text is being summarized...</p>}
            { props.summarizedText &&
             <p className="output"> {`Summary of your text is: ${props.summarizedText}`} </p> 
            }

            </div>
            <hr />
        </div>
)}
