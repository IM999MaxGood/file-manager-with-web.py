//im999 The im999maxgood_filemanager
const im999maxgood_filemanager = {

  //im999 filemanager load and run for this div
  mainDivId : '', 

  //im999 current path. filemanager runed for this path  
  browsedPath : '',

  //im999 list of file and folders current path
  listFilesAndFolders : [],

  //im999 url of REST server for api 
  api_url: 'http://localhost:8080/api/filemanager',


  //im999 starter function that load filemanager
  init(params){

    //alert('hellow world! '+params.selector);
    this.mainDivId = params.selector;

    this.getFileAndFolderList();

    this.showButtonRow();
    this.showPathLink();
    this.readyPathLink();
    this.readyInputPath();
    this.readyButtons();
    this.readyStatus();

    this.prepareForInputPath();
  }//init
  ,


  //im999 this fuction get list files and folders by call api and show list
  getFileAndFolderList(path=''){

    //var fileManager = this;  

    //var sendPath = path;

    //this.doAjax(pFunc='get-list-files', pIsLast=null, pFile=null, pPath=path, pFolderName=null, pSelectedItems=null, pFrom=null, pWhich=null, pItemName=null, pItemKind=null, pNewName=null);
    var data = { func: 'get-list-files', path: path  };  // Pass input data as JSON
    this.doAjax(data);

  }//getFileAndFolderList
  ,


  //im999 update path links of path row
  updatePathLink(){
    var strCurrentPath = this.getUrlLinks();
    $('#spLinkPath').html(strCurrentPath);
  }//updatePathLink
  ,


  //im999 update status row
  updateStatus(msg, type){
    $('#hStatus').attr('class',type);
    $('#hStatus span').html('Status: '+msg);
  }//updateStatus
  ,


  //im999 make links for any piece of current path
  getUrlLinks()
  {
    var i = 0;
    var sPath = '\\';
    var strLinks = '<a im999-data="\\">\\</a>';
    var path = this.browsedPath;
    var paths = path.split('\\');
    for(const p of paths) {
      i++;
      if(p.trim()!=''){
        sPath += p+'\\';
        if(i==paths.length){
          strLinks += '<span>'+p+'</span><span>\\</span>';      
        }else{
          strLinks += '<a im999-data="'+sPath+'">'+p+'</a><span>\\</span>';      
        }
      }
    }
    return strLinks;
  }//getUrlLinks
  ,


  //im999 this function show list of files and folders in html table 
  showFileAndFolderList(){
    var list = this.listFilesAndFolders;
    var div = this.mainDivId;

    var strTable = '<div class="tableFixHead"><table>';
    strTable += '<thead><tr><th>No</th><th>Kind</th><th>Name</th><th colspan="3">Actions</th><th><input type="checkbox" title="Select oe Deselect All" im999-data="A"></input></th></tr></thead>';

    var strDirs = '';
    var strFiles = '';
    for(var i=0; i<list.length; i++)
    {
      var x = i+1;
      var kind = list[i]['kind'];
      var name = list[i]['name'];
      if(kind == 'dir'){
        var strTmp ='<tr class="dir">';
        strTmp += '<td>'+x+'</td>';
        strTmp += '<td><span im999-data="K">'+kind+'</span></td>';
        strTmp += '<td><span im999-data="N">'+name+'</span></td>';
        if(name != '..'){
            /*
            strTmp += '<td><button type="button" title="Rename '+name+'" im999-data="R">R</button></td>';
            strTmp += '<td><button type="button" title="Delete '+name+'" im999-data="D">D</button></td>';
            strTmp += '<td><button type="button" title="Download '+name+'" im999-data="Down">🠋</button></td>';
            */
            strTmp += '<td><button type="button" title="Rename '+name+'" im999-data="R"><i class="fa fa-pencil-square-o"></i></button></td>';
            strTmp += '<td><button type="button" title="Delete '+name+'" im999-data="D"><i class="fa fa-trash"></i></button></td>';
            strTmp += '<td><button type="button" title="Download '+name+'" im999-data="Down"><i class="fa fa-download"></i></button></td>';

            //strTmp += '<td><button type="button" title="X">X</button></td></tr>';
            //strTmp += '<td><input type="checkbox" title="Select for batch Rename or Delete or Download or Copy or Move" class="select-check" im999-data="S" data-name="'+name+'" data-kind="'+kind+'" checked="false"></input></td></tr>';
            strTmp += '<td><input type="checkbox" title="Select for batch Rename or Delete or Download or Copy or Move" im999-data="S" data-name="'+name+'" data-kind="'+kind+'"></input></td></tr>';
        }
        strDirs += strTmp;
      }else{
        var strTmp ='<tr class="file">';
        strTmp += '<td>'+x+'</td>';
        strTmp += '<td><span im999-data="K">'+kind+'</span></td>';
        strTmp += '<td><span im999-data="N">'+name+'</span></td>';
        /*
        strTmp += '<td><button type="button" title="Rename '+name+'" im999-data="R">R</button></td>';
        strTmp += '<td><button type="button" title="Delete '+name+'" im999-data="D">D</button></td>';
        strTmp += '<td><button type="button" title="Download '+name+'" im999-data="Down">🠋</button></td>';
        */
        strTmp += '<td><button type="button" title="Rename '+name+'" im999-data="R"><i class="fa fa-pencil-square-o"></i></button></td>';
        strTmp += '<td><button type="button" title="Delete '+name+'" im999-data="D"><i class="fa fa-trash"></i></button></td>';
        strTmp += '<td><button type="button" title="Download '+name+'" im999-data="Down"><i class="fa fa-download"></i></button></td>';

        //strTmp += '<td><button type="button" title="X">X</button></td></tr>';
        //strTmp += '<td><input type="checkbox" title="Select for batch Rename or Delete or Download or Copy or Move" class="select-check" im999-data="S" data-name="'+name+'" data-kind="'+kind+'" checked="false"></input></td></tr>';
        strTmp += '<td><input type="checkbox" title="Select for batch Rename or Delete or Download or Copy or Move" im999-data="S" data-name="'+name+'" data-kind="'+kind+'"></input></td></tr>';
        strFiles += strTmp;
      }
    }
    strTable += '<tbody>' + strDirs + strFiles + '</tbody>';
    strTable += '</table></div>';

    if($('#'+div+' table').length){
      //$('#'+div).empty();
      //$('#'+div+' table').remove();
      $('#'+div+' .tableFixHead').remove();
    }

    $('#'+div).append(strTable);

  }//showFileAndFolderList
  ,
  

  //im999 this function make ready html table for click. define onClicks  
  readyTable(){

    //im999 define onClick for td Kind
    $('#div-file-list table tr span[im999-data="K"]').click(function() {
      im999maxgood_filemanager.doClickDir($(this));
    });

    //im999 define onClick for td Name
    $('#div-file-list table tr span[im999-data="N"]').click(function() {
      im999maxgood_filemanager.doClickDir($(this));
    });

    //im999 define onClick Select All or Deselect All
    $('#div-file-list table th input[im999-data="A"]').click(function() {
      var checked = $(this).is(':checked');
      if(checked){
        im999maxgood_filemanager.selectAll();
      }else{
        im999maxgood_filemanager.deselectAll();
      }
    });

    //im999 define onClick for Rename button
    var button = $('#div-file-list table button[im999-data="R"]');
    button.click(function() {
      var tds = $(this).parents('tr').children('td');
      
      var noRow = Number(tds.eq(0).html())-1;
      var kind = tds.eq(1).find('span').html();
      var name = tds.eq(2).find('span').html();

      im999maxgood_filemanager.doRename(name, kind);
    });

    //im999 define onClick for Delete button
    button = $('#div-file-list table button[im999-data="D"]');
    button.click(function() {
      var tds = $(this).parents('tr').children('td');
      
      var noRow = Number(tds.eq(0).html())-1;
      var kind = tds.eq(1).find('span').html();
      var name = tds.eq(2).find('span').html();

      im999maxgood_filemanager.doDelete(name, kind);
    });

    //im999 define onClick for Download button
    button = $('#div-file-list table button[im999-data="Down"]');
    button.click(function() {
      var tds = $(this).parents('tr').children('td');
      
      var noRow = Number(tds.eq(0).html())-1;
      var kind = tds.eq(1).find('span').html();
      var name = tds.eq(2).find('span').html();

      im999maxgood_filemanager.doDownload(name, kind);
    });

  }//readyTable
  ,


  //im999 this function show buttons row above of list of files and folders
  showButtonRow(){
    var div = this.mainDivId;
    var strBtn='';

    strBtn += '<div id="divButtons"><form>';
    /*
    strBtn += '<button type="button" title="Refresh" im999-data="refresh">R</button>';
    strBtn += '<button type="button" title="New Folder" im999-data="new folder">N</button>';
    strBtn += '<button type="button" title="Go to" im999-data="go to">G</button>';
    */
    strBtn += '<button type="button" title="Refresh" im999-data="refresh"><i class="fa fa-refresh"></i></button>';
    strBtn += '<button type="button" title="New Folder" im999-data="new folder"><i class="fa fa-plus-square"></i></button>';
    strBtn += '<button type="button" title="Go to" im999-data="go to"><i class="fa fa-arrow-right"></i></button>';

    /*
    strBtn += '<input id="fileUploader" type="file" name="files" title="select files for upload" multiple required hidden></input><button type="button" title="Upload" im999-data="upload">U</button>';
    */
    strBtn += '<input id="fileUploader" type="file" name="files" title="select files for upload" multiple required hidden></input><button type="button" title="Upload" im999-data="upload"><i class="fa fa-upload"></i></button>';

    /*
    strBtn += '<button type="button" title="Delete" im999-data="delete">D</button>';
    strBtn += '<button type="button" title="Download" im999-data="download">🠋</button>';
    strBtn += '<button type="button" title="Copy" im999-data="copy">C</button>';
    strBtn += '<button type="button" title="Move" im999-data="move">M</button>';
    strBtn += '<button type="button" title="Paste" im999-data="paste" disabled>P</button>';
    strBtn += '<button type="button" title="Cancel copy or move" im999-data="cancel" disabled>Cancel</button>';
    */
    strBtn += '<button type="button" title="Delete" im999-data="delete"><i class="fa fa-trash-o"></i></button>';
    strBtn += '<button type="button" title="Download" im999-data="download"><i class="fa fa-download"></i></button>';
    strBtn += '<button type="button" title="Copy" im999-data="copy"><i class="fa fa-files-o"></i></button>';
    strBtn += '<button type="button" title="Move" im999-data="move"><i class="fa fa-arrow-circle-o-right"></i></button>';
    strBtn += '<button type="button" title="Paste" im999-data="paste" disabled><i class="fa fa-clipboard"></i></button>';
    strBtn += '<button type="button" title="Cancel copy or move" im999-data="cancel" disabled><i class="fa fa-ban"></i></button>';

    /*
    strBtn += '<button type="button" title="Cancel copy or move" im999-data="c"><i class="delete-icon-im999"></i></button>';
    strBtn += '<button type="button" title="Cancel copy or move" im999-data="cancel" disabled><i class="delete-icon-im999"></i></button>';
    */

    strBtn += '</div>';    
    $('#'+div).append(strBtn);

  }//showButtonRow
  ,


  //im999 this function show path row below of buttons row
  showPathLink(){
    var div = this.mainDivId;

    /*
    var strCurrentPath = '<div id="hPath"><div><span>Path: </span><span id="spLinkPath">'+this.getUrlLinks()+'</span></div><div id="div-search-im999"><input type="text" title="input path"/><button type="button" title="close path list" im999-data="X">X</button><button type="button" title="go to inputed path" im999-data="Go">Go</button><div id="div-search-list-im999"></div></div></div><!--hPath-->';
    */
    var strCurrentPath = '<div id="hPath"><div><span>Path: </span><span id="spLinkPath">'+this.getUrlLinks()+'</span></div><div id="div-search-im999"><input type="text" title="input path"/><button type="button" title="close path list" im999-data="X"><i class="fa fa-times-circle-o"></i></button><button type="button" title="go to inputed path" im999-data="Go"><i class="fa fa-arrow-circle-right"></i></button><div id="div-search-list-im999"></div></div></div><!--hPath-->';

    $('#'+div).append(strCurrentPath);
  }//showPathLink
  ,


  //im999 this function make ready path row for click
  readyPathLink(){
    $('#hPath a').click(function() {
      var path = $(this).html();
      var sPath = $(this).attr('im999-data');
      im999maxgood_filemanager.getFileAndFolderList(sPath);
    });
  }//readyPathLink
  ,


  //im999 this function make ready input path
  readyInputPath(){
    var inputPath = $('#hPath input');
    inputPath.on('input', function(event){
      im999maxgood_filemanager.doInputPath(event);
    });

  }//readyInputPath
  ,


  //im999 this function make ready buttons for click
  readyButtons(){
    $('#div-file-list button').click(function() {
      var data = $(this).attr('im999-data').toLowerCase().trim();
      im999maxgood_filemanager.doJob(data);
    });
    
    $('#fileUploader').on('change', function(){
      im999maxgood_filemanager.onChangeDoUpload();
    });

    this.checkForPaste();
  }//readyButtons
  ,


  //im999 on change event for upload button
  onChangeDoUpload(){

    var fileInput = document.getElementById('fileUploader');
          
    const selectedFiles = fileInput.files;
    for (let i = 0; i < selectedFiles.length; i++) {
        if(i == (selectedFiles.length-1)){
          im999maxgood_filemanager.uploadFile(selectedFiles[i], 'yes');
        }else{
          im999maxgood_filemanager.uploadFile(selectedFiles[i], 'no');
        }
    }
    fileInput.files = null;
    fileInput.value = '';
  }//onChangeDoUpload
  ,


  //im999 upload file to server
  uploadFile(file, isLast){

    //var fileManager = this;  

    var sendPath = im999maxgood_filemanager.browsedPath;

    const data = new FormData();
    data.append('isLast', isLast);
    data.append('func', 'uploads');
    data.append('path', sendPath);
    data.append('file', file);

    //this.doAjax(data);

    $.ajax({
      type: 'POST',
      //type: 'GET',
      
      //im999 for waiting upload done
      async:false,

      //url: this.api_url,
      url: im999maxgood_filemanager.api_url+'/uploads',

      processData: false,
      contentType: false,
      
      data: data,
      
      success: function(response) {
        console.log('Python response:', response);
        // Handle the Python output (response) as needed

        //im999 because of web.header('Content-Type', 'application/json')
        //res = JSON.parse(response);
        res = response;

        if(isLast == 'yes'){
          p = res['path'];
          ff = res['files_folders'];

          im999maxgood_filemanager.listFilesAndFolders = ff;
          im999maxgood_filemanager.browsedPath = p;
          im999maxgood_filemanager.showFileAndFolderList();
          im999maxgood_filemanager.readyTable();
          im999maxgood_filemanager.updatePathLink();
          im999maxgood_filemanager.readyPathLink();
          im999maxgood_filemanager.updateStatus('upload files done.', 'ok');
          
          alert('Upload all files. Well done.');
        }
      },

      error: function(xhr, status, errors) {
        console.error('Error:', errors);

        if(isLast == 'yes'){
          im999maxgood_filemanager.updateStatus('Upload files failed.', 'error');
          //fileManager.listFilesAndFolders = [];
          //fileManager.updateStatus(error, 'error');
        }
      }
    });//$.ajax
  }//uploadFile
  ,
  

  //im999 this function show status row
  readyStatus(){
    var div = this.mainDivId;
    var strStatus = '<div id="hStatus" class="normal"><span>Status: </span></div>';
    $('#'+div).append(strStatus);
  }//readyStatus
  ,


  //im999 this function make ready input path for use after load list of files and folders
  prepareForInputPath(){
    $(window).click(im999maxgood_filemanager.doClickX(emptyInput=false));

    $('#div-search-im999').bind('click', function(event){
      event.stopPropagation()
    });
 
    $('#div-search-im999 input[type="text"]').bind('click', function(event){
      event.currentTarget.dispatchEvent(new Event('input'));

      event.stopPropagation();
    });  

    $('#div-search-im999 input[type="text"]').bind('keydown', function(event) {
      im999maxgood_filemanager.doKeyDownSearch(event);
    });
  }//prepareForInputPath
  ,


  doKeyDownSearch(event){
    //alert(event.keyCode);
    if(event.keyCode == 40){
      im999maxgood_filemanager.doAction('down');        
    }else if(event.keyCode == 38){
      im999maxgood_filemanager.doAction('up');        
    }else if(event.keyCode == 13){
      im999maxgood_filemanager.doAction('enter');        
    }else if(event.keyCode == 27){
      im999maxgood_filemanager.doAction('esc');        
    }
  },


  doAction(keyName){
    //var txtSearch = document.querySelector('#div-search-im999 input[type="text"]');
    var txtSearch = $('#div-search-im999 input[type="text"]');
    //var currentActive = document.querySelector('.div-search-list-im999-li-active');
    var currentActive = $('.div-search-list-im999-li-active');
    //var divLists = document.getElementById('div-search-list-im999');
    //var lis = document.querySelectorAll('#div-search-list-im999 ul li');
    var lis = $('#div-search-list-im999 ul li');

    if(keyName == 'enter'){
      //if(currentActive == null){
      if(currentActive.length == 0){
        //var btnGo = document.querySelector('#div-search-im999 button[im999-data="Go"]');
        //btnGo.click();
        $('#div-search-im999 button[im999-data="Go"]').click();
      }else{
        //currentActive.classList.remove('div-search-list-im999-li-active');
        currentActive.removeClass('div-search-list-im999-li-active');
        //txtSearch.value = currentActive.getAttribute('im999-data');
        //var str = currentActive.outerText
        var str = currentActive[0].textContent;
        //txtSearch.value = str.substring(0, str.length-2).replaceAll(' \\ ', '\\');
        txtSearch[0].value = str.substring(0, str.length-2).replaceAll(' \\ ', '\\');

        txtSearch.dispatchEvent(new Event('input'));
        //txtSearch.trigger('input');
      }
      return;
    }else if(keyName == 'esc'){
      if(lis.length == 0){
        //var btnX = document.querySelector('#div-search-im999 button[im999-data="X"]');
        //btnX.click();
        im999maxgood_filemanager.doClickX(emptyInput=true);
      }else{
        //if(currentActive != null){
        if(currentActive.length > 0){
          //currentActive.classList.remove('div-search-list-im999-li-active');
          currentActive.removeClass('div-search-list-im999-li-active');
        }
        im999maxgood_filemanager.doClickX(emptyInput=false);
      }
      return;
    }

    if(lis.length == 0){
      if(keyName == 'down'){
        txtSearch.dispatchEvent(new Event('input'));
      }
      return;
    }

    //if(currentActive == null){
    if(currentActive.length == 0){
      if(keyName == 'down'){
        lis[0].classList.add('div-search-list-im999-li-active');
        //lis[0].addClass('div-search-list-im999-li-active');
        //divLists.scrollTop = 0;
      }
      return;
    }

    //$.each(lis, function(index, li) {  
    for(var i=0; i<lis.length;i++){
      //if(li.hasClass('div-search-list-im999-li-active')){
      if(lis[i].classList.contains('div-search-list-im999-li-active')){
      //if(li.classList.contains('div-search-list-im999-li-active')){
        if(keyName == 'up'){
          if(i==0){
            lis[lis.length-1].classList.add('div-search-list-im999-li-active');
            //lis[lis.length-1].addClass('div-search-list-im999-li-active');
            //divLists.scrollTop = divLists.scrollHeight;
          }else{
            lis[i-1].classList.add('div-search-list-im999-li-active');
            //lis[index-1].addClass('div-search-list-im999-li-active');
            //divLists.scrollTop = divLists.scrollHeight / lis.length * (i+1) - 80;
          }
        }else if(keyName == 'down'){
          if(i==lis.length-1){
            lis[0].classList.add('div-search-list-im999-li-active');
            //lis[0].addClass('div-search-list-im999-li-active');
            //divLists.scrollTop = 0;
          }else{
            lis[i+1].classList.add('div-search-list-im999-li-active');
            //lis[index+1].addClass('div-search-list-im999-li-active');
            //divLists.scrollTop = divLists.scrollHeight / lis.length * (i+1) - 40;
          }
        }
        //currentActive.classList.remove('div-search-list-im999-li-active');
        currentActive.removeClass('div-search-list-im999-li-active');
        //div.scrollTop = currentActive.getBoundingClientRect().height * (i+1);
        //div.scrollTop = 25 * (i+1);
        return;
      }
    //});
    }
  },


  //im999 this function get all onClick button and run what call
  doJob(what=''){
    switch(what){
      case 'refresh':
        this.getFileAndFolderList(this.browsedPath);
        break;
      case 'new folder':
        this.doNewFolder();
        break;
      case 'go to':
        this.doGoto();
        break;
      case 'upload':
        this.doOpenUpload();
        break;
      case 'delete':
        this.doBatchDelete();
        break;
      case 'download':
        this.doBatchDownload();
        break;
      case 'copy':
        this.doBatchCopy();
        break;
      case 'move':
        this.doBatchMove();
        break;
      case 'cancel':
        this.doBatchCancel();
        break;
      case 'paste':
        this.doBatchPaste();
        break;
      case 'go':
        //this.doGoPath();
        this.doGoPathInput();
        break;
      case 'x':
        this.doClickX(emptyInput=true);
        break;
    }
  }//doJob
  ,


  //im999 do new folder for button click
  doNewFolder(){
    //var fileManager = this;  
    var folderName = prompt('Enter name of new folder:');
    if (folderName != null) {
      var path = this.browsedPath;

      var data = { func: 'new-folder', path: path, folder_name: folderName}; 
      //this.doAjax(pFunc='new-folder', pIsLast=null, pFile=null, pPath=null, pFolderName=folderName, pSelectedItems=null, pFrom=null, pWhich=null, pItemName=null, pItemKind=null, pNewName=null);
      this.doAjax(data);
    }
  }//doNewFolder
  ,


  //im999 do go to path for button click
  doGoto(){
    var path = prompt('Enter path:');
    if (path != null) {
      //this.getFileAndFolderList('\\'+path);
      this.getFileAndFolderList(this.browsedPath+'\\'+path);
    }
  }//doGoto
  ,


  //im999 do upload open for button click
  doOpenUpload(){
    var btnUpload = $('#fileUploader');
    
    btnUpload.click();
  }//doOpenUpload
  ,


  //im999 do unselect all items
  deselectAll(){
    //im999 unchecked item
    $('#div-file-list table input[im999-data="S"]').prop('checked', false);

    //im999 unchecked select all
    $('#div-file-list table input[im999-data="A"]').prop('checked', false);
  }//deselectAll
  ,


  //im999 do select all items
  selectAll(){
    //im999 checked item
    $('#div-file-list table input[im999-data="S"]').prop('checked', true);
    
    //im999 checked select all
    $('#div-file-list table input[im999-data="A"]').prop('checked', true);
  }//selectAll
  ,


  //im999 get all selected items for batch doing
  getSelectedItems(){
    const selectedItems = [];

    var tempSelect = $('#div-file-list table input[im999-data="S"]:checked:enabled');

    if(tempSelect.length > 0){
      for(var i=0; i<tempSelect.length ; i++){
        selectedItems.push({name: tempSelect.eq(i).attr('data-name'), kind:tempSelect.eq(i).attr('data-kind')});
      }      
    }
    return selectedItems;
  }//getSelectedItems
  ,


  //im999 do batch delete for button click
  doBatchDelete(){

    const selectedItems = this.getSelectedItems();

    if(selectedItems.length == 0){
      alert('select some directories and files at first.');
      return;
    }

    var wantDo = confirm('Are you sure you want to delete "'+selectedItems.length+' items"?');
    if (wantDo) {
      //var fileManager = this;  
      var path = this.browsedPath;
     
      var data = { func: 'batch-delete', path: path, selected_items: JSON.stringify(selectedItems)};
      //this.doAjax(pFunc='batch-delete', pIsLast=null, pFile=null, pPath=null, pFolderName=null, pSelectedItems= JSON.stringify(selectedItems), pFrom=null, pWhich=null, pItemName=null, pItemKind=null, pNewName=null);
      this.doAjax(data);
    } 
  }//doBatchDelete
  ,


  //im999 do batch download for button click
  doBatchDownload(){

    const selectedItems = this.getSelectedItems();

    if(selectedItems.length == 0){
      alert('select some directories and files at first.');
      return;
    }

    var wantDo = confirm('Are you sure you want to download "'+selectedItems.length+' items"?');
    if (wantDo) {
      var path = this.browsedPath;
      var items = JSON.stringify(selectedItems);
      var a = document.createElement('a');
      var url = im999maxgood_filemanager.api_url+'?func=batch-download&path='+path+'&selected_items='+items;

      a.href = url;
      a.download = 'IM999MaxGood_Files_Folders.zip';

      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      this.deselectAll();
    } 
  }//doBatchDelete
  ,


  //im999 check copy or move selected or no
  checkForPaste(){
    var readyForPaste = false;
    var items = sessionStorage.getItem('items_paste');
    if(items == null || items.trim() == ''){
      sessionStorage.setItem('which_paste', '');
      sessionStorage.setItem('from_path_paste', '');
  
      $('#div-file-list button[im999-data="paste"]').attr('disabled', 'disabled');
      $('#div-file-list button[im999-data="cancel"]').attr('disabled', 'disabled');
    }else{
      $('#div-file-list button[im999-data="paste"]').removeAttr("disabled");
      $('#div-file-list button[im999-data="cancel"]').removeAttr("disabled");
      readyForPaste = true;
    }
    return readyForPaste;
  }//checkForPaste
  ,


  //im999 do batch copy for button click
  doBatchCopy(){
    //im999 cancel prev copy or move
    this.doBatchCancel();

    const selectedItems = this.getSelectedItems();

    if(selectedItems.length == 0){
      alert('select some directories and files at first.');
      return;
    }

    var path = this.browsedPath;
    var items = JSON.stringify(selectedItems);
    sessionStorage.setItem('items_paste', items);
    sessionStorage.setItem('which_paste', 'copy');
    sessionStorage.setItem('from_path_paste', path);

    $('#div-file-list button[im999-data="paste"]').removeAttr("disabled");
    $('#div-file-list button[im999-data="cancel"]').removeAttr("disabled");

    this.deselectAll();
  }//doBatchCopy
  ,


  //im999 do batch move for button click
  doBatchMove(){
    //im999 cancel prev copy or move
    this.doBatchCancel();

    const selectedItems = this.getSelectedItems();

    if(selectedItems.length == 0){
      alert('select some directories and files at first.');
      return;
    }

    var path = this.browsedPath;
    var items = JSON.stringify(selectedItems);
    sessionStorage.setItem('items_paste', items);
    sessionStorage.setItem('which_paste', 'move');
    sessionStorage.setItem('from_path_paste', path);

    $('#div-file-list button[im999-data="paste"]').removeAttr("disabled");
    $('#div-file-list button[im999-data="cancel"]').removeAttr("disabled");

    this.deselectAll();
  }//doBatchMove
  ,


  //im999 do cancel copy or move if selected
  doBatchCancel(){
    sessionStorage.setItem('items_paste', '');
    this.checkForPaste();
  }//doBatchCancel
  ,


  //im999 do paste copy or move if selected
  doBatchPaste(){
    const ready = this.checkForPaste();

    const pathFrom = sessionStorage.getItem('from_path_paste');
    const which = sessionStorage.getItem('which_paste');
    if(!ready || pathFrom.trim == '' || which.trim() == ''){
      return;
    }

    const items = sessionStorage.getItem('items_paste');

    var wantDo = confirm('Are you sure you want to paste the items here"?');
    if (wantDo) {
      //var fileManager = this;  
      var path = this.browsedPath;
      
      var data= { func: 'paste', path: path, from: pathFrom, which: which, selected_items: items};  // Pass input data as JSON
      //this.doAjax(pFunc='paste', pIsLast=null, pFile=null, pPath=null, pFolderName=null, pSelectedItems=items, pFrom= pathFrom, pWhich= which, pItemName=null, pItemKind=null, pNewName=null);
      this.doAjax(data);
    } 
  }//doBatchPaste
  ,


  //im999 do download for button click
  doDownload(name, kind){
    //var fileManager = this;  
    var wantDo = confirm('Are you sure you want to download "'+name+'"?');
    if (wantDo) {
      var path = this.browsedPath;

      var a = document.createElement('a');
      var url = im999maxgood_filemanager.api_url+'?func=download&path='+path+'&item_name='+name+'&item_kind='+kind;
      a.href = url;
      // Give filename you wish to download
      if(kind=='dir'){
        a.download = name+'.zip';
      }else{
        a.download = name;
      }
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
    }
  }//doDownload
  ,


  //im999 do delete for button click 
  doDelete(name, kind){
    //var fileManager = this;  
    var wantDo = confirm('Are you sure you want to delete "'+name+'"?');
    if (wantDo) {
      var path = this.browsedPath;

      var data= { func: 'delete', path: path, item_name:name, item_kind:kind};  // Pass input data as JSON  
      //this.doAjax(pFunc='delete', pIsLast=null, pFile=null, pPath=null, pFolderName=null, pSelectedItems=null, pFrom=null, pWhich=null, pItemName=name, pItemKind=kind, pNewName=null);
      this.doAjax(data);
    }
  }//doDelete
  ,


  //im999 do rename for button click
  doRename(name, kind){
    //var fileManager = this;  
    var newName = prompt('Enter new name:', name);

    if(newName != null){

      var path = this.browsedPath;

      var data= { func: 'rename', path: path, item_name:name, new_name: newName};  // Pass input data as JSON  
      //this.doAjax(pFunc='rename', pIsLast=null, pFile=null, pPath=null, pFolderName=null, pSelectedItems=null, pFrom=null, pWhich=null, pItemName=name, pItemKind=null, pNewName=newName);
      this.doAjax(data);
    }
  }//doRename
  ,


  //im999 do directory click for change current path 
  doClickDir(jqueryThis){
    var tds = jqueryThis.parents('tr').children('td');
  
    var noRow = Number(tds.eq(0).html())-1;

    var kind = tds.eq(1).find('span').html();
    var name = tds.eq(2).find('span').html();

    if(kind == 'dir'){
      var path = im999maxgood_filemanager.browsedPath + '\\' + name;
      im999maxgood_filemanager.getFileAndFolderList(path);
    }  
  }//doClickDir
  ,


  //im999 get 10 paths by inputed path 
  doInputPath(pEvent){
    var listPath = this.getPaths(10, pEvent.currentTarget.value);
    
  }//doInputPath
  ,


  //im999 get paths
  getPaths(pCountPath, pInputValue){
    $.ajax({
      //type: 'POST',
      type: 'GET',
          
      url: this.api_url,
      
      //processData: false,
          
      data: { func: 'get-paths', path: this.browsedPath, input: pInputValue, count: pCountPath },  // Pass input data as JSON
              
      success: function(response) {
        console.log('Python response:', response);
        // Handle the Python output (response) as needed

        //im999 because of web.header('Content-Type', 'application/json')
        //res = JSON.parse(response);
        //res = response;

        if(response['run_ok']){

          im999maxgood_filemanager.showListPaths(response['files_folders']);
          im999maxgood_filemanager.readyListPaths();
        }else{
          im999maxgood_filemanager.updateStatus(response['return_message']+'. failed.', 'error');
        }
      },

      error: function(xhr, status, error) {
        console.error('Error:', error);

        //fileManager.listFilesAndFolders = [];
        fileManager.updateStatus(error, 'error');
      }
    });//$.ajax 
  }//getPaths
  ,


  //im999 make like for any piece of path
  getPathLink(pPath){
    var ret = '';
    var strTemp = '';
    var paths = pPath.split('\\');
    for(const p of paths){
      strTemp += p.trim();
      ret += '<a im999-data="'+strTemp+'">'+p.trim()+'</a><span> \\ </span>';      
      strTemp += '\\';
    }  
    return ret;
  }//getPathLink
  ,
  
  
  //im999 show list of paths for input path
  showListPaths(pList){
    var html = '';
    
    //im999 ie11 support
    for(var i=0; i<pList.length; i++){
      /*
      html += '<li>'+this.getPathLink(pList[i])+'<span class="im999-go-icon" title="Go to this path" im999-data="'+pList[i]+'">>></span></li>';
      */
      html += '<li>'+this.getPathLink(pList[i])+'<span class="im999-go-icon" title="Go to this path" im999-data="'+pList[i]+'"><i class="fa fa-arrow-right"></i></span></li>';
    }

    if(html == ''){
      html = '<span class="not-path">there isn\'t paths.</span>';
    }else{
      html = '<ul>'+html+'</ul>';
    }

    var divList = document.querySelector('#div-search-list-im999');
    divList.innerHTML = html;
  }//showListPaths
  ,
  
  
  //im999 do go to path for input path
  //doGoPath(){
  doGoPathInput(){
    var txtSearch = $('#div-search-im999 input[type="text"]')[0];
    var path = txtSearch.value;
    if (path != null && path.trim() != '') {
      this.doClickX(emptyInput=true);
      this.getFileAndFolderList(this.browsedPath+'\\'+path);
    }
  //}//doGoPath
  }//doGoPathInput
  ,


  //im999 do go to path for input path
  doGoPath(pPath){
    if (pPath != null && pPath.trim() != '') {
      this.doClickX(emptyInput=true);
      this.getFileAndFolderList(this.browsedPath+'\\'+pPath);
    }
  }//doGoPath
  ,


  //im999 do onClick X button on front of input path
  doClickX(emptyInput){
    var div = document.querySelector('#div-search-list-im999');
    div.innerHTML = '';

    if(emptyInput){
        var txtSearch = document.querySelector('#div-search-im999 input[type="text"]');
        txtSearch.value = '';
    }
  }//doClickX
  ,


  //im999 this function make ready list of paths for input path
  readyListPaths(){
    $('#div-search-list-im999 a').click(function (){
      var data = $(this).attr('im999-data').toLowerCase().trim();

      im999maxgood_filemanager.doGoPath(data);
    })

    $('#div-search-list-im999 .im999-go-icon').click(function (){
      var data = $(this).attr('im999-data').toLowerCase().trim();

      im999maxgood_filemanager.doGoPath(data);
    })
  }//readyListPaths
  ,


  //doAjax(pFunc, pIsLast, pFile, pPath, pFolderName, pSelectedItems, pFrom, pWhich, pItemName, pItemKind, pNewName){
  doAjax(data){
    var type = 'GET';
    var url = this.api_url;
    //var path = this.browsedPath;

    $.ajax({
      type: type,
          
      url: url,
      
      //processData: false,

      //processData: processData,
      //contentType: contentType,
          
      data: data,  // Pass input data as JSON
          
      success: function(response) {
        console.log('Python response:', response);
        // Handle the Python output (response) as needed

        //im999 because of web.header('Content-Type', 'application/json')
        //res = JSON.parse(response);
        //res = response;


        //if((pFunc == 'uploads' && pIsLast == 'yes') || (pFunc == 'get-list-files') || (pFunc == 'new-folder') || (pFunc == 'batch-delete') || (pFunc == 'paste') || (pFunc == 'delete') || (pFunc == 'rename')){
        if((data['func'] == 'uploads' && pIsLast == 'yes') || (data['func'] == 'get-list-files') || (data['func'] == 'new-folder') || (data['func'] == 'batch-delete') || (data['func'] == 'paste') || (data['func'] == 'delete') || (data['func'] == 'rename')){

          if(response['run_ok']){
            p = response['path'];
            ff = response['files_folders'];
            im999maxgood_filemanager.listFilesAndFolders = ff;
            im999maxgood_filemanager.browsedPath = p;
            im999maxgood_filemanager.showFileAndFolderList();
            im999maxgood_filemanager.readyTable();
            im999maxgood_filemanager.updatePathLink();
            im999maxgood_filemanager.readyPathLink();
  
            im999maxgood_filemanager.updateStatus(response['return_message']+' Well done :).', 'ok');
            alert(response['return_message'] +' Well done.');
            
          }else{
            im999maxgood_filemanager.updateStatus(response['return_message']+'. Failed :(.', 'error');
          }

          if(data['func'] == 'paste'){
            im999maxgood_filemanager.doBatchCancel();
          }
        }
      },

      error: function(xhr, status, errors) {
        console.error('Error:', errors);

        //fileManager.listFilesAndFolders = [];
        //fileManager.updateStatus(error, 'error');

        if(data['func'] == 'uploads' && data['isLast'] == 'yes'){
          im999maxgood_filemanager.updateStatus('Upload files failed :(.', 'error');
        }else if(data['func'] == 'get-list-files'){
          im999maxgood_filemanager.updateStatus('Fetched files and folders failed :(.', 'error');
        }else if(data['func'] == 'new-folder'){
          im999maxgood_filemanager.updateStatus('Make folder failed :(.', 'error');
        }else if(data['func'] == 'batch-delete'){
          im999maxgood_filemanager.updateStatus('Batch delete files and folders failed :(.', 'error');
        }else if(data['func'] == 'paste'){
          im999maxgood_filemanager.doBatchCancel();
          im999maxgood_filemanager.updateStatus('Paste files and folders failed :(.', 'error');
        }else if(data['func'] == 'delete'){
          im999maxgood_filemanager.updateStatus('Delete file or folder failed :(.', 'error');
        }else if(data['func'] == 'rename'){
          im999maxgood_filemanager.updateStatus('Rename file or folder failed :(.', 'error');
        }
      }
    });//$.ajax  
  }//doAjax

};//const im999maxgood_filemanager
