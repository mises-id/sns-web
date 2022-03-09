/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-03-09 17:01:13
 * @LastEditors: lmk
 * @Description: createPosts page
 */
import Navbar from "@/components/NavBar";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "zarm";
import complete from '@/images/complete.png'
import "./index.scss";
const AirdropSuccess = () => {
  const { t } = useTranslation();
  const viewInWallet = ()=>{
    // window.open('mises-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/popup.html')
    window.mises.openRestore()
  }
  return (
    <div>
      <Navbar title={t('airdropPageTitle')} />
      <div className="m-layout m-bg-fff m-padding15 m-font18">
        <div>
          <img src={complete} width={44} height={44} alt="" className="success-img"/>
          <p className="content">{t('airdropSuccessContent')}</p>
        </div>
        <div className="viewInWallet">
          <Button block shape="round" theme="primary" onClick={viewInWallet}>
            <span className="btn-txt">{t("viewInWallet")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AirdropSuccess;
