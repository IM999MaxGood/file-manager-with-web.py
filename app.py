import web

import model

import json

#im999 for farsi name on download
from urllib.parse import quote

urls = ('/', 'Index', 
        '/api/filemanager', 'FileManager',
        '/api/filemanager/uploads', 'FileManagerUpload')

app = web.application(urls, globals())

render = web.template.render('templates', base='base')

class Index:
    def GET(self):
        
        web.header('Access-Control-Allow-Origin', 'http://localhost:8080')
        return render.index()


class FileManagerUpload:
    root = '\\www'

    #def GET(self):
    def POST(self):

        web.header('Content-Type', 'application/json; charset=utf-8')
        web.header('Access-Control-Allow-Origin', 'http://localhost:8080')

        param = web.input(file={})

        ret = None
        file = param['file']
        path = param['path']
        func = param['func']
        isLast = param['isLast']
        if not file.filename == '' :
            ret = model.doSaveUploadedFile(self.root+path, file)
            if isLast == 'yes' and not ret == False :
                retPath = path
                retFilesFolders = model.getFilesAndFolders(self.root+path)
                #ret = True

                ret = {
                    'files_folders' : retFilesFolders,
                    'path' : retPath 
                }   

        return json.dumps(ret, ensure_ascii=False)


class FileManager:
    root = '\\www'

#    def POST(self):
    def GET(self):
        #web.header('Content-Type', 'application/json')
        web.header('Content-Type', 'application/json; charset=utf-8')
        web.header('Access-Control-Allow-Origin', 'http://localhost:8080')

        retOk = False
        retMsg = ''
        retPath = ''
        retFilesFolders = {}
        params = web.input()
        path = params.get('path', '')
        func = params.get('func', '')

        try:
            if func == 'get-list-files':
                retFilesFolders = model.getFilesAndFolders(self.root+path)
                retOk = True
                retMsg = 'Fetched files and folders.'

            elif func == 'new-folder':
                folderName = params.get('folder_name', '')
                retOk = model.doNewFolder(self.root+path, folderName)
                retMsg = 'Maked new folder.'

            elif func == 'rename':
                newName = params.get('new_name', '')
                itemName = params.get('item_name', '')
                retOk = model.doRename(self.root+path, itemName, newName)
                retMsg = 'Renamed new folder.'

            elif func == 'delete':
                itemName = params.get('item_name', '')
                itemKind = params.get('item_kind', '')
                retOk = model.doDelete(self.root+path, itemName, itemKind)
                retMsg = 'Deleted item.'

            elif func == 'batch-delete':
                items = json.loads(params.get('selected_items', ''))
                retOk = model.doBatchDelete(self.root+path, items)
                retMsg = 'Batch delete items.'

            elif func == 'paste':
                items = json.loads(params.get('selected_items', ''))
                whichPaste = params.get('which', '')
                fromPaste = params.get('from', '')
                retOk = model.doPast(self.root+path, self.root+fromPaste, whichPaste, items)
                retMsg = 'Pasted item(s).'

            elif func == 'get-paths':
                count = params.get('count', '')
                inputValue = params.get('input', '')
                retFilesFolders = model.doGetPaths(self.root+path, count, inputValue)
                retOk = True
                retMsg = 'Fetched files and folders.'

            elif func == 'download':
                itemName = params.get('item_name', '')
                itemKind = params.get('item_kind', '')
                ret = model.doDownload(self.root+path, itemName, itemKind)
                if not ret == False :

                    p = self.root+path+itemName

                    if itemKind == 'dir' :
                        #web.header('Content-Disposition', 'attachment; filename='+itemName+'.zip')
                        web.header('Content-Disposition', f"attachment; filename*=utf-8''{quote(itemName)}"+'.zip')
                    else:    
                        #web.header('Content-Disposition', 'attachment; filename='+itemName)
                        web.header('Content-Disposition', f"attachment; filename*=utf-8''{quote(itemName)}")

                    return ret
                    #return ret.encode('utf-8')
                    
            elif func == 'batch-download':
                items = json.loads(params.get('selected_items', ''))
                ret = model.doBatchDownload(self.root+path, items)
                if not ret == False :
                    #web.header('Content-Disposition', 'attachment; filename=IM999MaxGood_Files_Folders.zip')
                    return ret
                
            else:
                raise Exception('func param is not valid.')
           
            if retOk == True and not func == 'get-list-files' and not func == 'get-paths' :
                retFilesFolders = model.getFilesAndFolders(self.root+path)

            retPath = model.getBrifPathAbs(self.root+path)
            #retPath = path

        except Exception as e:
            retOk = False
            #retMsg = e #e.strerror
            #retMsg = getattr(e, 'message', str(e))
            retMsg = getattr(e, 'message', repr(e))


        ret = {
            'run_ok' : retOk,
            'path' : retPath,
            'return_message' : retMsg, 
            'files_folders' : retFilesFolders
        }   

        return json.dumps(ret, ensure_ascii=False)

if __name__ == '__main__' :
    app.run()
