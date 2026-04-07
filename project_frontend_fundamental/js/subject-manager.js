let subjects = JSON.parse(localStorage.getItem("subjects")) ||
    [
    { id: 1, subject_name: "HTML cơ bản", status: "active" },
    { id: 2, subject_name: "CSS nâng cao", status: "active" },
    { id: 3, subject_name: "JavaScript cơ bản", status: "active" },
    { id: 4, subject_name: "JavaScript nâng cao", status: "stop" },
    // { id: 5, subject_name: "ReactJS", status: "active" },

    // { id: 6, subject_name: "NodeJS", status: "active" },
    // { id: 7, subject_name: "ExpressJS", status: "stop" },
    // { id: 8, subject_name: "MongoDB", status: "active" },
    // { id: 9, subject_name: "MySQL", status: "active" },
    // { id: 10, subject_name: "PHP cơ bản", status: "stop" },

    // { id: 11, subject_name: "Laravel", status: "active" },
    // { id: 12, subject_name: "Java Core", status: "active" },
    // { id: 13, subject_name: "Spring Boot", status: "stop" },
    // { id: 14, subject_name: "C++", status: "active" },
    // { id: 15, subject_name: "Python", status: "active" },

    // { id: 16, subject_name: "Django", status: "stop" },
    // { id: 17, subject_name: "Machine Learning", status: "active" },
    // { id: 18, subject_name: "AI cơ bản", status: "active" },
    // { id: 19, subject_name: "Data Science", status: "stop" },
    // { id: 20, subject_name: "Git & GitHub", status: "active" }
];

//khai báo biến phân trang
let currentPage = 1; //trang hiện tại
let pageSize = 5;

let keyword = "";
let statusFilterValue = "";
let isAsc = true;

// truy cập phần tử
const userInfo = document.getElementById("user");
const userBox = document.getElementById("user-infor");

const subjectList = document.getElementById("subject-list");


userInfo.addEventListener("click", function () {
    userBox.classList.toggle("show");
})

document.addEventListener("click", function (e) {
    if (!userInfo.contains(e.target)) {
        userBox.classList.remove("show");
    }
})

//hàm save dữ liệu
function saveSubjects() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}

//đăng xuất
const modalLogout = document.getElementById("modalLogout");
const btnCancelLogout = document.getElementById("btnCancelLogout");
const btnConfirmLogout = document.getElementById("btnConfirmLogout");

function logOut() {
    // localStorage.removeItem("currentUser");
    // sessionStorage.removeItem("currentUser");
    // window.location.href = "./index.html";
    modalLogout.classList.add("show");
}

btnCancelLogout.onclick = () => {
    modalLogout.classList.remove("show");
}

btnConfirmLogout.onclick = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    window.location.href = "./index.html";
};

//chức năng hiển thị
function renderSubjects() {
    let data = getProcessedData();

    subjectList.innerHTML = "";

    if (data.length === 0) {
        subjectList.innerHTML = `
            <div class="empty">không có môn học nào</div>    
        `;
        return;
    }

    //tính phân trang
    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let paginatedData = data.slice(start, end);

    paginatedData.forEach(subject => {
        const row = document.createElement("div");
        row.classList.add("row");

        row.innerHTML = `
            <div>${subject.subject_name}</div>
            <div><span class="status ${subject.status}">●${subject.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}</span></div>
                <div class="actions-icon">
                    <span class="icon delete-btn" data-id="${subject.id}"><img src="../assets/icons/Button.png" alt="logo"></span>
                    <span class="icon edit-btn" data-id="${subject.id}"><img src="../assets/icons/_Button base.png" alt="logo"></span>
                </div>
        `;
        subjectList.appendChild(row);
    });

    renderPagination(data);
}

function getProcessedData() {
    let result = [...subjects];

    // 1. filter theo trạng thái
    if (statusFilterValue !== "") {
        result = result.filter(s => s.status === statusFilterValue);
    }

    // 2. search theo tên
    if (keyword !== "") {
        result = result.filter(s =>
            s.subject_name.toLowerCase().includes(keyword)
        );
    }

    // 3. sort
    result.sort((a, b) => {
        return isAsc
            ? a.subject_name.localeCompare(b.subject_name)
            : b.subject_name.localeCompare(a.subject_name);
    });

    return result;
}

//chức năng tìm kiếm
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    keyword = searchInput.value.toLowerCase();
    currentPage = 1; //reset trang
    renderSubjects();
})

renderSubjects();

//chức năng thêm
const btnOpenModal = document.getElementById("btnOpenModal");
const modalAdd = document.getElementById("modalAdd");
const btnCancelAdd = document.getElementById("btnCancelAdd");
const btnAdd = document.getElementById("btnAdd");

const inputSubject = document.getElementById("inputSubject");
const statusActive = document.getElementById("statusActive");
const statusStop = document.getElementById("statusStop");

//bật tắt popup
btnOpenModal.onclick = () => {
    modalAdd.classList.add("show");
};

btnCancelAdd.onclick = () => {
    modalAdd.classList.remove("show");
};

btnAdd.onclick = function (e) {
    e.preventDefault();

    let name = inputSubject.value.trim();

    const errorAdd = document.querySelector("#modalAdd .err-msg");

    let isValid = true;

    // reset lỗi
    errorAdd.style.display = "none";
    inputSubject.style.border = "1px solid #ccc";

    // kiểm tra rỗng
    if (name === "") {
        errorAdd.innerText = "Tên môn học không được để trống";
        errorAdd.style.display = "block";
        inputSubject.style.border = "1px solid red";
        isValid = false;
    }

    // kiểm tra trùng
    let isExist = subjects.some(s => 
        s.subject_name.toLowerCase() === name.toLowerCase()
    );

    if (isExist) {
        errorAdd.innerText = "Tên môn học đã tồn tại";
        errorAdd.style.display = "block";
        inputSubject.style.border = "1px solid red";
        isValid = false;
    }

    if (!isValid) return;

    let status = "active"
    if (statusStop.checked) {
        status = "stop";
    }

    let newSubject = {
        id: Date.now(),
        subject_name: name,
        status: status
    }

    subjects.push(newSubject);
    currentPage = 1; // thêm xong sẽ về trang đầu
    saveSubjects();
    renderSubjects();

    inputSubject.value = "";
    statusActive.checked = false;
    statusStop.checked = false;
    modalAdd.classList.remove("show");

    showToast("thêm môn học thành công!");
}

//chức năng xóa
let modalDelete = document.getElementById("modalDelete");
let btnCancelDelete = document.getElementById("btnCancelDelete");
let btnConfirmDelete = document.getElementById("btnConfirmDelete");

let idDelete = null;

// mở popup xóa
document.addEventListener("click", function (e) {
    if (e.target.closest(".delete-btn")) {
        idDelete = Number(e.target.closest(".delete-btn").dataset.id);

        let subject = subjects.find(s => s.id === idDelete);
        document.querySelector("#modalDelete b").innerText = subject.subject_name;

        modalDelete.classList.add("show");
    }
});

btnCancelDelete.onclick = () => {
    modalDelete.classList.remove("show");
};

// logic xóa
btnConfirmDelete.onclick = () => {
    subjects = subjects.filter(s => s.id !== idDelete);

    let data = getProcessedData();

    if ((currentPage - 1) * pageSize >= data.length) {
        currentPage--;
    }

    saveSubjects();
    renderSubjects();

    modalDelete.classList.remove("show");

    showToast("xóa môn học thành công!");
};

// checkbox chỉ chọn 1
statusActive.addEventListener("change", () => {
    if (statusActive.checked) {
        statusStop.checked = false;
    }
});

statusStop.addEventListener("change", () => {
    if (statusStop.checked) {
        statusActive.checked = false;
    }
});

//chức năng lọc theo trạng thái
const statusFilter = document.getElementById("filterStatus");

statusFilter.addEventListener("change", function () {
    statusFilterValue = statusFilter.value;

    currentPage = 1; //reset trang
    renderSubjects();
})

//chức năng sắp xếp theo tên
const sortName = document.getElementById("sortName");

sortName.addEventListener("click", function () {
    isAsc = !isAsc;

    currentPage = 1; //reset trang
    renderSubjects();
})

//chức năng cập nhật 
const modalUpdate = document.getElementById("modalUpdate");
const updateSubject = document.getElementById("updateSubject");
const updateActive = document.getElementById("updateActive");
const updateStop = document.getElementById("updateStop");

const btnCancelUpdate = document.getElementById("btnCancelUpdate");
const btnUpdate = document.getElementById("btnUpdate");

const errorSubject = document.getElementById("errorUpdate");

// biến để bt đang sửa môn nào
let idUpdate = null;

document.addEventListener("click", function(e) {
 
    if(e.target.closest(".edit-btn")){
        //lấy id môn
        idUpdate = Number(e.target.closest(".edit-btn").dataset.id);

        //tìm môn
        let subject = subjects.find(s => s.id === idUpdate);

        updateSubject.value = subject.subject_name;

        if(subject.status === "active"){
            updateActive.checked = true;
            updateStop.checked = false;
        }else{
            updateActive.checked = false;
            updateStop.checked = true;
        }

        // reset lỗi
        errorSubject.style.display = "none";
        updateSubject.style.border = "1px solid #ccc";

        modalUpdate.classList.add("show");
    }
})

btnCancelUpdate.onclick = () => {
    modalUpdate.classList.remove("show");
};

//chỉ được chọn 1 trong 2 checkbox
updateActive.addEventListener("change", () => {
    if (updateActive.checked){
        updateStop.checked = false;
    }
});

updateStop.addEventListener("change", () => {
    if (updateStop.checked){
        updateActive.checked = false;
    }
});

btnUpdate.onclick = () => {
    let name = updateSubject.value.trim();

    let isValid = true;

    // reset lỗi
    errorSubject.style.display = "none";
    updateSubject.style.border = "1px solid #ccc";

    // kiểm tra rỗng
    if (name === "") {
        errorSubject.style.display = "block";
        updateSubject.style.border = "1px solid red";
        isValid = false;
    }

    // kiểm tra trùng
    let isExist = subjects.some(s => 
        s.subject_name.toLowerCase() === name.toLowerCase() && s.id !== idUpdate
    );

    if (isExist) {
        errorSubject.innerText = "Tên môn học đã tồn tại";
        errorSubject.style.display = "block";
        updateSubject.style.border = "1px solid red";
        isValid = false;
    }

    // kiểm tra trạng thái
    if (!updateActive.checked && !updateStop.checked) {
        alert("Vui lòng chọn trạng thái");
        isValid = false;
    }

    if (!isValid) return;

    //lấy trạng thái
    let status = updateActive.checked ? "active" : "stop";

    //tìm môn cần sửa
    let subject = subjects.find(s => s.id === idUpdate);

    //cập nhật
    subject.subject_name = name;
    subject.status = status;

    //lưu vào localStorage
    saveSubjects()

    currentPage = 1; //reset trang

    //render lại
    renderSubjects();

    modalUpdate.classList.remove("show");

    showToast("cập nhật môn học thành công")

    //reset
    updateSubject.value = "";
    updateActive.checked = false;
    updateStop.checked = false;
}

// chức năng phân trang
function renderPagination(data) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    let totalPages = Math.ceil(data.length / pageSize);

    // nút prev
    let prevBtn = document.createElement("button");
    prevBtn.innerHTML = "<";
    prevBtn.disabled = currentPage === 1; //nếu đang ở trang 1 thì không bấm được
    prevBtn.onclick = () => {
        currentPage--;
        renderSubjects();
    };
    pagination.appendChild(prevBtn);

    // số trang
    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement("button");
        btn.innerText = i;

        if (i === currentPage) {
            btn.style.background = "#333";
            btn.style.color = "#fff";
        }

        btn.onclick = () => {
            currentPage = i;
            renderSubjects();
        };

        pagination.appendChild(btn);
    }

    // nút next
    let nextBtn = document.createElement("button");
    nextBtn.innerHTML = ">";
    nextBtn.disabled = currentPage === totalPages; 
    nextBtn.onclick = () => {
        currentPage++;
        renderSubjects();
    };
    pagination.appendChild(nextBtn);
}

//toast msg
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
            <div class="toastHeader">
                    <div class="toast-left">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM10 14.17L16.59 7.58L18 9L10 17L6 13L7.41 11.59L10 14.17Z"
                                fill="#02EE6A" />
                        </svg>
                        <p>Thành công</p>
                    </div>
                    <div class="toast-right">
                        <button class = "close-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none">
                                <rect width="24" height="24" rx="12" fill="white" fill-opacity="0.35" />
                                <path
                                    d="M16.6666 8.27337L15.7266 7.33337L11.9999 11.06L8.27325 7.33337L7.33325 8.27337L11.0599 12L7.33325 15.7267L8.27325 16.6667L11.9999 12.94L15.7266 16.6667L16.6666 15.7267L12.9399 12L16.6666 8.27337Z"
                                    fill="white" />
                            </svg></button>
                    </div>
                </div>

                <div class="toast-content">
                    <p id="text-toast">${msg}</p>
                </div>
        `;

    toastBox.appendChild(toast);

    const closeBtn = toast.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });

    setTimeout(() => {
        toast.remove();
    }, 2500);
}