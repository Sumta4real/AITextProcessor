import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function UserInput(props) {

    
    return(
        <form onSubmit={props.handleSend}>
        <div className="typeArea">
        <textarea
            className='typebox'
            name="inputText"
            id="inputText"
            placeholder="Type your text here"
            aria-label="inputText"
            {...props.register('inputText', 
                {required: 'Please type something'})
            } 
        >
        </textarea>
        <button type="submit"  onClick={props.handleSend} className="submitButton">
           <FontAwesomeIcon
                className="icon"
                icon={faPaperPlane}
           />
        </button>
        </div>
        {props.errors.inputText && 
                <p className="error" role="alert">
                    {props.errors.inputText.message}
                </p>
        }
        </form>
        //</form></pre> {JSON.stringify(props.watch(), null, 2)} </pre>
        
    )
}