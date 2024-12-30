// Function to parse basic Markdown
function parseMarkdown(markdownText) {
  return markdownText
      .replace(/^### (.*$)/gim, '<h3>$1</h3>') // Convert ### headings to <h3>
      .replace(/^## (.*$)/gim, '<h2>$1</h2>') // Convert ## headings to <h2>
      .replace(/^# (.*$)/gim, '<h1>$1</h1>') // Convert # headings to <h1>
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>') // Convert **bold** to <strong>
      .replace(/\*(.*?)\*/gim, '<em>$1</em>') // Convert *italic* to <em>
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />') // Convert ![alt](url) to <img>
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>') // Convert [text](url) to <a>
      .replace(/\n$/gim, '<br />'); // Convert line breaks to <br>
}

// Fetch the JSON file and populate content
fetch('../data/articles.json')
  .then(response => response.json())
  .then(articles => {
      const urlParams = new URLSearchParams(window.location.search);
      const articleId = urlParams.get('article');

      if (articles[articleId]) {
          const article = articles[articleId];

          // Populate title and subtitle
          document.getElementById('article-title').textContent = article.title;
          document.getElementById('article-subtitle').textContent = article.subtitle;

          // Update Ken Burns background image
          if (article.image) {
              const header = document.querySelector('.header');
              header.style.setProperty('--ken-burns-image', `url(${article.image})`);
          }

          // Build and parse content using the Markdown parser
          let contentHtml = "";
          article.content.forEach(paragraph => {
              contentHtml += `<p>${parseMarkdown(paragraph)}</p>`;
          });
          document.getElementById('article-content').innerHTML = contentHtml;

          // Populate author details
          document.getElementById('author-name').textContent = article.author.name;
          document.getElementById('author-bio').textContent = article.author.bio;
          document.getElementById('author-image').src = article.author.image;

          // Dynamically move the author section below content on mobile
          if (window.innerWidth <= 768) {
              const heroAuthor = document.querySelector('.hero-author');
              const articleBody = document.querySelector('.article-body');
              articleBody.insertAdjacentElement('afterend', heroAuthor);
          }
      } else {
          // If the article does not exist
          document.getElementById('article-title').textContent = "Article Not Found";
          document.getElementById('article-content').textContent = "The article you are looking for does not exist.";
      }
  })
  .catch(error => {
      console.error("Error loading articles:", error);
      document.getElementById('article-title').textContent = "Error Loading Article";
      document.getElementById('article-content').textContent = "There was an error loading the article data.";
  });

  // confirmation message for the form
  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    fetch(this.action, {
      method: "POST",
      body: new FormData(this),
    })
      .then(() => {
        alert("Thank you! Your message has been sent.");
        this.reset();
      })
      .catch(() => alert("Oops! Something went wrong. Please try again."));
  });
  


  // Reposition "About the Author" section on smaller screens
function repositionAuthorSection() {
  const heroAuthor = document.querySelector('.hero-author');
  const articleBody = document.querySelector('.article-body');

  if (window.innerWidth <= 768) {
      articleBody.insertAdjacentElement('afterend', heroAuthor);
  } else {
      const headerContent = document.querySelector('.header .header-content');
      headerContent.appendChild(heroAuthor); // Return it to the hero section for larger screens
  }
}

// Run on page load
repositionAuthorSection();

// Run on window resize
window.addEventListener('resize', repositionAuthorSection);
