import './style.scss';

const postsContainer = document.getElementById('posts-container');

async function getPosts() {
  const res = await fetch(
    `https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json`
  );

  const data = await res.json();

  return data;
}

async function showPosts() {
  const n_col = 3
  const containerInner = document.createElement('div');
  containerInner.classList.add('p-strip');
  postsContainer.appendChild(containerInner);
  let current_row;

  const posts = await getPosts();

  let post_index = 0;
  posts.forEach(post => {
    if (post_index % n_col == 0) {
      const row = document.createElement('div');
      row.classList.add('row');
      containerInner.append(row);
      current_row = row;
    }
    post_index++;

    const postEl = document.createElement('div');
    postEl.classList.add('col-4');
    postEl.classList.add('p-card');

    const topic = post._embedded["wp:term"][1][0].name;
    const title = post.title.rendered;
    const author = post._embedded.author[0].name;
    const date = new Date(post.date).toLocaleDateString('en-GB', {
                day:   'numeric',
                month: 'long',
                year:  'numeric',
            });
    const category = post._embedded["wp:term"][0][0].name;

    postEl.innerHTML = `
      <header class="p-card__heading">
        <h5 class="p-muted-heading u-no-margin--bottom">${topic}</h5>
      </header>
      <div class="p-card__content">
        <a href="${post.link}">
          <img src="${post.featured_media}" alt class="p-card__image">
        </a>
        <h3 class="p-heading--4">
          <a href="${post.link}">${title}</a>
        </h3>
        <p><em>By <a href="${author.link}" class="blue">${author}</a> on ${date}</em></p>
      </div>
      <p class="p-card__footer">${category}</p>
      `;

    current_row.appendChild(postEl);
  });
}

showPosts();
