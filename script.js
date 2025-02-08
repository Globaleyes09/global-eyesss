document.addEventListener("DOMContentLoaded", function () {
    loadPosts();
    fetchComments();
});

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtDGGX-S7hjgnxnHr2bE9lP0ROOKgGcYs",
  authDomain: "global-97c43.firebaseapp.com",
  projectId: "global-97c43",
  storageBucket: "global-97c43.appspot.com",
  messagingSenderId: "916302492967",
  appId: "1:916302492967:web:7ce9a498a5e7a6ec762502",
  measurementId: "G-1K6VGLCHS6"
};

// Inisialisasi Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fungsi Menambahkan Postingan ke Firebase
async function addPost() {
    let postText = document.getElementById("newPost").value;
    if (postText.trim() === "") return;

    await db.collection("posts").add({
        text: postText,
        likes: 0,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.getElementById("newPost").value = "";
    loadPosts();
}

// Fungsi Memuat Postingan dari Firebase
async function loadPosts() {
    let postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    const querySnapshot = await db.collection("posts").orderBy("timestamp", "desc").get();
    querySnapshot.forEach((doc) => {
        let post = doc.data();
        let postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `<p>${post.text}</p>
                                 <button class="like-button" onclick="likePost('${doc.id}')">Like (${post.likes})</button>`;
        postsContainer.appendChild(postElement);
    });
}

// Fungsi Like Postingan
async function likePost(postId) {
    const postRef = db.collection("posts").doc(postId);
    const postDoc = await postRef.get();
    
    if (postDoc.exists) {
        let newLikes = postDoc.data().likes + 1;
        await postRef.update({ likes: newLikes });
        loadPosts();
    }
}

// Fungsi Menambahkan Komentar
async function addComment() {
    const commentInput = document.getElementById("comment-input");
    const commentText = commentInput.value.trim();
    
    if (commentText !== "") {
        await db.collection("comments").add({
            text: commentText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        commentInput.value = "";
        fetchComments();
    }
}

// Fungsi Menampilkan Komentar
async function fetchComments() {
    const querySnapshot = await db.collection("comments").orderBy("timestamp", "desc").get();
    
    let commentList = "";
    querySnapshot.forEach((doc) => {
        commentList += `<p>${doc.data().text}</p>`;
    });
    
    document.getElementById("
