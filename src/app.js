const postsKey = 'posts';

// Функция для получения постов из localStorage
function getPostsFromStorage() {
    const storedPosts = localStorage.getItem(postsKey);
    return storedPosts ? JSON.parse(storedPosts) : [];
}

// Функция для сохранения постов в localStorage
function savePostsToStorage(posts) {
    localStorage.setItem(postsKey, JSON.stringify(posts));
}

// Функция для отображения постов
function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = ''; // Очищаем посты

    const posts = getPostsFromStorage();
    for (let post of posts) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';

        // Создаем заголовок поста
        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;
        postDiv.appendChild(titleElement);

        // Создаем контент поста
        const contentElement = document.createElement('p');
        contentElement.textContent = post.content;
        postDiv.appendChild(contentElement);

        // Если есть изображение, добавляем его
        if (post.image) {
            const imageElement = document.createElement('img');
            imageElement.src = post.image; // В случае хранения данных в localStorage мы храним URL
            postDiv.appendChild(imageElement);
        }

        // Добавляем теги
        if (post.tags.length > 0) {
            const tagsElement = document.createElement('p');
            tagsElement.textContent = 'Tags: ' + post.tags.join(', ');
            postDiv.appendChild(tagsElement);
        }

        postsContainer.appendChild(postDiv);
    }
}

// Обработчик клика на кнопку добавления поста
document.getElementById('submit').onclick = function() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('image').files[0];
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

    // Создаем объект поста
    const reader = new FileReader();
    reader.onload = function(event) {
        const newPost = {
            title,
            content,
            image: event.target.result, // Сохраняем URL изображения
            tags
        };

        const posts = getPostsFromStorage();
        posts.push(newPost);
        savePostsToStorage(posts);
        displayPosts(); // Обновляем отображение постов

        // Очищаем поля ввода
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        document.getElementById('image').value = '';
        document.getElementById('tags').value = '';
    };
    
    if (imageFile) {
        reader.readAsDataURL(imageFile); // Читаем файл как Data URL
    } else {
        reader.onload({ target: { result: null } }); // Если нет изображения, передаем null
    }
};


// Функция фильтрации постов по тегам
function filterPostsByTag(tag) {
    const posts = getPostsFromStorage();
    const filteredPosts = posts.filter(post => post.tags.includes(tag));
    displayPosts(filteredPosts);
}

// Обработчик события для поиска по тегам
document.getElementById('searchButton').addEventListener('click', () => {
    const tag = document.getElementById('searchInput').value.trim();
    if (tag) {
        filterPostsByTag(tag);
    } else {
        displayPosts(getPostsFromStorage());  // Отобразить все посты, если поле пустое
    }
});

// Инициализация отображения постов при загрузке страницы
displayPosts(getPostsFromStorage());