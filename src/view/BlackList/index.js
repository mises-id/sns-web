/*
 * @Author: lmk
 * @Date: 2021-07-15 13:41:35
 * @LastEditTime: 2022-01-13 10:58:12
 * @LastEditors: lmk
 * @Description: Following and Followers page
 */
import Cell from "@/components/Cell";
import React from "react";
import { useTranslation } from "react-i18next";
import "./index.scss";
import Navbar from "@/components/NavBar";
import { getBlackList, removeBlackList } from "@/api/user";
import MButton from "@/components/MButton";
import { useList, username } from "@/utils";
import PullList from "@/components/PullList";
import { Toast } from "zarm";
const BlackList = ({ history }) => {
  const { t } = useTranslation();
   // eslint-disable-next-line
  const [fetchData, last_id, dataSource] = useList(getBlackList);
  const onPress = (val,index)=>{
    removeBlackList(val.user.uid).then(res=>{
      Toast.show(t('deleteSuccess'))
      dataSource.splice(index,1)
      if(dataSource.length===0){
        fetchData('refresh')
      }
    })
  }
  // const [data, setdata] = useState([])
  const renderView = (val = {}, index) => {
    const user = val.user;
    return (
      <Cell
        iconSize={35}
        className="m-bg-fff m-padding-lr15 m-padding-tb12"
        showArrow={false}
        label={username(user)}
        key={index}
        icon={user.avatar ? user.avatar.medium : ""}
        rightChild={
          <MButton onPress={()=>onPress(val,index)} txt="Unblock"  borderColor="#DDDDDD" txtColor="#666666" txtSize={12}></MButton>
        }
      ></Cell>
    );
  };
  return (
    <div>
      <Navbar title={t('blackListPageTitle')} />
      <PullList
        renderView={renderView}
        data={dataSource}
        load={fetchData}
      ></PullList>
    </div>
  );
};
export default BlackList;
