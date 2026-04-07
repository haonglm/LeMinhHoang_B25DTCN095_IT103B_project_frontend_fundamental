let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
let lessons = JSON.parse(localStorage.getItem("lessons")) || [
    {id: 1, lesson_name: "Session 01 - tổng quan HTML", subject: "HTML cơ bản", time: 45, status: "active"}
]

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
    lessonList.innerHTML = "";

    if (lessons.length === 0) {
        lessonList.innerHTML = `<div class="empty">không có bài học</div>`;
        return;
    }

    lessons.forEach(lesson => {
        const row = document.createElement("div");
        row.classList.add("row");

        row.innerHTML = `
            <div><input type="checkbox"></div>
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
}

//hàm render option
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

    saveLessons();
    renderLessons();

    modalAdd.classList.remove("show");

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


renderSubjectOptions();
renderLessons();
