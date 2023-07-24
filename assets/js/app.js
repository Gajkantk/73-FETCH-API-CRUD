// alert("hii....................");
let cl =console.log;


const postForm =document.getElementById("postForm");
const titleControl =document.getElementById("title");
const contentControl=document.getElementById("content");
const postContainer=document.getElementById("postContainer");
const submitBtn=document.getElementById("submitBtn");
const updateBtn=document.getElementById("updateBtn");









const baseUrl = `https://fir-crud-2-using-promise-default-rtdb.asia-southeast1.firebasedatabase.app`;
const postUrl =`${baseUrl}/post.json`





const templating=(arr)=>{
     let result="";
     arr.forEach(eve=>{
        result+=`
                    <div class="card mb-4"id=${eve.id}> 
                    <div class="card-header">
                        <h3>${eve.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${eve.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onClick="editBtn(this)">Edit </button>
                        <button class="btn btn-danger" onClick="deleteBtn(this)">Delete</button>
                    </div>
                </div>
        
               `
     })
     postContainer.innerHTML=result;

}

const objToArray = (obj)=>{
    let postArray=[];
    for(const key in obj){
        postArray.push({...obj[key],id:key})
    }
    return postArray
}

const makeApiCall =(methodName, apiUrl, msgBody)=>{
    return fetch(apiUrl,{
        method:methodName,
        body:msgBody,
        header:{
            "content-type":"Application/json",
            "Auth":"bearer JWT token"
        }
    })
    .then((res)=>{
        cl(res)
        return res.json();
    })
    
}

makeApiCall("GET",postUrl)
    .then((res)=>{
        cl(res)
        let post = objToArray(res)
        templating(post)
    })

    .catch((err)=>{
        cl(err)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        
          })
    })

    const onCreatePost =(eve)=>{
        eve.preventDefault();
        cl("submitted")

        let obj ={
            title:titleControl.value.trim(),
            content:contentControl.value.trim(),
        }
        makeApiCall("POST",postUrl,JSON.stringify(obj))
            
        .then((res)=>{
            cl(res)
        
Swal.fire({
  position: 'top-end',
  icon: 'success',
  title: 'post created successfully',
  showConfirmButton: true,
  timer: 1500
})
            let card = document.createElement("div")
            card.className="card mb-4 "
            card.id=res.name
            card.innerHTML+=`
                             <div class="card-header">
                                <h3>${obj.title}</h3>
                            </div>
                            <div class="card-body">
                                <p>${obj.content}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-primary" onClick="editBtn(this)">Edit </button>
                                <button class="btn btn-danger" onClick="deleteBtn(this)">Delete</button>
                            </div>
                             `
                             postContainer.prepend(card)
                             

        })
        .catch((err)=>{
            cl(err)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            
              })
        })

        .finally(()=>{
            postForm.reset();
        })
    }


const  editBtn =(eve)=>{
    let editId = eve.closest(".card").id
    localStorage.setItem("editId",editId)
    let editUrl =`${baseUrl}/post/${editId}.json`

    makeApiCall("GET",editUrl)

    .then((res)=>{
        cl(res)
        titleControl.value=res.title,
        contentControl.value=res.content
    })

    .catch((err)=>{
        cl(err)
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        
          })
    })
    .finally(()=>{
        submitBtn.classList.add("d-none")
        updateBtn.classList.remove("d-none")

    })
}

updateBtn.addEventListener("click",(e)=>{
    let updateId = localStorage.getItem("editId")
    let updateUrl =`${baseUrl}/post/${updateId}.json`
    
    let obj ={
        title:titleControl.value.trim(),
        content:contentControl.value.trim(),
    }

    makeApiCall("PATCH",updateUrl,JSON.stringify(obj))

        .then((res)=>{
            cl(res)
        
Swal.fire({
  position: 'center',
  icon: 'success',
  title: 'updated successfully',
  showConfirmButton: true,
  timer: 1500
})

            let card = [...document.getElementById(updateId).children]
            card[0].innerHTML= ` <h3>${res.title}</h3>`
            card[1].innerHTML=` <p>${res.content}</p>`

        })

        .catch((err)=>{
            cl(err)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            
              })
        })

        .finally(()=>{
            submitBtn.classList.remove("d-none")
            updateBtn.classList.add("d-none")
            postForm.reset();
        })

})

const deleteBtn = (eve)=>{
    let deleteId = eve.closest(".card").id
    let deleteUrl = `${baseUrl}/post/${deleteId}.json`
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
         
        confirmButtonText: 'Yes, delete it!'
      })
      .then (result=>{
        if(result.isconfirmed){

        makeApiCall("DELETE",deleteUrl)


        .then((res)=>{
            cl(res)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'deleted  successfully',
                showConfirmButton: true,
                timer: 1500
              })
            let card = document.getElementById(deleteId).remove()

        })}
      })
         
        .catch((err)=>{
            cl(err)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            
            })
        })
}

postForm.addEventListener("submit",onCreatePost)
    
    
   
