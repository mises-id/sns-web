import React, {  useState } from 'react';
import { Tabs } from 'zarm';
const {Panel} = Tabs
const tab = [{ path: '/home', text: '关注' },{ path: '/home/found', text: '发现' },{ path: '/home/myself', text: '我' }]
const Home = (props)=>{
  const [value, setvalue] = useState(0)
  const getChange = val=>{
    setvalue(val)
    const path = tab[val];
    props.history.push(path.path)
  }
  return <Tabs value={value} onChange={getChange} lineWidth={5} swipeable={true}>
    {tab.map(val=><Panel key={val.path} title={val.text}><div style={{height:500}}>{props.children}</div></Panel>)}
  </Tabs>
}
export default Home