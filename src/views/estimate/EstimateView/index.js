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
  TableHead,
  ButtonGroup,
  Button,
  TextField,
  Checkbox,
  InputAdornment,
  Typography,
  IconButton,
  SvgIcon, 
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import CircularProgress from '@material-ui/core/CircularProgress';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Pagination from '@material-ui/lab/Pagination';
import Page from 'src/components/Page';
import axios from 'axios';
const baseurl = process.env.REACT_APP_BASE_URL;
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

const typelist =[
    "土地", "戸建", "マンション", "収益物件", "ホテル", "軍用地", "ヤード", "農地"
]

const arealist = [
    "県内全域","那覇市内","南部","中部", "北部", "各市町村", "リゾート用地", "県外", "その他"
]

const periodlist = [
    "3ヵ月以内", "半年以内", "1年以内", "いい物件があれば"
]

const selfmoneylist = [
    "無", "10%", "20%", "30%", "現金購入"
]

class EstimatesView extends Component {

    state = {
        language:JSON.parse(localStorage.language).language,
        spin:false,
        value:0,
        buylist:[],
        selllist:[],
        pageCount1:0,
        totalRecords1:0,
        pageCount2:0,
        totalRecords2:0,
        filter1: {
            Keywords: "",
            PageSize: 10,
            PageNumber: 1,
        },

        filter2: {
            Keywords: "",
            PageSize: 10,
            PageNumber: 1,
        },

    }; 
 
  handleGoback = (event) =>{
    window.history.back();
  }

  handleChange = (event,newValue)=>{
    this.setState({
        value:newValue,
    })
  }

  componentDidMount()
  {
      const {filter1, filter2} = this.state;
      this.getBuyList(filter1);
      this.getSellList(filter2);
  }

  getBuyList(filter){
        var userData = JSON.parse(localStorage.userData);
        var token = userData.token;
        var pageCount, totalRecords;
        var config = {
        method: 'post',
        url: `${baseurl}/api/estimate/getbuylist`,
        headers: { 
            'Authorization': 'Bearer ' + token,
        },
        data : filter,
        };

        axios(config)
        .then((response) => {
            var responsedata = response.data.estimates;
            pageCount = response.data.pageCount;
            totalRecords = response.data.totalRecord;
            this.setState({
                pageCount1: pageCount,
                totalRecords1:totalRecords,
                buylist:responsedata,
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
                pageCount1: 0,
                totalRecords1:0,
                buylist:[]
            });
        });
  }
  
  getSellList(filter){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.token;
    var pageCount, totalRecords;
    var config = {
    method: 'post',
    url: `${baseurl}/api/estimate/getselllist`,
    headers: { 
        'Authorization': 'Bearer ' + token,
    },
    data : filter,
    };

    axios(config)
    .then((response) => {
        var responsedata = response.data.estimates;
        pageCount = response.data.pageCount;
        totalRecords = response.data.totalRecord;
        this.setState({
            pageCount2: pageCount,
            totalRecords2:totalRecords,
            selllist:responsedata,
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
            pageCount2: 0,
            totalRecords2:0,
            selllist:[]
        });
    });
  }

  
  handleKeyword1 = (event)=>{
    const {filter1} = this.state;
    filter1.Keywords = event.target.value;
    this.setState({filter1:filter1});
  }


  searchbyKeywords1 = (event) =>{
    event.preventDefault();
    var {filter1} = this.state;
    this.getBuyList(filter1);
  }

  searchbyKeywordsclick1 = (event) =>{
    var {filter1} = this.state;
    this.getBuyList(filter1);
  }

  handleKeyword2 = (event)=>{
    const {filter2} = this.state;
    filter2.Keywords = event.target.value;
    this.setState({filter2:filter2});
  }


  searchbyKeywords2 = (event) =>{
    event.preventDefault();
    var {filter2} = this.state;
    this.getSellList(filter2);
  }

  searchbyKeywordsclick2 = (event) =>{
    var {filter2} = this.state;
    this.getSellList(filter2);
  }
  
  handlePagenation1 = (events,PageNumber)=>{
    const {filter1} = this.state;
    filter1.PageNumber = PageNumber;
    this.setState({
        filter1:filter1
    });
    this.getBuyList(filter1);
  }

  handlePagecount1 = (events)=>{
    const {filter1} = this.state;
    var prevepageSize = filter1.PageSize;
    var prevepageNumber = filter1.PageNumber;
    var currentPagesize = events.target.value;
    filter1.PageSize = currentPagesize; 
    filter1.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        filter1:filter1,
    });
    this.getBuyList(filter1);
  }

  handlePagenation2 = (events,PageNumber)=>{
    const {filter2} = this.state;
    filter2.PageNumber = PageNumber;
    this.setState({
        filter2:filter2
    });
    this.getBuyList(filter2);
  }

  handlePagecount1 = (events)=>{
    const {filter2} = this.state;
    var prevepageSize = filter2.PageSize;
    var prevepageNumber = filter2.PageNumber;
    var currentPagesize = events.target.value;
    filter2.PageSize = currentPagesize; 
    filter2.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        filter2:filter2,
    });
    this.getBuyList(filter2);
  }

 render() {
   const {value, filter1, filter2, pageCount1, pageCount2, totalRecords1, totalRecords2, buylist, selllist} = this.state;
   console.log(selllist)
   let pageSize1 = this.state.filter1.PageSize;
   let PageNumber1 = this.state.filter1.PageNumber;
   let pageSize2 = this.state.filter2.PageSize;
   let PageNumber2 = this.state.filter2.PageNumber;
    return(
      <Page
        className="root"
        title="Akushu|UserDetail"
      >
        <Container maxWidth={false}>
            
            <Box mt={3}>
                <Card>
                  <CardContent className="tab-Card">
                     <AppBar className="tab-Header" position="static">
                        <Tabs value={value} onChange={this.handleChange} aria-label="">
                            <Tab style={{color:"black", fontSize:"18px", fontWeight:"600"}} label="購入一覧" {...a11yProps(0)} />
                            <Tab style={{color:"black",fontSize:"18px", fontWeight:"600"}} label="販売一覧" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                      <Box minWidth={1050} >
                        <form className="search-form" onSubmit={this.searchbyKeywords1}>
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
                                    variant="outlined"
                                    onChange={this.handleKeyword1}
                                    value={this.state.filter1.Keywords}
                                />
                                <Button className="search-button" onClick={this.searchbyKeywordsclick1}> 検 索 </Button>
                            </Box>
                        </form>
                        {totalRecords1==0 ? "":
                            <PerfectScrollbar>
                            <Box minWidth={1050} >
                                <Table className="result_table">
                                <TableHead>
                                    <TableRow>
                                    <TableCell>
                                        種目
                                    </TableCell>
                                    <TableCell>
                                        エリア
                                    </TableCell>
                                    <TableCell>
                                        ㎡/坪
                                    </TableCell>
                                    <TableCell>
                                        希望予算
                                    </TableCell>
                                    <TableCell>
                                        氏名
                                    </TableCell>
                                    <TableCell>
                                        TEL
                                    </TableCell>
                                    <TableCell>
                                        メールアドレス
                                    </TableCell>
                                    <TableCell>
                                        期日・見込
                                    </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {buylist.map((estimate) => (
                                    <TableRow
                                        hover
                                        key={estimate.pk}
                                    >
                                        <TableCell>
                                            {typelist[estimate.type]}
                                        </TableCell>
                                        <TableCell>
                                            {arealist[estimate.area]}
                                        </TableCell>
                                        <TableCell>
                                            {estimate.size}
                                        </TableCell>
                                        <TableCell>
                                            {estimate.quatation}
                                        </TableCell>
                                        <TableCell>
                                            {estimate.name}
                                        </TableCell>
                                        <TableCell>
                                            {estimate.phone_number}
                                        </TableCell>
                                        <TableCell>
                                            {estimate.email_address}
                                        </TableCell>
                                        <TableCell>
                                            {periodlist[estimate.period]}
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
                                <label>表示する行数:
                                    <select className="pageCount" value={pageSize2} onChange={this.handlePagecount1}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </select>
                                </label>
                            </Box>
                            <Pagination count={pageCount1} page={PageNumber1} className="paginationitem"  onChange={this.handlePagenation1} variant="outlined" color="primary" />
                        </Box>
                      </Box>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <form className="search-form" onSubmit={this.searchbyKeywords2}>
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
                                    variant="outlined"
                                    onChange={this.handleKeyword2}
                                    value={this.state.filter2.Keywords}
                                />
                                <Button className="search-button" onClick={this.searchbyKeywordsclick2}> 検 索 </Button>
                            </Box>
                        </form>
                        {totalRecords2==0 ? "":
                            <PerfectScrollbar>
                            <Box minWidth={1050} >
                                <Table className="result_table">
                                <TableHead>
                                    <TableRow>
                                    <TableCell>
                                        種目
                                    </TableCell>
                                    <TableCell>
                                        エリア
                                    </TableCell>
                                    <TableCell>
                                        ㎡/坪
                                    </TableCell>
                                    <TableCell>
                                        希望予算
                                    </TableCell>
                                    <TableCell>
                                        自己資金
                                    </TableCell>
                                    <TableCell>
                                        氏名
                                    </TableCell>
                                    <TableCell>
                                        TEL
                                    </TableCell>
                                    <TableCell>
                                        メールアドレス
                                    </TableCell>
                                    <TableCell>
                                    期日・見込
                                    </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selllist.map((estimate) => (
                                    <TableRow
                                        hover
                                        key={estimate.pk}
                                    >
                                        <TableCell>
                                            {typelist[estimate.type]}
                                        </TableCell>
                                        <TableCell>
                                            {arealist[estimate.area]}
                                        </TableCell>
                                        <TableCell>
                                            {estimate.size}
                                        </TableCell>
                                        <TableCell>
                                            {estimate.quatation}
                                        </TableCell>
                                        <TableCell>
                                            {selfmoneylist[estimate.self_money]}
                                        </TableCell>
                                        <TableCell>
                                            {estimate.name}
                                        </TableCell>
                                        <TableCell>
                                            {estimate.phone_number}
                                        </TableCell>
                                        <TableCell>
                                            {estimate.email_address}
                                        </TableCell>
                                        <TableCell>
                                            {periodlist[estimate.period]}
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
                                <label>表示する行数:
                                    <select className="pageCount" value={pageSize2} onChange={this.handlePagecount2}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </select>
                                </label>
                            </Box>
                            <Pagination count={pageCount2} page={PageNumber2} className="paginationitem"  onChange={this.handlePagenation2} variant="outlined" color="primary" />
                        </Box>
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
export default EstimatesView;