import React, {Component} from 'react';
import MaterialTable from 'material-table';import { forwardRef } from 'react';
import ipfs from '../ipfs';


import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import InsertLinkIcon from '@material-ui/icons/InsertLink';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    LinkIcon: forwardRef((props, ref) => <InsertLinkIcon {...props} ref={ref} />)
  };

const all = require('it-all');
export class SearchTab extends Component{
  
  async componentDidMount(){
    await this.populateFolders()
    await this.populateFilePerFolder()
  }

  constructor(props){
    super(props);
    this.state = {
      folders: [],
      data: []
    }
  }


  async populateFolders(){
    const folderMeta = await all(ipfs.files.ls('/'))
    const folders = folderMeta.filter(f => f.type==="directory").map((f,i)=>({
      id:i,
      name:f.name,
      type:'Directory',
      cid:f.cid.toString()
    }))
    this.setState({folders})
  }

  async populateFilePerFolder(){
    // Get files and populate data
    Promise.all(this.state.folders.map(async (f,i)=>{
      const path = '/'+f.name
      return await all(ipfs.files.ls(path))
    })).then((results)=>{
      var data = [].concat.apply(this.state.folders,results.map((fs,pid)=>{
        return fs.map((f)=>({
          id: -1,//gives some weird bug without this fk it
          parentId: pid,
          type: 'File',
          name:f.name,
          cid:f.cid.toString()
        }))
      }))
      this.setState({data})
    })
  }

  render() {
    return (
      <MaterialTable
        icons = {tableIcons}
        title="Search for a file by it's filename or it's hash"
        data={this.state.data}
        columns={[
          { title: 'Name', field: 'name' },
          {title: 'Filetype',field:'type'},
          { title: 'CID', field: 'cid' },
        ]}
        parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
        options={{
          search: true,
          searchFieldAlignment: 'right',
          actionsColumnIndex: -1
        }}
        actions={[
          {
            icon:() => <InsertLinkIcon />,
            tooltip: 'View',
            onClick: (event, rowData) => {
              const url = 'https://ipfs.io/ipfs/'+rowData.cid
              window.open(url, '_blank', 'noopener,noreferrer')
            }
          }
        ]}
      />
    )
  }
}

