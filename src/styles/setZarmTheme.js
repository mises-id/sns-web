// import { isMisesBrowser } from "@/utils";

/*
 * @Author: lmk
 * @Date: 2022-01-04 15:23:53
 * @LastEditTime: 2022-04-02 11:28:11
 * @LastEditors: lmk
 * @Description: set zarm UI theme
 */
export function setTheme(isMises){
  const themeObj = {
    '--theme-primary':'#5c65f6',
    "--action-sheet-item-height":'55px',
    "--radius-md": '10px',
    "--action-sheet-item-font-size":'17px',
    "--button-primary-background":"#5c65f6",
    "--badge-dot-diameter":"6px",
    "--theme-danger":"#FF3D62",
    "--badge-height":'16px',
    "--modal-title-font-size":"20px",
    '--window-layout-height': !isMises ? '50px' :'0px'
  }
  if(window.innerHeight){
    themeObj['--window-height'] = `${window.innerHeight}px`
  }
  for (const key in themeObj) {
    if (Object.hasOwnProperty.call(themeObj, key)) {
      const element = themeObj[key];
      document.documentElement.style.setProperty(key, element);
    }
  }
  
} 