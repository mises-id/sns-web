/*
 * @Author: lmk
 * @Date: 2021-07-15 10:45:52
 * @LastEditTime: 2021-12-31 11:32:06
 * @LastEditors: lmk
 * @Description: create mises page
 */
import "./index.scss";
import React, { useEffect, useState } from "react";
import { NavBar, Picker } from "zarm";
import { useTranslation } from "react-i18next";
import radio_selected from "@/images/radio_selected.png";
import radioIcon from "@/images/radio.png";
import arrowDown from "@/images/arrow-down.png";
import { shareWith } from "@/utils";
const ShareWith = ({history={}}) => {
  const max = 9;
  let start = 1;
  const selectHrsOptions = [{
    label:0.5,
    value:0.5
  }];
  while (start<max) {
    selectHrsOptions.push({
      label:start,
      value:start
    })
    ++start;
  }
  const [selectHrs, setselectHrs] = useState(0.5)
  const { t } = useTranslation();
  const [select, setselect] = useState("public");
  const [pickerVisible, setpickerVisible] = useState(false);
  useEffect(() => {
    if(history.state&&history.state.selectType){
      setselect(history.state.selectType)
      setselectHrs(history.state.selectHrs)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const RadioItem = ({ label, name, change}) => {
    const checked = select === name;
    return (
      <div onClick={() => change(name)} className="m-flex">
        <img
          src={checked ? radio_selected : radioIcon}
          alt=""
          width={20}
          height={20}
        />
        <div className="m-margin-left15">
          <span className="m-font17">{label}</span>
        </div>
      </div>
    );
  };
  const getChange = name=>{
    setselect(name)
  }
  const limited = ()=>{
    return <div className="limit m-flex" onClick={() => setpickerVisible(true)}>
      <span className="m-font14 m-colors-666">Turn to private after:</span>
      <div className="select m-flex m-font14 m-row-between">
        {selectHrs}
        <img src={arrowDown} alt="" width={11} className={`select-icon ${pickerVisible ? 'show-selectPicker' : ''}`}/>
      </div>
      <span className="m-font14 m-colors-666">hrs</span>
    </div>
  }
  const pickerSubmit = (e) => {
    if (e.length) {
      setselectHrs(e[0].value)
    }
    setpickerVisible(false);
  };
  const getSelect = ()=>{
    history.state = {
      ...history.state,
      selectType: select,
      selectHrs
    }
    window.history.back()
  }
  return (
    <div>
      <NavBar
        left={
          <span onClick={() => window.history.back()} className="m-font16">
            {t("cancel")}
          </span>
        }
        right={<span className="m-colors-5c65f6 m-font16" onClick={getSelect}>{t("done")}</span>}
      />
      <div className="m-flex m-flex-col m-layout">
        {shareWith.map((val, index) => (
          <div className="m-line-bottom radio-item" key={index} >
            <RadioItem label={val.label} name={val.value} change={getChange}/>
            {val.value==='limited'&&select==='limited'&&limited()}
          </div>
        ))}
      </div>
      <Picker
        visible={pickerVisible}
        dataSource={selectHrsOptions}
        defaultValue={selectHrs}
        onOk={pickerSubmit}
        onCancel={() => setpickerVisible(false)}
        wheelDefaultValue={selectHrs}
        value={selectHrs}
      ></Picker>
    </div>
  );
};
export default ShareWith;
