fetch('../data/articles.json')
  .then(response => response.json())
  .then(articles => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article');
    
    if (articles[articleId]) {
      const article = articles[articleId];
      // Title, etc.
      document.getElementById('article-title').textContent = article.title;
      document.getElementById('article-subtitle').textContent = article.subtitle;
      
      // Build paragraphs
      let contentHtml = "";
      article.content.forEach(paragraph => {
        contentHtml += `<p>${paragraph}</p>`;
      });
      document.getElementById('article-content').innerHTML = contentHtml;
      
      // Author details, etc.
      document.getElementById('author-name').textContent = article.author.name;
      document.getElementById('author-bio').textContent = article.author.bio;
      document.getElementById('author-image').src = article.author.image;

    } else {
      // If article doesn't exist
      document.getElementById('article-title').textContent = "Article Not Found";
      document.getElementById('article-content').textContent = "The article you are looking for does not exist.";
    }
  })
  .catch(error => {
    console.error("Error loading articles:", error);
    document.getElementById('article-title').textContent = "Error Loading Article";
    document.getElementById('article-content').textContent = "There was an error loading the article data.";
  });
