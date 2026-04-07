let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let lessons = JSON.parse(localStorage.getItem("lessons")) || [
    {id: 1, lesson_name: "Session 01 - tổng quan HTML", subject: "HTML cơ bản", time: 45, status: "active"}
]

let filterValue = "";
let sortType = "";
let currentPage = 1;
let pageSize = 5;

//hàm lưu dữ liệu
function saveLessons() {
    localStorage.setItem("lessons", JSON.stringify(lessons));
}

// truy cập phần tử
const userInfo = document.getElementById("user");
const userBox = document.getElementById("user-infor");

//hiển thị và ẩn popup đăng xuất
userInfo.addEventListener("click", function() {
    userBox.classList.toggle("show");
})

document.addEventListener("click", function(e) {
    if(!userInfo.contains(e.target)) {
        userBox.classList.remove("show");
    }
})

//đăng xuất
const modalLogout = document.getElementById("modalLogout");
const btnCancelLogout = document.getElementById("btnCancelLogout");
const btnConfirmLogout = document.getElementById("btnConfirmLogout");

function logOut() {
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
const lessonList = document.getElementById("lesson-list");

function renderLessons() {
    let data = getProcessedLessons();
    lessonList.innerHTML = "";

    if (data.length === 0) {
        lessonList.innerHTML = `<div class="empty">không có bài học</div>`;
        return;
    }

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let paginatedData = data.slice(start, end);

    paginatedData.forEach(lesson => {
        const row = document.createElement("div");
        row.classList.add("row");

        row.innerHTML = `
            <div><input type="checkbox" class="status-checkbox" data-id="${lesson.id}" ${lesson.status === "active" ? "checked" : ""}></div>
            <div>${lesson.lesson_name}</div>
            <div>${lesson.time}</div>
            <div>
                <span class="status ${lesson.status}">● ${lesson.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}</span>
            </div>
            <div class="actions-icon">
                <span class="icon delete-btn" data-id="${lesson.id}">
                    <img src="../assets/icons/Button.png">
                </span>
                <span class="icon edit-btn" data-id="${lesson.id}">
                    <img src="../assets/icons/_Button base.png">
                </span>
            </div>
        `;

        lessonList.appendChild(row);
    });

    renderPagination(data);
}

function getProcessedLessons() {
    let result = [...lessons];

    // filter
    if (filterValue !== "") {
        result = result.filter(l => l.subject === filterValue);
    }

    // sort
    if (sortType === "name") {
        result.sort((a, b) => {
            return sortState.name === "asc"
                ? a.lesson_name.localeCompare(b.lesson_name)
                : b.lesson_name.localeCompare(a.lesson_name);
        });
    }

    if (sortType === "time") {
        result.sort((a, b) => {
            return sortState.time === "asc"
                ? a.time - b.time
                : b.time - a.time;
        });
    }

    return result;
}

//hàm render option thêm
function renderSubjectOptions() {
    const lessonSubject = document.getElementById("lessonSubject");

    lessonSubject.innerHTML = `<option value="">Chọn môn học</option>`;

    subjects.forEach(subject => {
        let option = document.createElement("option");
        option.value = subject.subject_name;
        option.innerText = subject.subject_name;

        lessonSubject.appendChild(option);
    });
}

//hàm render option cập nhật
function renderSubjectOptionsUpdate(selectedValue) {
    updateLessonSubject.innerHTML = `<option value="">Chọn môn học</option>`;

    subjects.forEach(subject => {
        let option = document.createElement("option");
        option.value = subject.subject_name;
        option.innerText = subject.subject_name;

        // chọn sẵn
        if (subject.subject_name === selectedValue) {
            option.selected = true;
        }

        updateLessonSubject.appendChild(option);
    });
}

//hàm render option lọc theo môn
function renderFilterOptions() {
    const filterSubject = document.getElementById("filterSubject");

    filterSubject.innerHTML = `<option value="">Lọc theo môn học</option>`;

    subjects.forEach(subject => {
        let option = document.createElement("option");
        option.value = subject.subject_name;
        option.innerText = subject.subject_name;

        filterSubject.appendChild(option);
    });
}

//đóng mở popup thêm
const btnOpenModal = document.getElementById("btnOpenModal");
const modalAdd = document.getElementById("modalAdd");

const lessonName = document.getElementById("lessonName");
const lessonSubject = document.getElementById("lessonSubject");
const lessonTime = document.getElementById("lessonTime");

const errorName = document.getElementById("errorName");
const errorTime = document.getElementById("errorTime");

const btnAdd = document.getElementById("btnAdd");
const btnCancelAdd = document.getElementById("btnCancelAdd");


btnOpenModal.onclick = () => {
    renderSubjectOptions();
    modalAdd.classList.add("show");
}

btnCancelAdd.onclick = () => {
    modalAdd.classList.remove("show");
}

//chức năng thêm bài học
btnAdd.onclick = function () {
    let name = lessonName.value.trim();
    let subject = lessonSubject.value;
    let time = Number(lessonTime.value);

    let isValid = true;

    // reset lỗi
    errorName.style.display = "none";
    errorTime.style.display = "none";

    lessonName.style.border = "1px solid #ccc";
    lessonTime.style.border = "1px solid #ccc";

    // kiểm tra tên rỗng
    if (name === "") {
        errorName.innerText = "Tên bài học không được để trống";
        errorName.style.display = "block";
        lessonName.style.border = "1px solid red";
        isValid = false;
    }

    // kiểm tra trùng
    let isExist = lessons.some(l =>
        l.lesson_name.toLowerCase() === name.toLowerCase()
    );

    if (isExist) {
        errorName.innerText = "Tên bài học đã tồn tại";
        errorName.style.display = "block";
        lessonName.style.border = "1px solid red";
        isValid = false;
    }

    //kiểm tra ng dùng chọn chưa
    if(subject == ""){
        alert("vui lòng chọn môn");
        isValid = false;
    }

    // kiểm tra thời gian
    if (time <= 0 || isNaN(time)) {
        errorTime.innerText = "Thời gian phải lớn hơn 0";
        errorTime.style.display = "block";
        lessonTime.style.border = "1px solid red";
        isValid = false;
    }

    if (!isValid) return;

    let newLesson = {
        id: Date.now(),
        lesson_name: name,
        subject: subject,
        time: time,
        status: "active"
    };

    lessons.push(newLesson);
    currentPage = 1;
    saveLessons();
    renderLessons();

    modalAdd.classList.remove("show");
    showToast("thêm bài học thành công");

    // reset
    lessonName.value = "";
    lessonSubject.value = "";
    lessonTime.value = "";
};

//chức năng xóa bài học
const modalDelete = document.getElementById("modalDelete");
const btnConfirmDelete = document.querySelector(".popup-button-delete");
const btnCancelDelete = document.querySelector(".modal-overlay-delete .popup-button-cancel");

let idDelete = null;

// mở popup xóa
document.addEventListener("click", function (e) {
    if (e.target.closest(".delete-btn")) {
        idDelete = Number(e.target.closest(".delete-btn").dataset.id);

        modalDelete.classList.add("show");
    }
});

// hủy xóa
btnCancelDelete.onclick = () => {
    modalDelete.classList.remove("show");
};

// xác nhận xóa
btnConfirmDelete.onclick = () => {
    lessons = lessons.filter(l => l.id !== idDelete);

    saveLessons();
    renderLessons();

    modalDelete.classList.remove("show");
};

//chức năng sửa và cập nhật
const modalUpdate = document.getElementById("modalUpdate");

const updateLessonName = document.getElementById("updateLessonName");
const updateLessonSubject = document.getElementById("updateLessonSubject");
const updateLessonTime = document.getElementById("updateLessonTime");

const errorUpdateName = document.getElementById("errorUpdateName");
const errorUpdateSubject = document.getElementById("errorUpdateSubject");
const errorUpdateTime = document.getElementById("errorUpdateTime");

const btnUpdate = document.getElementById("btnUpdate");
const btnCancelUpdate = document.getElementById("btnCancelUpdate");

let idUpdate = null;

document.addEventListener("click", function (e){
    if(e.target.closest(".edit-btn")){
        idUpdate = Number(e.target.closest(".edit-btn").dataset.id);

        let lesson = lessons.find(l => l.id === idUpdate);

        //fill dữ liệu
        updateLessonName.value = lesson.lesson_name;
        updateLessonTime.value = lesson.time;
        updateLessonSubject.value = lesson.subject;

        //reset lỗi
        errorUpdateName.style.display = "none";
        errorUpdateSubject.style.display = "none";
        errorUpdateTime.style.display = "none";

        updateLessonName.style.border = "1px solid #ccc";
        updateLessonSubject.style.border = "1px solid #ccc";
        updateLessonTime.style.border = "1px solid #ccc";

        renderSubjectOptionsUpdate(lesson.subject);
        modalUpdate.classList.add("show");
    }
});

btnCancelUpdate.onclick = () => {
    modalUpdate.classList.remove("show");
}

btnUpdate.onclick = () => {
    let name = updateLessonName.value.trim();
    let subject = updateLessonSubject.value;
    let time = Number(updateLessonTime.value);

    let isValid = true;

    //reset lỗi
    errorUpdateName.style.display = "none";
    errorUpdateSubject.style.display = "none";
    errorUpdateTime.style.display = "none";

    updateLessonName.style.border = "1px solid #ccc";
    updateLessonSubject.style.border = "1px solid #ccc";
    updateLessonTime.style.border = "1px solid #ccc";

    //validate
    if(name === ""){
        errorUpdateName.innerText = "Tên bài học không được để trống";
        errorUpdateName.style.display = "block";
        updateLessonName.style.border = "1px solid red";
        isValid = false;
    }

    let isExist = lessons.some(l => l.lesson_name.toLowerCase() === name.toLowerCase() && l.id != idUpdate);

    if(isExist){
        errorUpdateName.innerText = "tên bài học đã tồn tại";
        errorUpdateName.style.display = "block";
        updateLessonName.style.border = "1px solid red";
        isValid = false;
    }

    if(subject === ""){
        errorUpdateSubject.innerText = "Vui lòng chọn môn học";
        errorUpdateSubject.style.display = "block";
        updateLessonSubject.style.border = "1px solid red";
        isValid = false;
    }

    if (time <= 0) {
        errorUpdateTime.innerText = "Thời gian phải lớn hơn 0";
        errorUpdateTime.style.display = "block";
        updateLessonTime.style.border = "1px solid red";
        isValid = false;
    }

    if(!isValid){
        return;
    }

    let index = lessons.findIndex(l => l.id === idUpdate);

    lessons[index].lesson_name = name;
    lessons[index].subject = subject;
    lessons[index].time = time;

    saveLessons();
    renderLessons();

    modalUpdate.classList.remove("show");
    showToast("cập nhật bài học thành công");
}

//tick đổi trạng thái
document.addEventListener("change", function (e){
    if(e.target.classList.contains("status-checkbox")){
        let id = Number(e.target.dataset.id);

        let lesson = lessons.find(l => l.id === id);

        //đổi trạng thái
        if(e.target.checked){
            lesson.status = "active";
        }else{
            lesson.status = "stop";
        }

        saveLessons();
        renderLessons();
    }
})

//sắp xếp theo tên và thời gian học
let sortState = {
    name: "asc",
    time: "asc"
}

let sort = "";

function sortLessons(type) {
    sortType = type;

    if(type === "name"){
        sortState.name = sortState.name === "asc" ? "desc" : "asc";
    }

    if(type === "time"){
        sortState.time = sortState.time === "asc" ? "desc" : "asc";
    }

    currentPage = 1;
    renderLessons();
}

document.querySelectorAll(".sortable").forEach(el =>{
    el.addEventListener("click", function(){
        let type = this.dataset.type;
        sortLessons(type);
    })
})

//lọc bài học theo môn
const filterSubject = document.getElementById("filterSubject");
    filterSubject.addEventListener("change", function(){
        filterValue = filterSubject.value;
        currentPage = 1; // reset trang
        renderLessons();
    })

//phân trang
function renderPagination(data) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    let totalPages = Math.ceil(data.length / pageSize);

    // prev
    let prevBtn = document.createElement("button");
    prevBtn.innerHTML = "<";
    prevBtn.disabled = currentPage === 1;

    prevBtn.onclick = () => {
        currentPage--;
        renderLessons();
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
            renderLessons();
        };

        pagination.appendChild(btn);
    }

    // next
    let nextBtn = document.createElement("button");
    nextBtn.innerHTML = ">";
    nextBtn.disabled = currentPage === totalPages;

    nextBtn.onclick = () => {
        currentPage++;
        renderLessons();
    };

    pagination.appendChild(nextBtn);
}

//toast msg
const toastBox = document.getElementById("toastBox");
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

renderSubjectOptions();
renderFilterOptions();
renderLessons();
