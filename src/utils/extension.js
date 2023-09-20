import MisesExtensionController from  './postMessage'
import MisesExtensionControllerMM from  './postMessage_mm'

const documentStateChange = (event) => {
  if(window.misesEthereum && !window.mises) {
    window.mises = new MisesExtensionControllerMM()
    return 
  }
  if (event.target && event.target.readyState === "complete" && !window.mises) {
    if(window.misesWallet){
      window.mises = new MisesExtensionController()
    }else{
      window.mises = new MisesExtensionControllerMM()
    }
    document.removeEventListener("readystatechange", documentStateChange);
  }
};

document.addEventListener("readystatechange", documentStateChange);