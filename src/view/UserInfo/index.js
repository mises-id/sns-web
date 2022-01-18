/*
 * @Author: lmk
 * @Date: 2021-07-15 12:51:04
 * @LastEditTime: 2022-01-18 09:51:29
 * @LastEditors: lmk
 * @Description: UserInfo page
 */
import Cell from "@/components/Cell";
import Image from "@/components/Image";
import { useBind } from "@/utils";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Input, Modal, Button, Picker, Toast } from "zarm";
import "./index.scss";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { attachment } from "@/api/updata";
import { updateUser } from "@/api/user";
import { setLoginForm } from "@/actions/user";
import Navbar from "@/components/NavBar";
const genderList = [
  { value: "female", label: "female" },
  { value: "male", label: "male" },
  { value: "other", label: "other" },
];
const UserInfo = (props) => {
  const { t } = useTranslation();
  const { loginForm = {} } = useSelector((state) => state.user) || {};
  const [user, setuser] = useState(loginForm);
  const username = useBind(user.username);
  const phone = useBind(user.mobile);
  const mail = useBind(user.email);
  const address = useBind(user.address);
  const [avatar, setavatar] = useState("");
  const [visible, setvisible] = useState(false);
  const [cropper, setcropper] = useState(null);
  const [pickerVisible, setpickerVisible] = useState(false);
  const [selectGender, setselectGender] = useState([user.gender]);
  const [avatarLoading, setavatarLoading] = useState(false);
  const [saveLoading, setsaveLoading] = useState(false);
  const dispatch = useDispatch();
  //set avatar
  const getAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reads = new FileReader();
      reads.readAsDataURL(file);
      reads.onload = ({ target }) => {
        setavatar(target.result);
        e.target.value = "";
        setvisible(true);
      };
    }
  };
  //send avatar
  const sendAvatar = () => {
    const option = {
      width: 200,
      height: 200,
      fillColor: "#fff",
      imageSmoothingEnabled: false,
      imageSmoothingQuality: "high",
    };
    cropper.getCroppedCanvas(option).toBlob((blob) => {
      const formData = new FormData();
      const filename = `avatar${user.uid}.${blob.type.replace("image/", "")}`;
      formData.append("file", blob, filename);
      formData.append("file_type", "image");
      setavatarLoading(true);
      attachment(formData)
        .then((res) => {
          setvisible(false);
          setuser((t) => {
            t.avatar = {};
            t.attachment_path = res.path;
            t.attachment_id = res.attach_id;
            t.avatar.large = res.url;
            setAvatarInfo({
              attachment_path:res.path,
              attachment_id:res.attach_id
            });
            return t;
          });
        })
        .finally(() => setavatarLoading(false));
    });
  };
  const pickerSubmit = (e) => {
    if (e.length) {
      user.gender = e[0].label;
      setuser({ ...user });
      setselectGender([e[0].value]);
    }
    setpickerVisible(false);
  };
  const saveInfo = (by = "info") => {
    const form = {
      username: {
        username: username.value,
      },
      profile: {
        mobile: phone.value,
        email: mail.value,
        address: address.value,
        gender: user.gender,
      },
    };
    if (by === "info") {
      const reg = /^[A-Za-z0-9]+(_?)+([A-Za-z0-9]+)$/
      if(!loginForm.username&&username.value&&!reg.test(username.value)){
        Toast.show('Incorrect username')
        return false;
      }
      setsaveLoading(true);
      const promise = [submit(form, "profile")];
      if (!loginForm.username&&username.value) {
        promise.push(submit(form, "username"));
      }
      Promise.all(promise).then(() => {
        Toast.show(t("updataUserInfoSuccess"));
      });
    }
  };
  const setAvatarInfo = (res) => {
    submit({ avatar: res }, "avatar").then(() => {
      Toast.show(t("updataUserInfoSuccess"));
    });
  };
  const submit = async (form, by) => {
    const byForm = { by };
    byForm[by] = form[by];
    try {
      const avatarUrl =
        user.avatar && user.avatar.large ? user.avatar.large : "";
      window.mises.setUserInfo({
        name: username.value,
        gender: user.gender,
        telephones: [phone.value].filter(val=>val),
        emails: [mail.value].filter(val=>val),
        avatarUrl,
        homePageUrl:'homePageUrl',
        intro:'intro'
      });
      const res = await updateUser(byForm);
      if (res) {
        dispatch(setLoginForm(res));
        setsaveLoading(false);
        return Promise.resolve();
      }
      return errorMessage("error");
    } catch (error) {
      return errorMessage(error);
    }
  };
  const errorMessage = (error) => {
    Toast.show(error);
    setsaveLoading(false);
    return Promise.reject(error);
  };
  return (
    <div>
      <Navbar title={t("userInfoPageTitle")} />
      <div className="m-layout m-bg-f8f8f8 userinfo">
        <div className="m-bg-fff">
          <Cell
            label={t("avatar")}
            showIcon={false}
            className="m-padding-lr15 m-padding-tb12"
            rightChild={
              <div className="m-position-relative">
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="avatar-input m-position-absolute"
                  onChange={getAvatarChange}
                ></input>
                <Image
                  size={35}
                  source={user.avatar && user.avatar.large}
                ></Image>
              </div>
            }
          ></Cell>
          <Cell
            label={t("username")}
            showIcon={false}
            className="m-padding-lr15 m-padding-tb19"
            rightChild={
              <Input
                type="text"
                clearable={false}
                maxLength={25}
                {...username}
                placeholder={t("placeholder")}
              />
            }
          ></Cell>
          <Cell
            label={t("gender")}
            showIcon={false}
            className="m-padding-lr15 m-padding-tb19"
            rightChild={
              <div
                className={!user.gender ? "placeholder" : ""}
                onClick={() => setpickerVisible(true)}
              >
                {user.gender || t("placeholder")}
              </div>
            }
          ></Cell>
          <Cell
            label={t("phone")}
            showIcon={false}
            className="m-padding-lr15 m-padding-tb19"
            rightChild={
              <Input
                type="text"
                className="userinfo-input"
                clearable={false}
                {...phone}
                placeholder={t("phonePlaceholder")}
              />
            }
          ></Cell>
          <Cell
            label={t("mail")}
            showIcon={false}
            className="m-padding-lr15 m-padding-tb19"
            rightChild={
              <Input
                type="text"
                className="userinfo-input"
                clearable={false}
                {...mail}
                placeholder={t("emailPlaceholder")}
              />
            }
          ></Cell>
          <Cell
            label={t("address")}
            showIcon={false}
            className="m-padding-lr15 m-padding-tb19"
            rightChild={
              <Input
                type="text"
                className="userinfo-input"
                clearable={false}
                {...address}
                placeholder={t("addressPlaceholder")}
              />
            }
          ></Cell>
        </div>
        <div className="m-padding20 save-box">
          <Button
            block
            theme="primary"
            disabled={saveLoading}
            loading={saveLoading}
            ghost
            size="md"
            shape="round"
            onClick={() => saveInfo("info")}
          >
            {t("apply")}
          </Button>
        </div>
      </div>
      <Modal
        visible={visible}
        width="90%"
        hasFooter={true}
        animationType="slideUp"
        footer={
          <>
            <div className="m-flex-1 m-padding-lr10">
              <Button
                block
                theme="primary"
                ghost
                size="sm"
                shape="round"
                onClick={() => setvisible(false)}
              >
                {t("cancel")}
              </Button>
            </div>
            <div className="m-flex-1 m-padding-lr10">
              <Button
                block
                theme="primary"
                ghost
                disabled={avatarLoading}
                loading={avatarLoading}
                size="sm"
                shape="round"
                onClick={sendAvatar}
              >
                {t("send")}
              </Button>
            </div>
          </>
        }
        maskClosable
      >
        <Cropper
          src={avatar}
          style={{ height: 400, width: "100%" }}
          onInitialized={setcropper}
          viewMode={1}
          minCropBoxWidth={100}
          minContainerHeight={300}
          minCropBoxHeight={100}
          initialAspectRatio={1}
          guides={false}
          aspectRatio={1}
        ></Cropper>
      </Modal>
      <Picker
        visible={pickerVisible}
        dataSource={genderList}
        defaultValue={selectGender}
        onOk={pickerSubmit}
        onCancel={() => setpickerVisible(false)}
        wheelDefaultValue={selectGender}
        value={selectGender}
      ></Picker>
    </div>
  );
};
export default UserInfo;
