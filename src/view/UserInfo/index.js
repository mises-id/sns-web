/*
 * @Author: lmk
 * @Date: 2021-07-15 12:51:04
 * @LastEditTime: 2022-08-23 12:02:20
 * @LastEditors: lmk
 * @Description: UserInfo page
 */
import { objToUrl, useList, useLoginModal } from "@/utils";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Toast, ActionSheet } from "zarm";
import { Button, Form } from "antd-mobile";
import "./index.scss";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { attachment } from "@/api/updata";
import selectNFTIcon from "@/images/selected_NFT.png";
import { getMyNFTAsset, updateUser } from "@/api/user";
import { setLoginForm } from "@/actions/user";
import Navbar from "@/components/NavBar";
import { Image, NavBar, TextArea, Input, Picker } from "antd-mobile";
import { useEffect } from "react";
import Avatar from "@/components/NFTAvatar";
import { Popup } from "antd-mobile";
import PullList from "@/components/PullList";
import { useHistory } from "react-router-dom";
const genderList = [[
  { value: "female", label: "female" },
  { value: "male", label: "male" },
  { value: "other", label: "other" },
]];
const UserInfo = (props) => {
  const { t } = useTranslation();
  const { loginForm = {} } =
    useSelector((state) => state.user) || {};
  const formRef = useRef(null);
  const [user, setuser] = useState(loginForm);
  const [avatar, setavatar] = useState("");
  const [visible, setvisible] = useState(false);
  const [cropper, setcropper] = useState(null);
  const [pickerVisible, setpickerVisible] = useState(false);
  // const [selectGender, setselectGender] = useState([user.gender]);
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
    if(loginForm){
      setNFTSelected(loginForm.avatar.nft_asset_id ? {
        image_preview_url: loginForm.avatar.large
      } : {});
      formRef.current.setFieldsValue(loginForm);
      setuser(loginForm);
      console.log(loginForm)
    }
  },[loginForm])

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
    const gender = e[0];
    formRef.current?.setFieldsValue({gender})
    setpickerVisible(false);
  };
  const loginModal = useLoginModal();
  const saveMisesInfoToChain = () => {
    const info = formRef.current.getFieldsValue();
    const avatarUrl = user.avatar && user.avatar.large ? user.avatar.large : "";
    const userInfo = {
      name: info.username,
      gender: info.gender,
      telephones: [info.mobile].filter((val) => val),
      emails: [info.email].filter((val) => val),
      avatarUrl: NFTSelected.image_preview_url || avatarUrl,
      homePageUrl: "",
      intro: info.intro,
    };
    console.log("update mises network", userInfo);
    window.mises
      .setUserInfo(userInfo)
      .then(() => {
        console.log(NFTSelected.image_preview_url);
        setNFTSelected(
          NFTSelected.image_preview_url
            ? {}
            : { ...NFTSelected, image_preview_url: "" }
        );
        Toast.show(t("updataUserInfoSuccess"));
      })
      .catch((err) => {
        if (err === "Wallet not activated") {
          loginModal(() => {
            saveMisesInfoToChain();
          });
        }
      });
  };
  const saveInfo = (by = "info") => {
    const info = formRef.current.getFieldsValue();
    const form = {
      username: {
        username: info.username,
      },
      profile: {
        ...info
      },
    };
    if (by === "info") {
      const reg = /^[A-Za-z0-9]+(_?)+([A-Za-z0-9]+)$/;
      if (info.username && !reg.test(info.username)) {
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
      if (info.username && info.username !== loginForm.username) {
        promise.push(submit(form, "username"));
      }
      Promise.all(promise)
        .then(() => {
          // Toast.show(t("updataUserInfoSuccess"));
          saveMisesInfoToChain();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const setAvatarInfo = (res) => {
    return submit({ avatar: res }, "avatar")
      .then(() => {
        // Toast.show(t("updataUserInfoSuccess"));
        saveMisesInfoToChain();
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
          collection: { slug, name },
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
                  onClick={() => setNFTSelected(item)}
                >
                  <div
                    className={`NFT-select-item-img-box ${
                      NFTSelected.id === item.id ? "active" : ""
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
  // const [nftNameVisible, setNFTNameVisible] = useState(false);
  const saveNFTAvatar = () => {
    setAvatarInfo({
      nft_asset_id: NFTSelected.id,
    }).then((_) => {
      setNFTVisible(false);
      // setNFTNameVisible(true)
    });
  };
  // const sendNFTname = () => {
  //   setNFTNameVisible(false);
  //   setNFTSelected({});
  // }
  const history = useHistory();
  const preivewInfo = ()=>{
    const info = formRef.current.getFieldsValue();
    history.push({
      pathname: "/userDetail",
      search: objToUrl({
        uid: user.uid,
        username: info.username,
        avatar: user.avatar && user.avatar.medium,
        is_followed: info.is_followed,
        misesid: user.misesid,
      }),
    });
  }
  const inputStyle = {
    '--text-align': 'right',
    '--font-size': '14px'
  }
  return (
    <div>
      <Navbar title={t("userInfoPageTitle")} />
      <div className="m-layout m-bg-f8f8f8 userinfo">
        <Form
          name="form"
          ref={formRef}
          onFinish={() => saveInfo("info")}
          layout='horizontal'
          footer={
            <div className="m-padding20 save-box">
              <Button
                color="primary"
                block
                fill="outline"
                shape="rounded"
                onClick={preivewInfo}
              >
                Preview
              </Button>
              <Button
                color="primary"
                block
                className="m-margin-top10"
                loading={saveLoading}
                shape="rounded"
                onClick={() => saveInfo("info")}
              >
                {t("apply")}
              </Button>
            </div>
          }
        >
          <Form.Item  arrow label={t("avatar")} >
              <div
                className="m-position-relative avatar-container" 
                onClick={() => setActionSheetVisible(true)}>
                <input
                  type="file"
                  ref={inputRef}
                  accept="image/png,image/jpeg"
                  className="avatar-input hidden"
                  onChange={getAvatarChange}
                ></input>
                <Avatar avatarItem={loginForm.avatar} size="35px" />
              </div>
            </Form.Item>
          <Form.Item name='username' arrow label={t("username")}>
            <Input placeholder={t("placeholder")} style={inputStyle}/>
          </Form.Item>
          <Form.Item name='gender' arrow label={t("gender")}  onClick={()=>setpickerVisible(true)}>
            <Input readOnly placeholder={t("placeholder")} style={inputStyle}/>
          </Form.Item>
          <Form.Item name='mobile' arrow label={t("phone")}>
            <Input placeholder={t("phonePlaceholder")} style={inputStyle}/>
          </Form.Item>
          <Form.Item name='email' arrow label={t("mail")}>
            <Input placeholder={t("emailPlaceholder")} style={inputStyle}/>
          </Form.Item>
          <Form.Item name='intro' className="intro" arrow label={t("intro")}>
            <TextArea style={inputStyle}
            placeholder={t("introPlaceholder")}
            autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
        </Form>
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
                color="primary"
                fill="outline"
                size="middle"
                shape="rounded"
                onClick={() => setvisible(false)}
              >
                {t("cancel")}
              </Button>
            </div>
            <div className="m-flex-1 m-padding-lr10">
              <Button
                block
                color="primary"
                loading={avatarLoading}
                size="middle"
                shape="rounded"
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
        columns={genderList}
        value={[formRef.current?.getFieldValue('gender')]}
        onConfirm={pickerSubmit}
        onCancel={() => setpickerVisible(false)}
      ></Picker>

      <ActionSheet
        spacing
        visible={actionSheetVisible}
        actions={buttons}
        onMaskClick={() => setActionSheetVisible(false)}
        onCancel={() => setActionSheetVisible(false)}
      />
      <Popup
        visible={NFTVisible}
        bodyStyle={{
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <NavBar
          left={<span onClick={() => setNFTVisible(false)}>{t("cancel")}</span>}
          backArrow={false}
          right={
            <div style={{ width: "61px", display: "inline-block" }}>
              <Button
                color="primary"
                shape="rounded"
                size="small"
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
            emptyText="NFTEmpty"
            load={fetchData}
          />
        </div>
      </Popup>
      {/* <Modal 
        visible={nftNameVisible}
        width="83%"
        hasFooter={true}
        animationType="slideUp"
        footer={
          <>
            <div className="m-flex-1 m-padding-lr10">
              <Button
                block
                color="default"
                size="middle"
                shape="rounded"
                onClick={() => setNFTNameVisible(false)}
              >
                {t("cancel")}
              </Button>
            </div>
            <div className="m-flex-1 m-padding-lr10">
              <Button
                block
                color="primary"
                size="middle"
                shape="rounded"
                onClick={sendNFTname}
              >OK</Button>
            </div>
          </>
        }
        maskClosable>
        <div className="m-text-center center-content">
          <p>Would you like to set</p>
          <p className="nft-selected-name">"{NFTSelected.name}"</p>
          <p>as your user name?</p>
        </div>
      </Modal> */}
    </div>
  );
};
export default UserInfo;
