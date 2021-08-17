/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2021-08-18 00:08:37
 * @LastEditors: lmk
 * @Description: Forward page
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavBar, Button ,Input, Toast} from 'zarm';
import '@/styles/common.scss'
import UserHeader from '../Follows/UserHeader';
import Link from '../Follows/Link';
import { useBind, useRouteState } from '@/utils';
import { createStatus, getStatusItem } from '@/api/status';
const Forward = ({history={}})=>{
  const [item,setitem] = useState({})
  const {t} = useTranslation();
  const historyState = useRouteState(history);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getPosts = useCallback(()=>{
    getStatusItem(historyState.id).then(res=>{
      setitem(res);
    })
  });
  const content = useBind('');
  const submit = ()=>{
    const form = {
      status_type:'text',
      form_type:"forward",
      content:content.value,
      parent_id:historyState.id
    }
    createStatus(form).then(res=>{
      Toast.show({
        content:t('sendSuccess'),
        stayTime: 1500,
        afterClose:()=>{
          window.history.back()
        }
      })

    })
  }
  useEffect(() => {
    if(historyState) getPosts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyState]);
  return <div>
    <NavBar
      left={<span  onClick={() => window.history.back()} className="m-font16">{t('cancel')}</span>}
      right={<div style={{width:'61px'}}><Button theme="primary" onClick={submit} block size="xs" shape="round">{t('send')}</Button></div>}
    />
    <div className="m-layout m-bg-f8f8f8">
      <div className="m-padding15"> 
        <Input
          type="text"
          rows={5}
          className="m-font17"
          {...content}
          placeholder={`${t('forwardPlaceholder')}...`}
        />
        <div className="m-bg-fff m-padding10 m-margin-top10">
          <UserHeader size={30} item={{...item.user,from_type:item.from_type,created_at:item.created_at}} btnType="empty"></UserHeader>
          <p className="itemContent m-font13 m-padding-tb10">{item.content}</p>
          {item.status_type==='link'&&<Link theme="primary" item={item.link_meta}></Link>}
        </div>
      </div>
    </div>
  </div>
}
export default Forward