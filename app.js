const list = document.querySelector("#list");

const form = document.querySelector("form");

list.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
        const id = e.target.parentElement.getAttribute("data-id");
        db.collection('courses').doc(id).delete()
            .then(() => {
                console.log("Doc :" + id, " Deleted ");
            }).catch(error => {
                console.log(error);
            })
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const now = new Date();
    const course = {
        title: form.title.value,
        author: form.author.value,
        creat_at: firebase.firestore.Timestamp.fromDate(now)
    }
    db.collection('courses').add(course)
        .then(res =>{
            console.log(res, "Course added");
            form.reset();
        } )
        .catch(error => console.log(error))
})
// function AddCourse
const AddCourse = (course, idCourse) => {
    const html = `
    <li class='list-group-item' data-id="${idCourse}">
    <h6>${course.title}</h6>
    <h6>${course.author}</h6>
    <h6>${course.creat_at.toDate()}</h6>
    <button class='btn btn-danger btn-sm my-3'>Delete</button>
    </li>
    `
    list.innerHTML += html;
}


const deleteCourse = (id) => {
    const courses = document.querySelectorAll("li");
    courses.forEach((course) => {
        if (course.getAttribute('data-id') === id) {
            course.remove();
        }
    })
}
// redtreive data from database ////////////
// db.collection("courses").get()
//     .then(res => {
//         res.docs.forEach(course => {
//             AddCourse(course.data(), course.id);
//         })
//     })
//     .catch(error => {
//         console.log(error);
//     })

db.collection('courses').onSnapshot((snap) => {
    console.log(snap.docChanges());
    snap.docChanges().forEach((course) => {
        if (course.type === "added") {
            AddCourse(course.doc.data(), course.doc.id);
        }
        if (course.type === "removed") {
            deleteCourse(course.doc.id);
        }
    })
})
//////////////////////////////////////////////////////

