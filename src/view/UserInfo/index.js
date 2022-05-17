/*
 * @Author: lmk
 * @Date: 2021-07-15 12:51:04
 * @LastEditTime: 2022-05-17 15:14:37
 * @LastEditors: lmk
 * @Description: UserInfo page
 */
import Cell from "@/components/Cell";
import { useBind, useList, useLoginModal } from "@/utils";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Input, Modal, Button, Picker, Toast, ActionSheet } from "zarm";
import "./index.scss";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { attachment } from "@/api/updata";
import selectNFTIcon from "@/images/selected_NFT.png";
import { getMyNFTAsset, getUserSelfInfo, updateUser } from "@/api/user";
import { setLoginForm } from "@/actions/user";
import Navbar from "@/components/NavBar";
import { Image, NavBar } from "antd-mobile";
import { useEffect } from "react";
import Avatar from "@/components/NFTAvatar";
import { Popup } from "antd-mobile";
import PullList from "@/components/PullList";
const genderList = [
  { value: "female", label: "female" },
  { value: "male", label: "male" },
  { value: "other", label: "other" },
];
const UserInfo = (props) => {
  const { t } = useTranslation();
  const { loginForm = {}, accountsChanged } =
    useSelector((state) => state.user) || {};
  const [user, setuser] = useState(loginForm);
  const username = useBind(user.username);
  const phone = useBind(user.mobile);
  const mail = useBind(user.email);
  const intro = useBind(user.intro);
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
  useEffect(() => {
    if (!accountsChanged) {
      getUserSelfInfo()
        .then((res) => {
          setuser({ ...res });
          username.onChange(res.username);
          phone.onChange(res.mobile);
          mail.onChange(res.email);
          intro.onChange(res.intro);
          setNFTSelected(res.avatar.nft_asset_id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line
  }, [accountsChanged]);

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
              attachment_path: res.path,
              attachment_id: res.attach_id,
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
  const loginModal = useLoginModal();
  const saveMisesInfo = () => {
    const avatarUrl = user.avatar && user.avatar.large ? user.avatar.large : "";
    const userInfo = {
      name: username.value,
      gender: user.gender,
      telephones: [phone.value].filter((val) => val),
      emails: [mail.value].filter((val) => val),
      avatarUrl,
      homePageUrl: "",
      intro: intro.value,
    };
    console.log("update mises network", userInfo);
    window.mises.setUserInfo(userInfo).catch((err) => {
      if (err === "Wallet not activated") {
        loginModal(() => {
          saveMisesInfo();
        });
      }
    });
  };
  const saveInfo = (by = "info") => {
    const form = {
      username: {
        username: username.value,
      },
      profile: {
        mobile: phone.value,
        email: mail.value,
        intro: intro.value,
        gender: user.gender,
      },
    };
    if (by === "info") {
      const reg = /^[A-Za-z0-9]+(_?)+([A-Za-z0-9]+)$/;
      if (username.value && !reg.test(username.value)) {
        // Toast.show('Incorrect username')
        Modal.alert({
          title: "Message",
          width: "83%",
          content: t("usernameError"),
        });
        return false;
      }
      setsaveLoading(true);
      const promise = [submit(form, "profile")];
      if (username.value && username.value !== loginForm.username) {
        promise.push(submit(form, "username"));
      }
      Promise.all(promise)
        .then(() => {
          Toast.show(t("updataUserInfoSuccess"));
          saveMisesInfo();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const setAvatarInfo = (res) => {
    return submit({ avatar: res }, "avatar")
      .then(() => {
        Toast.show(t("updataUserInfoSuccess"));
        saveMisesInfo();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const loginModal = useLoginModal()
  const submit = async (form, by) => {
    const byForm = { by };
    byForm[by] = form[by];
    try {
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
  useEffect(() => {
    if (!loginForm.misesid) {
      window.location.replace("/home/me");
    }
  }, [loginForm.misesid]);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const inputRef = useRef(null);
  // actionSheet select the avatar
  const buttons = [
    {
      text: "Avatar",
      onClick: () => {
        inputRef.current.click();
        setActionSheetVisible(false);
      },
    },
    {
      text: "Avatar-NFT",
      onClick: () => {
        setActionSheetVisible(false);
        setNFTVisible(true);
      },
    },
  ];
  // nft avatar
  const [NFTVisible, setNFTVisible] = useState(false);
  const [NFTSelected, setNFTSelected] = useState({});
  const [lastId, setlastId] = useState("");
  const [fetchData, last_id, dataSource] = useList(getMyNFTAsset, {
    limit: 20,
    last_id: lastId,
  });
  useEffect(() => {
    setlastId(last_id);
  }, [last_id]);

  const [NFTData, setNFTData] = useState([]);
  
  useEffect(() => {
    if (dataSource.length > 0) {
      const slugArr = [];
      dataSource.forEach((item) => {
        const {
          collection: { slug,name },
        } = item;
        const hasSlug = slugArr.find((val) => val.slugName === slug);
        // group by slug
        if (hasSlug) {
          hasSlug.list.push(item);
        } else {
          slugArr.push({
            name,
            slugName: slug,
            list: [item],
          });
        }
      });
      setNFTData(slugArr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource.length]);
  const renderView = (val, index) => {
    return (
      <div className="NFT-container" key={index}>
        <p className="NFT-select-series-title">{val.name}</p>
        <div className="m-grid NFT-select-items">
          {Array.isArray(val.list) &&
            val.list.map((item, index) => {
              return (
                <div
                  className="NFT-select-item"
                  key={index}
                  onClick={() => setNFTSelected(item.id)}
                >
                  <div
                    className={`NFT-select-item-img-box ${
                      NFTSelected === item.id ? "active" : ""
                    }`}
                  >
                    <Image
                      src={item.image_preview_url}
                      alt=""
                      fit="cover"
                      className="NFT-select-item-img"
                    />
                    <Image className="active-image" src={selectNFTIcon}></Image>
                  </div>
                  <p className="NFT-select-item-title">{item.name}</p>
                </div>
              );
            })}
        </div>
      </div>
    );
  };
  const saveNFTAvatar = () => {
    setAvatarInfo({
      nft_asset_id: NFTSelected,
    }).then((_) => {
      setNFTVisible(false);
    });
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
              <div
                className="m-position-relative"
                onClick={() => setActionSheetVisible(true)}
              >
                <input
                  type="file"
                  ref={inputRef}
                  accept="image/png,image/jpeg"
                  className="avatar-input hidden"
                  onChange={getAvatarChange}
                ></input>
                <Avatar avatarItem={loginForm.avatar} size="35px" />
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
                className="userinfo-input"
                clearable={false}
                autoHeight
                {...mail}
                placeholder={t("emailPlaceholder")}
              />
            }
          ></Cell>
          <Cell
            label={t("intro")}
            showIcon={false}
            className="m-padding-lr15 m-padding-tb19 m-col-top"
            rightChild={
              <div>
                <Input
                  type="text"
                  className="userinfo-input"
                  maxLength={200}
                  rows={5}
                  {...intro}
                  placeholder={t("introPlaceholder")}
                />
              </div>
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
        width="83%"
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

      <ActionSheet
        spacing
        visible={actionSheetVisible}
        actions={buttons}
        onMaskClick={() => setActionSheetVisible(false)}
        onCancel={() => setActionSheetVisible(false)}
      />
      <Popup visible={NFTVisible}>
        <NavBar
          left={<span onClick={() => setNFTVisible(false)}>{t("cancel")}</span>}
          backArrow={false}
          right={
            <div style={{ width: "61px", display: "inline-block" }}>
              <Button
                theme="primary"
                block
                size="xs"
                shape="round"
                onClick={saveNFTAvatar}
              >
                {t("done")}
              </Button>
            </div>
          }
        />
        <div className="pull-list">
          <PullList
            renderView={renderView}
            data={NFTData}
            load={fetchData} />
        </div>
      </Popup>
    </div>
  );
};
export default UserInfo;
