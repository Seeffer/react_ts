import * as React from 'react';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios';
// import { render } from 'react-dom';

const theme = createMuiTheme({
  overrides: {
    MuiButton: { // Name of the component ⚛️ / style sheet
      root: { width: '200px', backgroundColor: '#90caf9' },
    },
    MuiTableCell: {
      root: { paddingLeft: '10px', border: '1px', borderLeft: '1px solid rgba(224, 224, 224, 1)' },
    },
    MuiTableRow: {
      root: { height: '24px' }
    }
  },
  palette: {
    type: 'light',
  },
});

const styles = (thm: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: thm.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      border: '1px solid rgba(224, 224, 224, 1)',
      width: '80%', 
      margin: 40,
      padding: 'dense'
    },
    progress: {
      margin: thm.spacing.unit * 2,
    },
  });

type rowType = {id: number, name: string, value: string};
type State = {
  rows: rowType[];
  baseUrl: string;
  policyNumber: string;
  inProgress: boolean;
};

let id = 0;
function createData(name: string, value: string): rowType {
  id += 1;
  var newRow: rowType = { id: id, name: name, value: value };
  return newRow;
}

class Index extends React.Component<WithStyles<typeof styles>, State> {
  constructor(props: any) {
    super(props);
    this.state = { 
      rows: [], 
      baseUrl: 'http://localhost/PolicyAPI/api/PolicyRetrieve/GetPolicyInformation/',
      policyNumber: '7608328501',
      inProgress: false
    };
    this.handleResponse = this.handleResponse.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChangePolicy = this.handleChangePolicy.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
  }

  testAxios(): any {
    console.log('testAxios - Entered');
  
    const config: AxiosRequestConfig = {
      url: '/user',
      method: 'get',
      baseURL: this.state.baseUrl,
      transformRequest: (data: any) => data,
      transformResponse: [
        (data: any) => ({ data })
      ],
      headers: { 'SourceSystemIdentifier': 'PUMA' },
      params: { id: 12345 },
      paramsSerializer: (params: any) => 'id=12345',
      data: { foo: 'bar' },
      timeout: 100000,
      withCredentials: true,
      responseType: 'json',
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      // onUploadProgress: (progressEvent: any) => {},
      // onDownloadProgress: (progressEvent: any) => {},
      maxContentLength: 2000,
      validateStatus: (status: number) => status >= 200 && status < 300,
      maxRedirects: 5,
      proxy: {
        host: '127.0.0.1',
        port: 9000
      },
      // cancelToken: new axios.CancelToken((cancel: Canceler) => {})
    };
  
    axios.get('/' + this.state.policyNumber, config)
      .then(this.handleResponse)
      .catch(this.handleError);
  }
  
  handleResponse(response: AxiosResponse) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);

    var policyData = response.data;
    if (policyData) {
      var r: rowType[] = [];
      for (var key in policyData.data.PolicyInfo) {
        if (policyData.data.PolicyInfo.hasOwnProperty(key)) {
          console.log(key + '\t' + policyData.data.PolicyInfo[key]);
          r.push(createData(key, policyData.data.PolicyInfo[key]));
        }
      }
      this.setState({ rows: r });
    }
    this.setState({ inProgress: false });
  }

  handleError(error: AxiosError) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else {
      console.log(error.message);
    }
    this.setState({ inProgress: false });
  }

  handleClick() {
    console.log('handleClick');
    this.setState({ inProgress: true });
    this.testAxios();
  }
  
  handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ baseUrl: event.target.value });
  };
  
  handleChangePolicy = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ policyNumber: event.target.value });
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Paper className={this.props.classes.root}>
          <TextField 
            label="URL" 
            defaultValue="http://localhost/PolicyAPI/api/PolicyRetrieve/GetPolicyInformation/" 
            style={{width: '75%', margin: 10}}
            value={this.state.baseUrl}
            onChange={this.handleChangeUrl}
          /><p/>
          <TextField 
            label="Policy Number" 
            defaultValue="7608328501" 
            style={{margin: 10}}
            value={this.state.policyNumber}
            onChange={this.handleChangePolicy}
          /><p/>
          <div style={{position: 'relative', width: '220px'}}>
            <Button 
              variant="outlined" 
              style={{margin: 10}}
              disabled={this.state.inProgress}
              onClick={this.handleClick}
            >
              Call Service
            </Button>
            {this.state.inProgress  
                && 
              <CircularProgress 
                    style={{position: 'absolute', top: '50%', left: '50%',
                            marginLeft: '-12px', marginTop: '-12px'}} 
                    size={24} 
                    className={this.props.classes.progress} 
              />
            } 
          </div>
          <Table className={this.props.classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Index);