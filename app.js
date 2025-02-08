// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtDGGX-S7hjgnxnHr2bE9lP0ROOKgGcYs",
  authDomain: "global-97c43.firebaseapp.com",
  projectId: "global-97c43",
  storageBucket: "global-97c43.appspot.com",
  messagingSenderId: "916302492967",
  appId: "1:916302492967:web:7ce9a498a5e7a6ec762502",
  measurementId: "G-1K6VGLCHS6"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const uploadButton = document.getElementById("upload-button");
const postContent = document.getElementById("post-content");
const postsContainer = document.getElementById("posts-container");

// Search Functionality
searchButton.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase();
  fetchPosts(query);
});

// Upload Content
uploadButton.addEventListener("click", () => {
  const content = postContent.value;
  if (content.trim()) {
    db.collection("posts").add({
      content: content,
      likes: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    postContent.value = ''; // Clear textarea
  }
});

// Fetch and display posts
function fetchPosts(query = "") {
  postsContainer.innerHTML = ''; // Clear previous posts
  db.collection("posts")
    .orderBy("likes", "desc")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const post = doc.data();
        if (post.content.toLowerCase().includes(query)) {
          const postElement = document.createElement("div");
          postElement.classList.add("post");

          const postText = document.createElement("p");
          postText.textContent = post.content;

          const likeButton = document.createElement("button");
          likeButton.textContent = `Like (${post.likes})`;
          likeButton.addEventListener("click", () => {
            db.collection("posts").doc(doc.id).update({
              likes: post.likes + 1
            });
          });

          const commentSection = document.createElement("div");
          commentSection.classList.add("comments");

          // Comment functionality
          const commentInput = document.createElement("input");
          commentInput.placeholder = "Tulis komentar...";
          const commentButton = document.createElement("button");
          commentButton.textContent = "Kirim Komentar";
          commentButton.addEventListener("click", () => {
            const comment = commentInput.value;
            if (comment.trim()) {
              db.collection("posts").doc(doc.id).update({
                comments: firebase.firestore.FieldValue.arrayUnion(comment)
              });
            }
            commentInput.value = ''; // Clear comment input
          });

          commentSection.appendChild(commentInput);
          commentSection.appendChild(commentButton);

          postElement.appendChild(postText);
          postElement.appendChild(likeButton);
          postElement.appendChild(commentSection);
          postsContainer.appendChild(postElement);
        }
      });
    });
}

// Initial fetch of posts
fetchPosts();
