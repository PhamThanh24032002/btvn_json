const btnAdd = document.querySelector('.btnAdd')
const formAddEdit = document.querySelector(".form-add-edit");
const overlay = document.querySelector(".overlay");
const cancel = document.querySelector('#cancel');
const complete = document.querySelector('#complete');
const tbody = document.querySelector('tbody');
const form = document.querySelector(".form");
const des = document.querySelector("#des");
const mail = document.querySelector("#mail");
const author = document.querySelector("#author");
const searchInput = document.querySelector("#search");
let arr = []
let data = [];

complete.classList.add("add");
const renderData = (todolist) =>{
let html = ``
todolist.forEach(element => {
    html += `
    <tr>
      <td class="id">${element.id}</td>
      <td class="title">${element.mail}</td>
      <td class="des">${element.des}</td>
      <td class="author">${element.author}</td>
      <td class="edit"><i class="fas fa-edit"></i></td>
      <td class="trash"><i class="fas fa-trash-alt"></i></td>
    </tr>`
});
tbody.insertAdjacentHTML("beforeend", html);
}


//add,update,delete actions

const handleDelete = function (e) {
  const clicked = e.target;
  const id = clicked.closest("tr").querySelector(".id").textContent;
  
  axios.delete(`http://localhost:3000/todos/${id}`)
    .then(function () {
      clicked.closest("tr").remove();
    })
};

const handleClickComplete = function (event) {
  event.preventDefault();
  if (complete.classList.contains("add")) {
    addNewUser();
  } else if (complete.classList.contains("update")) {
    updateCurrentUser();
  }
};
const handleEdit = function (e) {
  showPopup();
  complete.className = "update";
  const clicked = e.target;
  const trClosest = clicked.closest("tr");
  const currentMail = trClosest.querySelector(".title").textContent;
  const currentDes = trClosest.querySelector(".des").textContent;
  const currentAuthor = trClosest.querySelector(".author").textContent;
  mail.value = currentMail;
  des.value = currentDes;
  author.value = currentAuthor;
  clicked.closest("tr").classList.add("updateUser");
};

const addNewUser = function () {
  const valueMail = mail.value;
  const valueDes = des.value;
  const valueAuthor = author.value;
  const body = {
    mail: valueMail,
    des: valueDes,
    author: valueAuthor
  }
  axios.post('http://localhost:3000/todos',body).then((res) => {
      const newUser = res.data; 
      arr.push(newUser);
      renderData([newUser]);
      hidePopup();
      deleteInputValue();
  })
};

const updateCurrentUser = function () {
  const trUpdate = tbody.querySelector(".updateUser");
  trUpdate.querySelector(".title").textContent = mail.value;
  trUpdate.querySelector(".des").textContent = des.value;
  trUpdate.querySelector(".author").textContent = author.value;

  const id = trUpdate.querySelector(".id").textContent;
  const updatedData = {
    mail: mail.value,
    des: des.value,
    author: author.value
  };

  axios.put(`http://localhost:3000/todos/${id}`, updatedData)
    .then(function () {
      const userIndex = data.findIndex(user => user.id === id);
      if (userIndex !== -1) {
        data[userIndex] = {
          id: id,
          ...updatedData
        };
      }
      trUpdate.classList.remove("updateUser");
      complete.className = "add";
      hidePopup();
      deleteInputValue();
    });
};

function handleSearch(event) {
  const clicked = event.target;
  const searchTerm = clicked.value.toLowerCase();

  axios.get("http://localhost:3000/todos")
    .then(function (response) {
      const data = response.data;

      const filteredData = data.filter(function (element) {
        const mail = element.mail.toLowerCase();
        return mail.includes(searchTerm);
      });
      
      tbody.innerHTML = "";

      renderData(filteredData);
  })
}



//popub
const handleButton = function (e) {
  const clicked = e.target;
  if (clicked.classList.contains("fa-edit")) {
    handleEdit(e);
  } else if (clicked.classList.contains("fa-trash-alt")) {
    handleDelete(e);
  }
};


function showPopup  () {
    overlay.classList.add("active");
    formAddEdit.classList.add("active");
}
function hidePopup () {
    overlay.classList.remove("active");
    formAddEdit.classList.remove("active");
}

function getDataAndRender() {
    axios.get("http://localhost:3000/todos")
      .then(function (response) {
        const todos = response.data;
        renderData(todos);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  




const showDataLoaded = () =>{
    getDataAndRender();
};

showDataLoaded();
complete.addEventListener('click',handleClickComplete)
btnAdd.addEventListener('click', showPopup)
cancel.addEventListener('click',hidePopup)
tbody.addEventListener("click", handleButton);
searchInput.addEventListener('input', handleSearch);
