import MisesExtensionController from  './postMessage'
import MisesExtensionControllerMM from  './postMessage_mm'

const documentStateChange = (event) => {
  console.log(event)
  if (event.target && event.target.readyState === "complete") {
    if(window.misesWallet){
      window.mises = new MisesExtensionController()
    }else{
      window.mises = new MisesExtensionControllerMM()
    }
    document.removeEventListener("readystatechange", documentStateChange);
  }
};

document.addEventListener("readystatechange", documentStateChange);