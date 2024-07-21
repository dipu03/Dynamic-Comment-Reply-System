// Example data structure
const comments = [];

// Function to render comments
function renderComments(comments, parentElement) {
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        const contentElement = document.createElement('div');
        contentElement.classList.add('content');
        contentElement.innerHTML = `
      <p><strong>${comment.author}</strong></p>
      <p>${comment.content}</p>
    `;

        const replyElement = document.createElement('div');
        replyElement.classList.add('replies');
        replyElement.innerHTML = `
      <textarea placeholder="Your Reply"></textarea>
      <button class="reply-btn" data-id="${comment.id}">Reply</button>
    `;

        commentElement.appendChild(contentElement);
        commentElement.appendChild(replyElement);
        parentElement.appendChild(commentElement);

        if (comment.replies.length > 0) {
            renderComments(comment.replies, replyElement);
        }
    });
};

// Function to add a comment
function addComment(author, content, replies = []) {
    comments.push({
        id: Date.now(),
        author,
        content,
        replies
    });
    updateComments();
};

// Function to update comments
function updateComments() {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';
    renderComments(comments, commentsContainer);
};

// Initialize comments rendering and form submission
document.addEventListener('DOMContentLoaded', () => {
    const addCommentBtn = document.getElementById('add-comment-btn');
    addCommentBtn.addEventListener('click', () => {
        const author = document.getElementById('comment-author').value;
        const content = document.getElementById('comment-content').value;

        if (author && content) {
            addComment(author, content);
            document.getElementById('comment-author').value = '';
            document.getElementById('comment-content').value = '';
        } else {
            alert('Please fill out both fields');
        }
    });

    document.getElementById('comments-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('reply-btn')) {
            const parentId = e.target.dataset.id;
            const replyContent = e.target.previousElementSibling.value;
            const replyAuthor = prompt('Enter your name');

            if (replyContent && replyAuthor) {
                addReply(parentId, replyAuthor, replyContent);
                e.target.previousElementSibling.value = '';
            } else {
                alert('Please fill out the reply');
            }
        }
    });
});

// Function to find a comment by ID and add a reply
function addReply(parentId, author, content) {
    function findCommentById(comments, id) {
        for (let comment of comments) {
            if (comment.id === id) {
                return comment;
            }
            let found = findCommentById(comment.replies, id);
            if (found) return found;
        }
        return null;
    }

    const parentComment = findCommentById(comments, Number(parentId));
    if (parentComment) {
        parentComment.replies.push({
            id: Date.now(),
            author,
            content,
            replies: []
        });
        updateComments();
    }
};
