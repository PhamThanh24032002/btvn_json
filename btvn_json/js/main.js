const btnAdd = document.querySelector(".btnAdd");
const overlay = document.querySelector(".overlay");
const formAddEdit = document.querySelector(".form-add-edit");
const form = document.querySelector(".form");
const btnComplete = document.querySelector("#complete");
const btnCancel = document.querySelector("#cancel");
const mail = document.querySelector("#mail");
const des = document.querySelector("#des");
const author = document.querySelector("#author");
const tbody = document.querySelector("tbody");

const searchInput = document.querySelector("#search");

btnComplete.classList.add("add");

const renderData = function (data) {
  let html = ``;
  data.forEach(function(element) {
    html += `
    <tr>
      <td class="id">${element.id}</td>
      <td class="title">${element.mail}</td>
      <td class="des">${element.des}</td>
      <td class="author">${element.author}</td>
      <td class="edit"><i class="fas fa-edit"></i></td>
      <td class="trash"><i class="fas fa-trash-alt"></i></td>
    </tr>`
  })
  tbody.insertAdjacentHTML("beforeend", html);
};

const showPopup = function () {
  overlay.classList.add("active");
  formAddEdit.classList.add("active");
  form.style.transform = "scale(1)";
};

const hidePopup = function () {
  btnComplete.className = "add";
  deleteInputValue();
  overlay.classList.remove("active");
  formAddEdit.classList.remove("active");
  form.style.transform = "scale(0)";
};

const deleteInputValue = function () {
  mail.value = "";
  des.value = "";
  author.value = "";
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
  const valueMail = mail.value;
  const valueDes = des.value;
  const valueAuthor = author.value;

  if (btnComplete.classList.contains("add")) {
    addNewTodo();
  } else if (btnComplete.classList.contains("update")) {
    updateCurrentUser();
  }
};

const addNewTodo = function () {
  const valueMail = mail.value;
  const valueDes = des.value;
  const valueAuthor = author.value;

  axios.post(
    'http://localhost:3000/todos',
    { mail: valueMail, des: valueDes, author: valueAuthor }
  )
    .then(function () {
      hidePopup();
      getDataAndRender();
      deleteInputValue();
    });
};

const updateCurrentUser = function () {
  const trUpdate = tbody.querySelector(".updateUser");
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
      btnComplete.className = "add";
      deleteInputValue();
      hidePopup();
    });
};

function filterMail(event) {
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

const handleButton = function (e) {
  const clicked = e.target;
  if (clicked.classList.contains("fa-edit")) {
    handleEdit(e);
  } else if (clicked.classList.contains("fa-trash-alt")) {
    handleDelete(e);
  }
};

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

function showDataLoaded() {
  getDataAndRender();
}

showDataLoaded();

btnAdd.addEventListener("click", showPopup);
btnCancel.addEventListener("click", hidePopup);
btnComplete.addEventListener("click", handleClickComplete);
tbody.addEventListener("click", handleButton);
searchInput.addEventListener("input", filterMail);
