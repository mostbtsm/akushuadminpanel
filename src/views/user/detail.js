import { v4 as uuid } from 'uuid';
import React, {Component} from 'react';
import {
  Avatar,
  Box,
  Container,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  Tab,
  Tabs,
  AppBar,
  TableHead
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Page from 'src/components/Page';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;
const en = {
  UserDetail:"User Detail",
  userid:"User ID",
  name:"Name",
  name_freegana:"Furigana Name",
  maiden_name:"Maiden name",
  gender:"Gender",
  female:"Female",
  male:"Male",
  phone_number:"Phone Number",
  email:"Email",
  birthday:"Birthday",
  avatar:"Avatar",
  address:"Address",
  prefectures:"Prefectures",
  municipalities:"Municipalities",
  street_number:"Street Number",
  building_number:"Building name, room number, etc.",
  course:"Course",
  payment_method:"Payment method",
  bank_account:"Account information",
  bank_name:"Financial institution name",
  branch_name:"Branch name",
  deposit_type:"Deposit type",
  account_number:"Account Number",
  account_holder:"Account holder",
  referral_code:"Referral code",
}

const jp ={
  UserDetail:"ユーザーの詳細",
  userid:"ユーザーID",
  name:"お名前",
  name_freegana:"お名前 ふりがな",
  maiden_name:"旧姓",
  gender:"性別",
  female:"女性",
  male:"男性",
  phone_number:"電話番号",
  email:"メールアドレス",
  birthday:"生年月日",
  avatar:"顔写真",
  address:"住所",
  prefectures:"都道府県",
  municipalities:"市区町村",
  street_number:"町名・番地",
  building_number:"建物名・部屋番号など",
  course:"コース",
  payment_method:"支払い方法",
  bank_account:"口座情報",
  bank_name:"金融機関名",
  branch_name:"支店名",
  deposit_type:"預金種別",
  account_number:"口座番号",
  account_holder:"口座名義",
  referral_code:"紹介コード"
}

const sex=["男","女"];


function a11yProps(index) {
  return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

class UserDetail extends Component {

    state = {
        language:JSON.parse(localStorage.language).language,
        userid:"",
        userdata:{},
        spin:false,
        value:0,
        pointhistory:[],
        messages:[],
        message:"",
    }; 
 
  handleGoback = (event) =>{
    window.history.back();
  }


  componentDidMount(){
     var path = window.location.href;
     var tokens = path.split("/");
     var id = tokens[tokens.length-1];
     this.setState({userid:id});
     this.getUserdetailData(id);
  }

  getUserdetailData(id){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    this.setState({spin:true});
    var config = {
      method: 'get',
      url: `${baseurl}/api/user/${id}`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
        data : {},
    };  
    axios(config)
    .then((response) => {
      var userdata = JSON.parse(response.data.user)[0];
      this.setState({
        userdata:userdata.fields,
        spin:false
      });
      this.getUserPointHistory(id);
    })
    .catch((error)=> {
      this.setState({spin:false})
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
    });
  }

  getUserPointHistory(id){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var config = {
      method: 'get',
      url: `${baseurl}/api/point/history/${id}`,
      headers: { 
      'Authorization': 'Bearer ' + token,
      },
        data : {},
    };
    axios(config)
    .then((response) => {
      var pointhistory = JSON.parse(response.data.pointhistroy);
      console.log(pointhistory)
      this.setState({
        pointhistory:pointhistory
      });
    })
    .catch((error)=> {
      this.setState({spin:false})
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
    });
  }

  handleChange = (event,newValue)=>{
    clearInterval(this.interval);
    this.setState({
        value:newValue,
    })
    if(newValue==2)
    {
      this.getMessages();
    }
  }

  handleChangeMessage = filedName => e=>{
    this.setState({
        [filedName]:e.target.value
    })
  }

  getMessages(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token
    var config = {
        method: 'get',
        url: `${baseurl}/api/getmessages/${this.state.userid}`,
        headers: { 
        'Authorization': 'Bearer ' + token,
        },
            data : {},
    };
    axios(config)
    .then((response) => {
        this.setState({
            messages:JSON.parse(response.data.messages),
        });
        console.log(JSON.parse(response.data.messages))
    })
    .catch((error)=>{
        this.setState({
            loading:false
        })
        if (error.response) {
            if(error.response.status===401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
        }
    })

    this.interval = setInterval(() => {
      var userData = JSON.parse(localStorage.userData);
      var token = userData.token
      var config = {
          method: 'get',
          url: `${baseurl}/api/getmessages/${this.state.userid}`,
          headers: { 
          'Authorization': 'Bearer ' + token,
          },
              data : {},
      };
      axios(config)
      .then((response) => {
          this.setState({
              messages:JSON.parse(response.data.messages),
          });
      })
      .catch((error)=>{
          this.setState({
              loading:false
          })
          if (error.response) {
              if(error.response.status===401){
                  localStorage.removeItem("userData");
                  window.location.assign('/');
              }
          }
      })
    },5000)
}

componentWillUnmount() {
  clearInterval(this.interval)
}


handleSubmit = e =>{
    e.preventDefault();
    const {message} = this.state;
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token
    if(message==""){
        return
    }
    var data = JSON.stringify({"message":message, user:this.state.userid});
    var config = {
      method: 'post',
      url: `${baseurl}/api/sendmessage`,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      data : data
    };
    axios(config)
    .then((response)=>{
        this.setState({message:""});
        this.getMessages();
    })
    .catch((error)=>{
        if(error.response.status===401){
            localStorage.removeItem("userData");
            window.location.assign('/');
        }
    });
}

 render() {
   const { userdata,language, userid, value, pointhistory} = this.state;
    return(
      <Page
        className="root"
        title="Akushu|UserDetail"
      >
        <Container maxWidth={false}>
            <Box
                display="flex"
                justifyContent="space-between"
            >              
                <div className="page-title">
                    <a className="before-page" onClick={this.handleGoback} href="#">◀ {eval(language).back}</a>
                    <span>{eval(language).UserDetail} </span>
                </div>
            </Box>
            <Box mt={3}>
                <Card>
                  <CardContent className="tab-Card">
                     <AppBar className="tab-Header" position="static">
                        <Tabs value={value} onChange={this.handleChange} aria-label="">
                            <Tab style={{color:"black", fontSize:"18px", fontWeight:"600"}} label="ユーザー" {...a11yProps(0)} />
                            <Tab style={{color:"black",fontSize:"18px", fontWeight:"600"}} label="ポイント履歴" {...a11yProps(1)} />
                            <Tab style={{color:"black",fontSize:"18px", fontWeight:"600"}} label="メッセージ履歴" {...a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                      <Box minWidth={1050} >
                          <Table className="artdetail_table">
                          <TableBody>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).userid}
                                  </TableCell>
                                  {userdata.id}
                                  <TableCell colSpan="4">
                                  {userid}
                                  </TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).artistname}
                                  </TableCell>
                                  <TableCell className="filedname">
                                    {eval(language).name}
                                    <br/>
                                    {eval(language).name_freegana}
                                    <br/>
                                  </TableCell>
                                  <TableCell  colSpan="3">
                                    {`${userdata.name1?userdata.name1:""} ${userdata.name2?userdata.name2:""}`}
                                    <br/>  
                                    {`${userdata.kana1?userdata.kana1:""} ${userdata.kana2?userdata.kana2:""}`}
                                    <br/> 
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).maiden_name}
                                  </TableCell>
                                  <TableCell  colSpan="4">
                                    {userdata.maidenname}
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).gender}
                                  </TableCell>
                                  <TableCell  colSpan="4">
                                  {sex[userdata.gender]}
                                  </TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).email}
                                  </TableCell>
                                  <TableCell colSpan="4">
                                  {userdata.email}
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).address}
                                  </TableCell>
                                  <TableCell className="filedname"> 
                                    {eval(language).prefectures}
                                    <br/>
                                    {eval(language).municipalities}
                                    <br/>
                                    {eval(language).street_number}
                                    <br/>
                                    {eval(language).building_number}
                                  
                                  </TableCell>
                                  <TableCell colSpan="3">
                                    {userdata.address1} 
                                    <br/>
                                    {userdata.address2}  
                                    <br/>
                                    {userdata.street}
                                    <br/>
                                    {userdata.buildingName}
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).phone_number}
                                  </TableCell>
                                  <TableCell colSpan="4">
                                  {userdata.phone}
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).birthday}
                                  </TableCell>
                                  <TableCell colSpan="4">
                                  {userdata.birthday}
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).avatar}
                                  </TableCell>
                                  <TableCell colSpan="4">
                                  <Avatar
                                    className="certificate_image"
                                    src={userdata.avatar ? `${baseurl}/media/${userdata.avatar}`:""}
                                  >
                                  </Avatar>
                                  </TableCell>                                    
                              </TableRow>
                              <TableRow>
                                  <TableCell className="filedname">
                                    {eval(language).bank_account}
                                  </TableCell>
                                  <TableCell className="filedname"> 
                                    {eval(language).bank_name}
                                    <br/>
                                    {eval(language).branch_name}
                                    <br/>
                                    {eval(language).deposit_type}
                                    <br/>
                                    {eval(language).account_number}
                                    <br/>
                                    {eval(language).account_holder}
                                  </TableCell>                                
                                  <TableCell>
                                  {userdata.bankName}
                                  <br/>
                                  {userdata.branchName}
                                  <br/>
                                  {userdata.depositType}
                                  <br/>
                                  {userdata.accountNumber}
                                  <br/>
                                  {userdata.accountName}
                                  </TableCell>
                              </TableRow>
                          </TableBody>
                          </Table>
                      </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <Table className="result_table">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  コンテンツ
                                </TableCell>
                                <TableCell>
                                  年月日
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {pointhistory.map((history) => (
                                <TableRow
                                  hover
                                  key={history.pk}
                                >
                                  <TableCell>
                                  {history.fields.content}
                                  </TableCell>
                                  <TableCell>
                                    {history.fields.created_at}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <div className="notification-container">
                          <div className="chat-card">
                              <div className="chat-card-content">
                                  <div className="chat-card-content1">
                                      {this.state.messages.map(item=>(
                                          <div key={item.pk} className={item.fields.send ? "chat-outbox" : "chat-inbox"}>
                                              {item.fields.send ? <img src={userdata.avatar ? `${baseurl}/media/${userdata.avatar}`:""} /> : ""}
                                              <p>{item.fields.content}</p>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                              <form onSubmit={this.handleSubmit}>
                                  <div className="chat-input">
                                      <input type="text" onChange={this.handleChangeMessage("message")} value={this.state.message}/>
                                      <button onClick={this.handleSubmit}><img src="/assets/image/top-foot-link2.png" /></button>
                                  </div>
                              </form>
                          </div>
                      </div>
                    </TabPanel>
                  </CardContent>
                </Card>
            </Box>
        </Container>
        <Dialog
            className="spin-modal"
            open={this.state.spin}      
            disableBackdropClick
        >
            <CircularProgress />
        </Dialog>
      </Page>    
    );
 }
};
export default UserDetail;