/*
 * @Author: lmk
 * @Date: 2021-07-16 00:15:24
 * @LastEditTime: 2022-01-26 15:44:43
 * @LastEditors: lmk
 * @Description: createPosts page
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavBar, Button, Input, Toast } from "zarm";
import "./index.scss";
import { hoursToSeconds, useBind } from "@/utils";
import { createStatus } from "@/api/status";
import UpLoad from "@/components/UpLoad";
import Cell from "@/components/Cell";
import { attachment } from "@/api/updata";
import { useHistory } from "react-router-dom";
const GreatePosts = ({ history = {} }) => {
  const { t } = useTranslation();
  const postsContent = useBind("");
  const [loading, setloading] = useState(false);
  let [imageList, setImageList] = useState([]);
  const [selectShareWith, setselectShareWith] = useState("public");
  const [selectHrs, setselectHrs] = useState(0)
  const historyHooks = useHistory()
  //create
  const send = async () => {
    if (postsContent.value === "" && imageList.length===0) {
      Toast.show(t("createPostsTips"));
      return false;
    }
    const form = {
      status_type: "text",
      form_type: "status",
      content: postsContent.value,
    };
    if(selectShareWith==='public'){
      form.is_private = false;
      form.show_duration = 0;
    }
    if(selectShareWith==='private'){
      form.is_private = true;
      form.show_duration = 0;
    }
    if(selectShareWith==='limited'){
      form.is_private = true;
      form.show_duration = hoursToSeconds(selectHrs);
    }
    setloading(true);
    try {
      try {
        form.images = await upload()
      } catch (error) {
        Toast.show(t('pictureError'))
      }
      if(form.images.length){
        form.status_type = 'image';
      }
      createStatus(form)
        .then((res) => {
          Toast.show({
            content: t("sendSuccess"),
            stayTime: 1500,
            afterClose: () => {
              window.refreshByCacheKey('/home/following')
              history.state = {}
              historyHooks.replace('/home/following')
              // window.history.back();

              setloading(false);
            },
          });
        })
        .catch(() => setloading(false));
    } catch (error) {
      console.log(error)
      setloading(false)
    }
  };
  // upload image 
  const upload = async ()=>{
    const imagesFormData = imageList.map(val=>{
      const formData = new FormData();
      const filename = `${val.file.type.replace("image/", "")}`;
      formData.append("file", val.file, filename);
      formData.append("file_type", "image");
      return attachment(formData);
    })
    const images = await Promise.all(imagesFormData).then(res=>res.map(val=>val.path))
    return Promise.resolve(images)
  }
  // Echo
  useEffect(() => {
    if (history.state) {
      postsContent.onChange(history.state.value);
      setImageList(history.state.imageList || []);
      setselectShareWith(history.state.selectType || 'public');
      setselectHrs(history.state.selectHrs);
    }
  }, [history]); // eslint-disable-line react-hooks/exhaustive-deps
  // route to share with page
  const shareWith = () => {
    const content = {
      value: postsContent.value,
      imageList,
    };
    history.state = {
      ...history.state,
      ...content
    };
    history.push("/shareWith");
  };
  /* // get status detail data
  useEffect(() => {
    const {state} = window.history.state;
    getStatusItem(state.id).then(res=>{
      console.log(res)
      postsContent.onChange(res.content);
      res.images = res.images.map(val=>({url:val}))
      setImageList(res.images || []);
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps */
  return (
    <div>
      <NavBar
        left={
          <span onClick={() => window.history.back()} className="m-font16">
            {t("cancel")}
          </span>
        }
        right={
          <div style={{ width: "61px" }}>
            <Button
              theme="primary"
              disabled={loading}
              onClick={send}
              loading={loading}
              block
              size="xs"
              shape="round"
            >
              {t("send")}
            </Button>
          </div>
        }
      />
      <div className="m-layout m-bg-fff">
        <div className="m-padding15">
          <Input
            rows={5}
            maxLength="4000"
            type="text"
            {...postsContent}
            className="m-font17"
            placeholder={`${t("createPostsPlaceholder")}...`}
          />
        </div>
        <UpLoad setImageList={setImageList} imageList={imageList} />
        <div className="share-with" onClick={shareWith}>
          <div className="m-padding-lr15 m-line-top">
            <Cell
              label={t("createPostsLabel")}
              showIcon={false}
              rightChild={
                <div>
                  <span className="m-font14 m-colors-666">{selectShareWith}</span>
                  {selectShareWith==='limited'&&<span className="m-margin-left10">{`${selectHrs}hrs`}</span>}
                </div>
              }
              showLine={false}
            ></Cell>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GreatePosts;
