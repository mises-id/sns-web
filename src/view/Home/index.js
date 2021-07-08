import React, {  useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'zarm';
import './index.scss'
const {Panel} = Tabs
const Home = (props)=>{
  const {t} = useTranslation()
  const tab = [{ path: '/home', text:t('follow') },{ path: '/home/found', text:t('found') },{ path: '/home/myself', text:t('myself') }]
  const [value, setvalue] = useState(0)
  //change current and change route
  const getChange = val=>{
    setvalue(val)
    const path = tab[val];
    props.history.push(path.path)
  }
  return <Tabs value={value} onChange={getChange} lineWidth={5} swipeable={true}>
    {tab.map((val,index)=><Panel key={val.path} title={<span className={value===index?'active':''}>{val.text}</span>}>
      <div style={{height:500}}>{props.children}</div>
      </Panel>)}
  </Tabs>
}
export default Home