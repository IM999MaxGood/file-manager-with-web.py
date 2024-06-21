import os

#im999 for delete not empty folder
import shutil

import zipfile

#im999 only for secure key for zip name file
import random
import time

rootDir = '\\www'

tempDir = 'temp'


def canBrowsePath(pPath):
    path = pPath.strip().lower()
    if not path.startswith(rootDir):
        #raise ValueError('Represents a hidden bug, do not catch this')
        raise Exception('Path is not valid.')
    
    while '\\\\' in path:
        path = path.replace('\\\\', '\\')


    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + path
    
    p = os.path.abspath(fullPath).lower()
    if not rootDir+'\\' in p:
        if not p.endswith(rootDir):
            raise Exception("You don't have permission to access this path.")
    
    if not os.path.exists(p):
        raise Exception('This path not exists.') 
        
    return path


def getFilesAndFolders(pPath):

    listFilesAndFolders = []

    path = canBrowsePath(pPath) 

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + path

    for item in os.scandir(fullPath):
        if item.is_dir():
            listFilesAndFolders.append({ 'name': item.name, 'kind': 'dir'})
        elif item.is_file():
            listFilesAndFolders.append({ 'name': item.name, 'kind': 'file'})

    listFilesAndFolders.sort(key=lambda x: x['kind'])#, reverse=True)

    fullPathRoot = (projectRoot + rootDir).lower()
    absPath = os.path.abspath(fullPath).lower()

    if not absPath == fullPathRoot:
        listFilesAndFolders.insert(0, { 'name': '..', 'kind': 'dir'})

    return listFilesAndFolders


#im999 for get .. and brif path
def getBrifPathAbs(pPath):
    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + pPath

    absPath = os.path.abspath(fullPath)
    retPath = absPath[absPath.lower().find(rootDir)+len(rootDir):]

    if retPath == '':
        retPath = '\\'

    return retPath


def folderNameIsValid(pName):
    ret = True
    name = pName.strip()
    if name == '':
        ret = False
    elif '/' in name:
        ret = False
    elif '\\' in name:
        ret = False
    elif ':' in name:
        ret = False
    elif '*' in name:
        ret = False
    elif '?' in name:
        ret = False
    elif '"' in name:
        ret = False
    elif '<' in name:
        ret = False
    elif '>' in name:
        ret = False
    elif '|' in name:
        ret = False
    
    if ret == False:
        raise Exception('Invalid name for new folder.')
    return True
  

def doNewFolder(pPath, folderName):
    path = canBrowsePath(pPath) 

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + path

    ret = False
    try:
        if not folderNameIsValid(folderName) :
            return False

        new_abs_path = os.path.join(fullPath, folderName)
    
        if not os.path.exists(new_abs_path):
            os.mkdir(new_abs_path)
            ret = True
        else:
            raise Exception('Error in make dir: Folder exist.')
    except Exception as e:
        raise Exception(f"Error in make dir: {e}")
     
    return ret

def doRename(pPath, itemName, newName):    
    path = canBrowsePath(pPath) 

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + path

    item_abs_path = os.path.join(fullPath, itemName)
    new_abs_path = os.path.join(fullPath, newName)
    
    ret = False
    try:
        if os.path.exists(item_abs_path):
            os.rename(item_abs_path, new_abs_path)
            ret = True
        else:
            raise Exception('Error in rename: Item not exist.')
    except Exception as e:
        raise Exception(f"Error in rename: {e}")
     
    return ret

def doDelete(pPath, itemName, itemKind):    
    path = canBrowsePath(pPath) 

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + path

    item_abs_path = os.path.join(fullPath, itemName)
    
    ret = False
    try:
        if os.path.exists(item_abs_path):

            if itemKind == 'dir':

                if len(os.listdir(item_abs_path)) == 0:
                    #print("Directory is empty")
                    os.rmdir(item_abs_path)
                    ret = True
                else:    
                    #print("Directory is not empty")
                    shutil.rmtree(item_abs_path)
                    ret = True
            else:    
                os.remove(item_abs_path)
                ret = True

        else:
            raise Exception('Error in delete: Item not exist.')
    except Exception as e:
        raise Exception(f"Error in delete: {e}")

    return ret


def doSaveUploadedFile(pPath, pFile):
    path = canBrowsePath(pPath) 

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + path

    item_abs_path = os.path.join(fullPath, pFile.filename)
    
    ret = False
    try:
        file = open(item_abs_path, 'wb')  # Creates the file where the uploaded file should be stored
        file.write(pFile.raw)
        file.close()  # Closes the file, upload complete
        ret = True
    except Exception as e:
        raise Exception(f"Error in save uploaded file: {e}")
        #raise Exception(f"Error in save uploaded file: {e.strerror}")

    return ret


def doDownload(pPath, itemName, itemKind):    
    path = canBrowsePath(pPath) 

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + path

    item_abs_path = os.path.join(fullPath, itemName)
    
    ret = False
    try:
        if os.path.exists(item_abs_path):

            if itemKind == 'dir':
                l = [{'name': itemName, 'kind': 'dir'}]
                item_abs_path = createZip(l, fullPath, path)

                ret = open(item_abs_path, 'rb').read()
                os.remove(item_abs_path)
                return ret            
            else:
                ret = open(item_abs_path, 'rb').read()
                return ret            
        else:
            raise Exception('Error in download: Item not exist.')
    except Exception as e:
        #raise Exception(f"Error in create zip: {e.strerror}")
        raise Exception(f"Error in create zip: {e}")
     
    return ret


def createZip(pFileList, pFullPath, pPath):
    zipName = ''

    #im999 secureKeyName for secure of multi execution and session of this app on server
    secureKeyName = str(random.randint(100, 999)) + str(int(time.time())) 

    if len(pFileList) == 0:
        return None
    elif len(pFileList) == 1:
        zipName = pFileList[0]['name'] +'_'+secureKeyName + '.zip'
    else:
        zipName = 'IM999MaxGood_Files_Folders_'+secureKeyName+'.zip'

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    try:
        zipPath =  os.path.join(projectRoot, tempDir, '')

        os.chdir(pFullPath)

        file_paths = []
        for item in pFileList:
            if item['kind'] == 'dir':
                tempFilesFolders = getAllFilesAndDirs(item['name'], True)

                file_paths.extend(tempFilesFolders)
            else:
                file_paths.append(item['name'])

        with zipfile.ZipFile(zipName,'w') as zip: 
            # writing each file one by one 
            for file in file_paths: 
                zip.write(file) 
        os.chdir(projectRoot)

        zipFullPath = os.path.join(zipPath, zipName)
        #tempZip = os.path.join(projectRoot, rootDir, pPath, zipName)
        tempZip = os.path.join(pFullPath, zipName)
        shutil.move( tempZip, zipFullPath)
        return zipFullPath
    except Exception as e :
        #raise Exception(f"Error in create zip: {e.strerror}")
        raise Exception(f"Error in create zip: {e}")

def getAllFilesAndDirs(pDirectory, pHasEmptyDirs): 
  
    # initializing empty file paths list 
    filesAndDirs = [] 

    #dir = os.path.join(rootDir, pDirectory) 
    dir = pDirectory
  
    # crawling through directory and subdirectories 
    for root, directories, files in os.walk(dir):
        if pHasEmptyDirs:
            if len(directories) == 0:
                filesAndDirs.append(root) 
        for filename in files: 
            # join the two strings in order to form the full filepath. 
            filepath = os.path.join(root, filename) 
            filesAndDirs.append(filepath) 
  
    # returning all file paths 
    return filesAndDirs


def doBatchDelete(pPath, pItems):
    path = canBrowsePath(pPath) 

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + path

    ret = False
    for item in pItems:
        item_abs_path = os.path.join(fullPath, item['name'])
        try:
            if os.path.exists(item_abs_path):

                if item['kind'] == 'dir':

                    if len(os.listdir(item_abs_path)) == 0:
                        #print("Directory is empty")
                        os.rmdir(item_abs_path)
                        ret = True
                    else:    
                        #print("Directory is not empty")
                        shutil.rmtree(item_abs_path)
                        ret = True
                else:    
                    os.remove(item_abs_path)
                    ret = True

            else:
                raise Exception('Error in batch delete: Item not exist.')
        except Exception as e:
            raise Exception(f"Error in batch delete: {e}")
            #raise Exception(f"Error in delete: {e.strerror}")
     
    return ret


def doBatchDownload(pPath, pItems):
    path = canBrowsePath(pPath) 

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + path

    ret = False
    #im999 check files and dirs exist 
    for item in pItems:

        if item['kind'] == 'dir':
            item_abs_path = os.path.join(fullPath, item['name'])
      
            try:
                if not os.path.exists(item_abs_path):
                    raise Exception('Error in download: Item not exist.')
            except Exception as e:
                #raise Exception(f"Error in create zip: {e.strerror}")
                raise Exception(f"Error in create zip: {e}")


    #im999 create zip file 
    try:
        item_abs_path = createZip(pItems, fullPath, path)

        ret = open(item_abs_path, 'rb').read()
        os.remove(item_abs_path)
    except Exception as e:
        #raise Exception(f"Error in create zip: {e.strerror}")
        raise Exception(f"Error in create zip: {e}")

    return ret
   

def doPast(pPath, pFromPaste, pWhichPaste, pItems):
    path = canBrowsePath(pPath) 

    fromPath = canBrowsePath(pFromPaste) 

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPathTo = projectRoot + path

    ret = False
    for item in pItems:
        item_abs_path_from = os.path.join(projectRoot+fromPath, item['name'])
        item_abs_path_to = os.path.join(fullPathTo, item['name'])
        try:
            if os.path.exists(item_abs_path_from) and os.path.exists(fullPathTo) :
                
                if pWhichPaste == 'copy' :
                    if item['kind'] == 'dir':
                        shutil.copytree(item_abs_path_from, item_abs_path_to, dirs_exist_ok=True)
                    else:
                        shutil.copyfile(item_abs_path_from, item_abs_path_to)
                else: 
                    shutil.move(item_abs_path_from, item_abs_path_to)

                ret = True

            else:
                raise Exception('Error in paste: path not exist.')
        except Exception as e:
            raise Exception(f"Error in paste: {e}")
            #raise Exception(f"Error in delete: {e.strerror}")
     
    return ret


def doGetPaths(pCurrentPath, pCount, pInputValue):
    maxRetPath = 10

    path = canBrowsePath(pCurrentPath) 

    projectRoot = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root

    fullPath = projectRoot + path

    compareInput = pInputValue
    if '\\' in pInputValue:        
        compareInput = pInputValue[pInputValue.rfind('\\')+1:]
        p = pInputValue[:pInputValue.rfind('\\')]
        fullPath = fullPath + '\\' + p

    listFolders = []

    if not os.path.isdir(fullPath):
        return listFolders

    for item in os.scandir(fullPath):
        if item.is_dir():
            if compareInput.lower() in item.name.lower():

                allPath = fullPath + '\\' + item.name 
                brifPath = allPath[(allPath).lower().index(pCurrentPath.lower()) + len(pCurrentPath)+1:]
                if brifPath[0] == '\\':
                    brifPath = brifPath[1:]
                listFolders.append(brifPath)

    i = 0
    while len(listFolders) < int(pCount) and len(listFolders) < maxRetPath and i < len(listFolders):
        
        pathFolder = projectRoot + path + '\\' + listFolders[i] 
        
        for p in os.scandir(pathFolder):
            if p.is_dir():
                allPath = pathFolder + '\\' + p.name
                brifPath = allPath[(allPath).lower().index(pCurrentPath.lower()) + len(pCurrentPath)+1:]

                if brifPath[0] == '\\':
                    brifPath = brifPath[1:]
                listFolders.append(brifPath)
        i = i+1


    listFolders = listFolders[:maxRetPath]

    listFolders = sorted(listFolders, key=lambda x: x.lower())

    return listFolders

