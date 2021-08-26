/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2021-08-26 21:46:36
 * @LastEditors: lmk
 * @Description: createPosts page
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavBar, Button ,Input, Toast} from 'zarm';
import '@/styles/common.scss'
import { useBind } from '@/utils';
import { createStatus } from '@/api/status';
const GreatePosts = (props)=>{
  const {t} = useTranslation()
  const postsContent = useBind('')
  const [loading, setloading] = useState(false)
  const send = ()=>{
    if(postsContent.value===''){
      Toast.show(t('createPostsPlaceholder'))
      return false;
    }
    const form = {
      status_type:'text',
      form_type:"status",
      content:postsContent.value
    }
    setloading(true)
    createStatus(form).then(res=>{
      Toast.show({
        content:t('sendSuccess'),
        stayTime: 1500,
        afterClose:()=>{
          window.history.back()
          setloading(false)
        }
      })
    }).catch(()=>setloading(false))
  }
  return <div>
    <NavBar
      left={<span  onClick={() => window.history.back()} className="m-font16">{t('cancel')}</span>}
      right={<div style={{width:'61px'}}><Button theme="primary" disabled={loading} onClick={send} loading={loading} block size="xs" shape="round">{t('send')}</Button></div>}
    />
    <div className="m-layout m-bg-f8f8f8">
      <div className="m-padding15"> 
        <Input
          rows={10}
          maxLength="4000"
          type="text"
          {...postsContent}
          className="m-font17"
          placeholder={`${t('createPostsPlaceholder')}...`}
        />
      </div>
    </div>
  </div>
}
export default GreatePosts