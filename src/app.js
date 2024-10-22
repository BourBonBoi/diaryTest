const postsKey = 'posts';

// Функция для получения постов из localStorage
function getPostsFromStorage() {
    console.log("test function getPostsFromStorage")

    const storedPosts = localStorage.getItem(postsKey);
    console.log("storedPosts" + storedPosts)

    return storedPosts ? JSON.parse(storedPosts) : [];
    
}

// Функция для сохранения постов в localStorage
function savePostsToStorage(posts) {
    console.log("test function savePostsToStorage")
    localStorage.setItem(postsKey, JSON.stringify(posts));
}

// Функция для отображения постов
function displayPosts(posts = null) {
    console.log("test function displayPosts")

    const postsContainer = document.getElementById('posts');
    console.log("postsContainer" + postsContainer)
    postsContainer.innerHTML = ''; // Очищаем посты

    if (!posts) {
        posts = getPostsFromStorage(); // Получаем все посты, если параметр не передан
        console.log("if (!posts)" + posts)

    }

    for (let post of posts) {
        console.log("for (let post of posts)" + post + posts)
        const postDiv = document.createElement('div');
        console.log("postDiv" + postDiv)

        postDiv.className = 'post';

        // Создаем заголовок поста
        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;
        postDiv.appendChild(titleElement);
        
        console.log("postDiv заголовок поста" + postDiv)
        console.log("titleElement.textContent" + post.title)

        // Создаем контент поста
        const contentElement = document.createElement('p');
        contentElement.textContent = post.content;
        postDiv.appendChild(contentElement);

        // Если есть изображение, добавляем его
        if (post.image) {
            const imageElement = document.createElement('img');
            imageElement.src = post.image;
            postDiv.appendChild(imageElement);
        }

        // Добавляем теги
        if (post.tags.length > 0) {
            const tagsElement = document.createElement('p');
            tagsElement.textContent = 'Tags: ' + post.tags.join(', ');

            console.log("tagsElement" + tagsElement)

            postDiv.appendChild(tagsElement);
        }

        postsContainer.appendChild(postDiv);
    }
}

// Обработчик клика на кнопку добавления поста
document.getElementById('submit').onclick = function() {
    console.log("test function getElementById('submit')")

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('image').files[0];
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());


    console.log("title" + title)
    console.log("content" + content)
    console.log("imageFile" + imageFile)
    console.log("tags" + tags)


    // Создаем объект поста
    const reader = new FileReader();
    reader.onload = function(event) {
        const newPost = {
            title,
            content,
            image: event.target.result,
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
        reader.readAsDataURL(imageFile);
    } else {
        reader.onload({ target: { result: null } });
    }
};

// Функция фильтрации постов по тегам
function filterPostsByTag(tag) {
    console.log("test function filterPostsByTag")

    const posts = getPostsFromStorage();
    const filteredPosts = posts.filter(post => post.tags.includes(tag));
    displayPosts(filteredPosts);
}

// Функция для поиска постов по тегу
function searchPostsByTag() {
    console.log("test function searchPostsByTag")

    const tag = document.getElementById('search').value.trim();
    filterPostsByTag(tag); // Фильтруем посты по тегу
}

// Обработчик события для поиска по тегам

document.getElementById('search-btn').addEventListener('click', searchPostsByTag);

// Инициализация отображения постов при загрузке страницы
displayPosts();