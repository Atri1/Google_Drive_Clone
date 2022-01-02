(function(){  //Created IIFE to prevent name space pollution. If your project has multiple files its good practise to use IIFE-->Immediately Invoked File Execution. Suppose we have 2 JS file main1.js, main2.js and we are connecting both to the HTML page and we are defining let a=5, let a=6 in the JS files respectively, then in same page we will have 2 'a' from the 2 JS and this might cause problem
    let btnAddFolder=document.querySelector("#btnAddFolder");
    let divContainer=document.querySelector("#divContainer");
    let pageTemplates=document.querySelector("#pageTemplates");
    let folders=[];
    let fid=-1; // initialise with -1, will keep updating it
    btnAddFolder.addEventListener("click", addFolder);
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
                     name: fname
                }
                folders.push(folder);

                //2) In HTML through addFolderHtml function
                addFolderHtml(fname, fid);

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
                let exists=folders.some(f => f.name==newFolderName); // see if new FolderName matches with already present foldernames
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

    function deleteFolder(){

        let divFolder=this.parentNode;// Here this is spanDelete whose parent is the divFolder
        let divName=divFolder.querySelector("[purpose='name']");
        let flag=confirm("Do you want to delete?"+ divName.innerHTML);
        if(flag==true)
        {
            let fidx=folders.findIndex(f => f.name == divName.innerHTML);
            folders.splice(fidx, 1); // removing the folder from array.
            divContainer.removeChild(divFolder);
            saveToStorage();
        }

    }

    function addFolderHtml(fname, fid){ // Adds HTML for each folder 1 at a time


        let divFolderTemplate=pageTemplates.content.querySelector(".folder"); // fetching the template for folder
        let divFolder=document.importNode(divFolderTemplate, true); // cloning the folder template so that we can create folder
        let spanEdit=divFolder.querySelector("span[action='edit']");
        let spanDelete=divFolder.querySelector("span[action='delete']");
        let divName=divFolder.querySelector("[purpose='name']");
        divFolder.setAttribute("fid", fid); // adding attribute fid to the divFolder
        divName.innerHTML=fname; // setting the name with the one we are getting as parameter
        spanEdit.addEventListener("click",editFolder);
        spanDelete.addEventListener("click",deleteFolder);
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
                addFolderHtml(f.name, f.id);
                if(f.id>fid)
                fid=f.id;
            })
        }
    }
    loadFromStorage();

   
})();