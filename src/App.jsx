import './App.css'
import { useState, useEffect, useRef } from 'react';
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from '@tensorflow/tfjs';


function App() {
  // tf.setBackend('webgl');
  console.log(tf.getBackend())

  const [isModelLoading, setIsModelLoading] = useState(true)
  const [model, setModel] = useState(null)
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([])
  const [history, setHistory] = useState([])

  const imageRef = useRef()
  const textInputRef = useRef()
  const fileInputRef = useRef()

  const loadModel = async () => {
      try {
          const model = await mobilenet.load()
          setModel(model)
          setIsModelLoading(false)
      } catch (error) {
          console.log(error)
          setIsModelLoading(false)
      }
  }

  const uploadImage = (e) => {
    const {files} = e.target
    if(files.length > 0){
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
    } else {
      setImageURL(null)
    }
  }

  
  const identify = async () => {
      // textInputRef.current.value = ''
      const results = await model.classify(imageRef.current)
      setResults(results)
  }

  const handleOnChange = (e) => {
    setImageURL(e.target.value)
    setResults([])
  }

  useEffect(() => {
      loadModel()
  }, [])

  if (isModelLoading) {
      return <h2>Model Loading...</h2>
  }


  return (
      <div className='App'>
        <h1 className='header'>Image ID</h1>
        <div className='inputHolder'>
          <input type='file' accept='image/*' capture='camera' className='uploadInput' onChange={uploadImage}  ref={fileInputRef} />
          {/* <button className='uploadImage' >Upload Image</button> */}
          <span className='or'>OR</span>
          <input type="text" placeholder='Paster image URL' ref={textInputRef} onChange={handleOnChange} />
        </div>
        <div className="mainWrapper">
            <div className="mainContent">
                <div className="imageHolder">
                    {imageURL && <img src={imageURL} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef} />}
                </div>
                {results.length > 0 && <div className='resultsHolder'>
                    {results.map((result, index) => {
                        return (
                            <div className='result' key={result.className}>
                                <span className='name'>{result.className}</span>
                                <span className='confidence'>Confidence level: {(result.probability * 100).toFixed(2)}% {index === 0 && <span className='bestGuess'>Best Guess</span>}</span>
                            </div>
                        )
                    })}
                </div>}
            </div>
            {imageURL && <button className='button' onClick={identify}>Identify Image</button>}
        </div>
      </div>
  );
}

export default App
