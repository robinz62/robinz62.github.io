// Fetches a random problem with the given settings. Results from the codeforces
// API are cached for problem selections (assuming no change in tags).
//
// The following data is cached in sessionStorage:
// tags: a sorted list of tags. This is to detect if a new API call is needed.
// problems: the list of problems.
//
// TODO(robinz62): implement tags
// TODO(robinz62): implement filter by already solved, given handle
// TODO(robinz62): error handling
function getProblem() {
  if (typeof Storage === 'undefined' || !window.sessionStorage.getItem('problems')) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = 'json';
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        const problems = xmlHttp.response.result.problems;
        getProblemFromList(problems);
        window.sessionStorage.setItem('problems', JSON.stringify(problems));
      }
    }
    xmlHttp.open('GET', 'https://codeforces.com/api/problemset.problems?lang=en', /*async=*/true);
    xmlHttp.send(null);
  } else {
    getProblemFromList(JSON.parse(window.sessionStorage.getItem('problems')));
  }
}

// Given a list of candidate problems, selects a random one out of the list
// within the rating range specified on the page. Updates the DOM with results.
function getProblemFromList(problems) {
  let ratingLower = parseInt(document.getElementById('rating-lower').value, 10);
  let ratingUpper = parseInt(document.getElementById('rating-upper').value, 10) || 5000;
  if (isNaN(ratingLower)) ratingLower = 0;
  if (isNaN(ratingUpper)) ratingUpper = 5000;
  const ratingFiltered = problems.filter(problem => {
    return problem.rating >= ratingLower && problem.rating <= ratingUpper;
  });
  const N = ratingFiltered.length;
  const resultLinkDiv = document.getElementById('result-link-div');
  const noResultDiv = document.getElementById('result-nolink-div');
  if (N == 0) {
    resultLinkDiv.style.display = 'none';
    noResultDiv.style.display = 'inline';
  } else {
    const picked = ratingFiltered[Math.floor(Math.random() * N)];
    const resultLink = document.getElementById('result-link');
    resultLink.textContent = `${picked.contestId}${picked.index} - ${picked.name}`;
    resultLink.href = `https://codeforces.com/problemset/problem/${picked.contestId}/${picked.index}`;
    resultLinkDiv.style.display = 'inline';
    noResultDiv.style.display = 'none';
  }
}