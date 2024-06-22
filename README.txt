run vpn
run pip install web.py



curl -i -H "Content-Type: application/json; charset=utf-8" -X GET --data "{\"func\":\"get-list-files\",\"path\":\"\"}" http://localhost:8080/api/filemanager

curl -i -H "Content-Type:application/json;charset=utf-8" -X GET -d "{\"func\":\"get-list-files\",\"path\":\"\"}" http://localhost:8080/api/filemanager


http://localhost:8080/api/filemanager?func=get-list-files&path=\


attention: don't delete temp dir. this folder use for make .zip file download
  don't delete www dir

path=\bb\\\\\..
path=\bb\\\\\
path=\bb\
path=\
path=
path=\bb\\\\\..\..
path=\bb\bb_1
path=\bb\bb_1\
path=\bb\bb_3
path=\bb\bb_1\\\\..
path=\bb\bb_1\\\\..\\\\\\
path=\bb\bb_1\\\\..\\\\\\..
path=\bb\bb_1\\\\...\\\\\\.. => I riase error. I can use os.listdir(path) insted of os.scandir(path) because folder exist
path=\bb\bb_1\\\\. => I riase error . I can use os.listdir(path) insted of os.scandir(path) because folder exist
path=\bb\bb_1\\\\\/\\ => I riase error . I can use os.listdir(path) insted of os.scandir(path) because folder exist

