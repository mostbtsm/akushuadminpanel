
import React, {Component} from 'react';

import {
  Avatar,
  Box,
  Container,
  ButtonGroup,
  Button,
  Card,
  CardContent,
  TextField,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  IconButton,
  Slide,
  SvgIcon,
  DialogTitle,
  DialogContent,
  DialogContentText,
  
} from '@material-ui/core';
import Page from 'src/components/Page';
import { Search as SearchIcon } from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Pagination from '@material-ui/lab/Pagination';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Transitionalert = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const en={
  search:"Search",
  title:"Registered Users List",
  searchPlaceholder:"Search (User name, User Email)",
  userName:"User Name",
  userNamekana:"Kana Name",
  email:"Email",
  point:"Points",
  category:"Category",
  image:"Image",
  addfilter:"Add Filter",
  sort:"Sort",
  artWorkname:"Artwork Name",
  season:"Season",
  color:"Color",
  detail:"DETAIL",
  conditionStatus:"Condition Status",
  regDate:"Registered Date",
  applybutton:"APPLY",
  resetButton:"RESET",
  pageShow:"Show",
  ok:"O K",
  reflection:"REFLECTION",
  artistDataSyncTitle:"Synchronize artwork data",
  artistDatasyncContent:"Sync data has been called",
  status:"Artwork syncing",
  searchresult:"Search result",
  allrecord:"All record",
  error:"error", 
}

const jp={
  search:"検索",
  title:"登録ユーザー一覧",
  searchPlaceholder:"フリーワード検索（ユーザー名、メールアドレス）",
  userName:"ユーザー名",
  userNamekana:"ユーザー名",
  email:"メールアドレス",
  point:"ポイント",
  category:"カテゴリー",
  image:"イメージ",
  addfilter:"フィルターを追加",
  sort:"ソート",
  artWorkname:"作品名",
  season:"季節",
  color:"色合い",
  detail:"詳    細",
  conditionStatus:"状態（ステータス）",
  regDate:"登録日",
  applybutton:"適  用",
  resetButton:"リセット",
  pageShow:"表示する行数",
  ok:"確認",
  reflection:"即 反 映",
  artistDataSyncTitle:"作品データを同期",
  artistDatasyncContent:"同期データが呼び出されました。",
  status:"作品情報連携中",
  searchresult:"検索結果",
  allrecord:"全レコード",
  error:"失敗", 
}

class UserView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language:JSON.parse(localStorage.language).language,
      filter: {
        Keywords: "",
        PageSize: 10,
        PageNumber: 1,
      },
      pageCount:0,
      totalRecords:0,
      userdata:[],
      SelectedUserids:[],
      initSelectedArray:true,
      Alertmodal:false,
      alertTitle:"",
      alertContent:"",
      spin:false
    };
  }

  handleSelectAll = (event) => {   
    const {userdata,SelectedUserids,filter}=this.state;
    var pageNumber = filter.PageNumber-1;
    let newselectedWorksIds=[];
    if (event.target.checked) {
      newselectedWorksIds = userdata.map((work) => work.id);
    } else {
      newselectedWorksIds = [];
    }
    SelectedUserids[pageNumber] = newselectedWorksIds
    this.setState({
      SelectedUserids:SelectedUserids
    });
  };

  handleSelectOne = (event, id) =>{
    const {SelectedUserids,filter}=this.state;
    var pageNumber = filter.PageNumber - 1;
    const selectedIndex = SelectedUserids[pageNumber].indexOf(id);
    let newselecteduserIds = [];
    if (selectedIndex === -1) {
      newselecteduserIds = newselecteduserIds.concat(SelectedUserids[pageNumber], id);
    } else if (selectedIndex === 0) {
      newselecteduserIds = newselecteduserIds.concat(SelectedUserids[pageNumber].slice(1));
    } else if (selectedIndex === SelectedUserids[pageNumber].length - 1) {
      newselecteduserIds = newselecteduserIds.concat(SelectedUserids[pageNumber].slice(0, -1));
    } else if (selectedIndex > 0) {
      newselecteduserIds = newselecteduserIds.concat(
        SelectedUserids[pageNumber].slice(0, selectedIndex),
        SelectedUserids[pageNumber].slice(selectedIndex + 1)
      );
    }
    SelectedUserids[pageNumber] = newselecteduserIds;
    this.setState({
      SelectedUserids:SelectedUserids
    });
  };

  handlePagenation = (events,PageNumber)=>{
    const {filter} = this.state;
    filter.PageNumber = PageNumber;
    this.setState({
        filter:filter
    });
    this.getuserData(filter);
  }

  handlePagecount = (events)=>{
    const {filter} = this.state;
    var prevepageSize = filter.PageSize;
    var prevepageNumber = filter.PageNumber;
    var currentPagesize = events.target.value;
    filter.PageSize = currentPagesize; 
    filter.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        filter:filter,
        initSelectedArray:true
    });
    this.getuserData(filter);
  }


  handleCloseAlertModal =(event)=>{
    this.setState({
        Alertmodal:false
      });
  }


  handleFilterChange = dataFiledName => event=>{
    this.setState({
      [dataFiledName]: event.target.value
    });
  }

  handleKeyword = (event)=>{
    const {filter} = this.state;
    filter.Keywords = event.target.value;
    this.setState({filter:filter});
  }


  searchbyKeywords = (event) =>{
    event.preventDefault();
    var {filter} = this.state;
    this.setState({
      initSelectedArray:true,
    }) 
    this.getuserData(filter);
  }

  searchbyKeywordsclick = (event) =>{
    var {filter} = this.state;
    this.setState({
      initSelectedArray:true,
    }) 
    this.getuserData(filter);
  }

  componentDidMount(){

    const {filter} = this.state;
    this.getuserData(filter);

  } 
 
  getuserData(filter){
      var userData = JSON.parse(localStorage.userData);
      var token = userData.token;
      var pageCount, totalRecords;
      var config = {
        method: 'post',
        url: `${baseurl}/api/getusers`,
        headers: { 
          'Authorization': 'Bearer ' + token,
      },
        data : filter,
      };
      this.setState({
        spin:true
      });
      axios(config)
      .then((response) => {
        var responsedata = response.data.users;
        pageCount = response.data.pageCount;
        if(this.state.initSelectedArray)
        {
          var SelectedUserids = new Array();
          for(var i=0; i<=pageCount; i++)
          {
            var temp= new Array();
            SelectedUserids.push(temp);
          }
          this.setState({
            SelectedUserids:SelectedUserids,
            initSelectedArray:false
          });
        }
        totalRecords = response.data.totalRecord;
        this.setState({
          pageCount: pageCount,
          totalRecords:totalRecords,
          userdata:responsedata,
          spin:false
        });
      })
      .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
        } 
        this.setState({
          pageCount: 0,
          totalRecords:0,
          userdata:[],
          spin:false
        });
    }); 
  }

 render() {
   const {userdata, totalRecords, SelectedUserids,  language, pageCount, alertContent, alertTitle, Alertmodal} = this.state;
   let pageSize = this.state.filter.PageSize;
   let PageNumber = this.state.filter.PageNumber;
   var Selectedids = SelectedUserids[PageNumber-1] ? SelectedUserids[PageNumber-1] : [];
   console.log(totalRecords)
   return(
      <Page
        className="root"
        title="Akushu|User"
      >
        <Container maxWidth={false}>
          <div className="tool-bar">
              <Box
                display="flex"
                justifyContent="space-between"
              >              
                <div className="page-title">                
                <span>{eval(language).title} </span>
                  {this.state.syncstatus ? <span className="statues">{eval(language).status}</span>:""}
                </div>
              </Box>
              <Box mt={3}>
                <Card>
                  <CardContent>
                    <Box 
                      className="search-toolbar"
                    >                   
                      <form className="search-form" onSubmit={this.searchbyKeywords}>
                        <Box className="search-box" alignItems="center">
                          <TextField
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SvgIcon
                                    fontSize="small"
                                    color="action"
                                  >
                                    <SearchIcon />
                                  </SvgIcon>
                                </InputAdornment>
                              )
                            }}
                            placeholder={eval(language).searchPlaceholder}
                            variant="outlined"
                            onChange={this.handleKeyword}
                            value={this.state.filter.Keywords}
                          />
                          <Button className="search-button" onClick={this.searchbyKeywordsclick}> {eval(language).search} </Button>
                        </Box>
                      </form>
                    </Box>
                    <div className="searchresult">{eval(language).searchresult}:&nbsp;&nbsp;{totalRecords}</div>
                    {totalRecords==0 ? "":
                    <PerfectScrollbar>
                      <Box minWidth={1050} >
                        <Table className="result_table">
                          <TableHead>
                            <TableRow>
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={Selectedids.length === userdata.length && userdata.length!==0}
                                  color="primary"
                                  indeterminate={
                                    Selectedids.length > 0
                                    && Selectedids.length < userdata.length
                                  }
                                  onChange={this.handleSelectAll}
                                />
                              </TableCell>
                              <TableCell>
                              {eval(language).userName}
                              </TableCell>
                              <TableCell>
                              {eval(language).userNamekana}
                              </TableCell>
                              <TableCell>
                              {eval(language).email}
                              </TableCell>
                              <TableCell>
                              {eval(language).point}
                              </TableCell>
                              <TableCell>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userdata.map((user) => (
                              <TableRow
                                hover
                                key={user.pk}
                                selected={Selectedids.indexOf(user.pk) !== -1}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={Selectedids.indexOf(user.pk) !== -1}
                                    onChange={(event) => this.handleSelectOne(event, user.pk)}
                                    value="true"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Box
                                    alignItems="center"
                                    display="flex"
                                  >
                                    <Avatar className="avatar"
                                      src={user.avatar ? `${baseurl}/media/${user.avatar}`:""}
                                    >
                                    </Avatar>
                                    <Typography
                                      color="textPrimary"
                                      variant="body1"
                                    >
                                      {user.name1 + user.name2}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                {user.kana1 + user.kana2}
                                </TableCell>
                                <TableCell>
                                {user.email}
                                </TableCell>
                                <TableCell>
                                {user.point}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    className="btn btn-detail"
                                    onClick={e=>{window.location.assign(`user/detail/${user.pk}`)}}
                                  >
                                   {eval(language).detail}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </PerfectScrollbar>
                    }
                    <Box className="pagination">
                      <Box className="pageCountarea">
                          <label>{eval(language).pageShow}:
                              <select className="pageCount" value={pageSize} onChange={this.handlePagecount}>
                                  <option value={5}>5</option>
                                  <option value={10}>10</option>
                                  <option value={20}>20</option>
                              </select>
                          </label>
                      </Box>
                      <Pagination count={pageCount} page={PageNumber} className="paginationitem"  onChange={this.handlePagenation} variant="outlined" color="primary" />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
          </div>
          <Dialog
          className="alert-modal"
          open={Alertmodal}
          TransitionComponent={Transitionalert}
          keepMounted
          onClose={this.handleCloseAlertModal}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
       >
        <DialogTitle id="alert-dialog-slide-title" style={{textAlign:"center"}}>{alertTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {alertContent}
          </DialogContentText>
          <div className="search-btn">
            <Button onClick={this.handleCloseAlertModal} className="btn btn-search">
              {eval(language).ok}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
        <Dialog
            className="spin-modal"
            open={this.state.spin}      
            disableBackdropClick
        >
            <CircularProgress />
        </Dialog>
      </Container>
    </Page>
    
    );
 }
};
export default UserView;