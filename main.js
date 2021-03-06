(function(){  //Created IIFE to prevent name space pollution. If your project has multiple files its good practise to use IIFE-->Immediately Invoked File Execution. Suppose we have 2 JS file main1.js, main2.js and we are connecting both to the HTML page and we are defining let a=5, let a=6 in the JS files respectively, then in same page we will have 2 'a' from the 2 JS and this might cause problem
    let btnAddFolder=document.querySelector("#btnAddFolder");
    let divContainer=document.querySelector("#divContainer");
    let divBreadCrumb=document.querySelector("#divBreadCrumb");
    let aRootPath=document.querySelector(".path");
    let pageTemplates=document.querySelector("#pageTemplates");
    let folders=[];
    let fid=-1; // initialise with -1, will keep updating it
    let cfid=-1; // -1 set for the root folder, id of folder where we are
    btnAddFolder.addEventListener("click", addFolder);
    aRootPath.addEventListener("click", navigateBreadCrumb);
    function addFolder(){

        let fname=prompt("Enter folder name");
        if(!!fname){

            let fidx=folders.findIndex(f => f.name==fname);
            if(fidx==-1){
                ++fid;
                // Now folder we will add in 1)Folders 2) HTML 3) In storage of browser
                //1)In folders
                let folder={
                     id: fid,
                     name: fname,
                     pid: cfid  // cfid is cuurent folder id. Now when you add new folder, its parentId will be currrent folder id
                }
                folders.push(folder);

                //2) In HTML through addFolderHtml function
                addFolderHtml(fname, fid, cfid);

                //3) Save to storage of browser
                saveToStorage();
            }
            else{
                alert("Folder name already exists");
            }
        }else{
            alert("Enter folder name");
        }

    }

    function editFolder(){
        let divFolder=this.parentNode;// Here this is spanDelete whose parent is the divFolder
        let divName=divFolder.querySelector("[purpose='name']");
        let fidx=folders.findIndex(f => f.name == divName.innerHTML);
        let oldFolderName=divName.innerHTML;
        let newFolderName=prompt("Enter folder name");
        if(!!newFolderName){
            if(newFolderName!=divName.innerHTML){
                let exists=folders.filter(f=>f.pid==cfid).some(f => f.name==newFolderName); // see if new FolderName matches with already present foldernames
                if(!exists){
                    // Adding to RAM
                    folders.splice(fidx, 1, {id:fid, name: newFolderName}); // folders.find(f=>f.name==oldFolderName).name==newFolderName 
                    divName.innerHTML=newFolderName; // HTML
                    saveToStorage(); // storage
                }else{
                    alert("Folder name already exists");
                }

            }else{
                alert("Please enter new folder name");
            }

        }else{
            alert("Enter a folder name");
        }
        

    }

    function deleteFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fidtbd = parseInt(divFolder.getAttribute("fid"));// folder id to be deleted

        let flag = confirm("Are you sure you want to delete " + divName.innerHTML + "?");
        if (flag == true) {
            let exists = folders.some(f => f.pid == fidtbd); // check if the folder you want to delete is some folder's parent or not, then you cant delete
            if(exists == false){
                // ram
                let fidx = folders.findIndex(f => f.id == fidtbd);
                folders.splice(fidx, 1);

                // html
                divContainer.removeChild(divFolder);

                // storage
                saveToStorage();
            } else {
                alert("Can't delete. Has children.");
            }
        }
    }

    function navigateBreadCrumb(){
        let fname = this.innerHTML;
        cfid = parseInt(this.getAttribute("fid"));
 
        divContainer.innerHTML = "";
        folders.filter(f => f.pid == cfid).forEach(f => {
            addFolderHtml(f.name, f.id, f.pid);
        });

        while(this.nextSibling){
            this.parentNode.removeChild(this.nextSibling);
        }
    }

    function viewFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        cfid = parseInt(divFolder.getAttribute("fid"));

        let aPathTemplate = pageTemplates.content.querySelector(".path");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML = divName.innerHTML;
        aPath.setAttribute("fid", cfid);
        aPath.addEventListener("click", navigateBreadCrumb);
        divBreadCrumb.appendChild(aPath);

        divContainer.innerHTML = "";
        folders.filter(f => f.pid == cfid).forEach(f => {
            addFolderHtml(f.name, f.id, f.pid);
        });
    }

    function addFolderHtml(fname, fid, pid){ // Adds HTML for each folder 1 at a time


        let divFolderTemplate=pageTemplates.content.querySelector(".folder"); // fetching the template for folder
        let divFolder=document.importNode(divFolderTemplate, true); // cloning the folder template so that we can create folder
        let spanEdit=divFolder.querySelector("span[action='edit']");
        let spanDelete=divFolder.querySelector("span[action='delete']");
        let spanView=divFolder.querySelector("span[action='view']");
        let divName=divFolder.querySelector("[purpose='name']");
        divFolder.setAttribute("fid", fid); // adding attribute fid to the divFolder
        divFolder.setAttribute("pid", pid); 
        divName.innerHTML=fname; // setting the name with the one we are getting as parameter
        spanEdit.addEventListener("click",editFolder);
        spanDelete.addEventListener("click",deleteFolder);
        spanView.addEventListener("click",viewFolder);
        divContainer.appendChild(divFolder); // adding the divFolder to the divContainer
    }

    function saveToStorage(){  // saves whenevr there is change. Its local storage in browser

        let fjson=JSON.stringify(folders);
        localStorage.setItem("data",fjson);
    }

    function loadFromStorage(){ // when page starts at the very beginning it checks if there is a already existing folder and if exists, it creates html page from it

        let fjson=localStorage.getItem("data"); // fetches JSON of already existing folder (in form of string)
        if(!!fjson) { // fjson!=null && fjson!=undefined && fjson.length!=0

            folders=JSON.parse(fjson);
            folders.forEach(f=>{
                if(f.pid==cfid)   // if parentId equals current folder id then show the children of pfid
                addFolderHtml(f.name, f.id, f.pid);
                if(f.id>fid)
                fid=f.id;
                
            })
        }
    }
    loadFromStorage();

   
})();