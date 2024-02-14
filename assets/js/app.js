const cl= console.log;


const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const contentControl= document.getElementById('content');
const userIdControl= document.getElementById('userId');
const cardContainer = document.getElementById('cardContainer');
const submitBtn = document.getElementById("submitBtn")
const updateBtn = document.getElementById("updateBtn")
const loader= document.getElementById('loader');

const baseUrl=`https://jsonplaceholder.typicode.com`;
const postUrl= `${baseUrl}/posts/`;

const onDelete = (ele) => {               
    Swal.fire({
        title: "Do you want to remove this post?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText:` Don't remove`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            cl(ele);
                let deleteId = ele.closest(".card").id;
                cl(deleteId);
                let deleteUrl = `${baseUrl}/posts/${deleteId}`;

                makeApiCAll("DELETE",deleteUrl)
                .then (res => {
                    cl(res)
                    document.getElementById(deleteId).remove()
                    Swal.fire({
                        title: `Post is deleteded successfully !!!`,
                        icon: `success`,
                        timer: 2000
                     })
                })
                .catch(err => {
                    cl(err)
                })
                .finally(() => {
                    loader.classList.add("d-none");
                })
    } 
       
 });
    
 };

const onEdit = (ele) => {                // step four post edit
    let editId = ele.closest(".card").id;
    cl(editId);
    let editUrl = `${baseUrl}/posts/${editId}`;
    makeApiCAll("GET",editUrl)
    .then(res => {
        cl(res)
        titleControl.value = res.title;
        contentControl.value = res.body;
        userIdControl.value = res.userId;

        updateBtn.classList.remove("d-none");
        submitBtn.classList.add("d-none");
    })
    .catch(err => {
        cl(err)
    })
    .finally(() => {
        loader.classList.add("d-none");
    })
}

const creatCards = (arr) => {                             
    cardContainer.innerHTML = arr.map(obj => {
        return `
            <div class="card mb-4" id="${obj.id}">
                <div class="card-header">
                    <h4 class="m-0">${obj.title}</h4>
                </div>
                <div class="card-body">
                    <p class="m-0">${obj.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                </div>    
            </div>
                `
    }).join("")
}

const ceratpost = (post) => {                  // create card on ui
    let card = document.createElement("div");
    card.className ="card mb-4"
    card.id = post.id;
    card.innerHTML = `
                        <div class="card-header">
                            <h4 class="m-0">${post.title}</h4>
                        </div>
                        <div class="card-body">
                            <p class="m-0">${post.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                        </div>     
                        `
                        cardContainer.append(card);
}

const makeApiCAll = (mathodName,apiurl,magBody = null) => {         // first step api call instance creat
   return new Promise ((resolve,reject) =>{
        loader.classList.remove("d-none");
        let xhr = new XMLHttpRequest();
        xhr.open(mathodName,apiurl);
        xhr.send(JSON.stringify(magBody));
        xhr.onload = function(){
            if(xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4){
                resolve(JSON.parse(xhr.response));
            }
            else{
                reject(xhr.statusText)
            }
        }
    })
}

makeApiCAll("GET",postUrl)
    .then(res => {
        cl(res)
        // callback functionality
        creatCards(res)
       
    })
    .catch(err => {
        cl(err)
    })
    .finally(() => {
        loader.classList.add("d-none");
    })

 const onPostSubmit = (eve) => {       // third step post submit
    eve.preventDefault();
    let post = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userIdControl.value
    }
    cl(post)
    makeApiCAll("POST",postUrl,post)
    .then(res => {
        cl(res)
        post.id = res.id;
        ceratpost(post)
        Swal.fire({
            title :` Post is Submited Successfully !!!`,
            icon : `success`,
            timer : 2000
        })

    })
    .catch (err => {
        cl(err)
    })

    .finally(() => {
        postForm.reset();
        loader.classList.add("d-none");
    })
 }   


 const onUpdatePost = () => {                 // step fifth post update
    let updatedObj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userIdControl.value
    }
    cl(updatedObj);
    let updateId = localStorage.getItem("editId");
    let updateUrl = `${baseUrl}/posts/${updateId}`;

    makeApiCAll("PATCH",updateUrl,updatedObj)
    .then (res => {
        cl(res)
        updatedObj.id = updateId
        let card = [...document.getElementById(updatedObj.id).children];
        cl(card)
        card[0].innerHTML =  `<h4 class="m-0">${updatedObj.title}</h4>`;
        card[1].innerHTML = ` <p class="m-0">${updatedObj.body}</p>`;
        Swal.fire({
            title : `Post is Updated Successfully !!!`,
            icon : "success",
            timer : 2000
        })

    })
    .catch(res => {
        cl(err)
    })
    .finally(() => {
        loader.classList.add("d-none");
        postForm.reset();

        updateBtn.classList.add("d-none");
        submitBtn.classList.remove("d-none");
    })
 }


postForm.addEventListener("submit", onPostSubmit)
updateBtn.addEventListener("click", onUpdatePost)