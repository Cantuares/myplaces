export const getDetails = title =>
  fetch(`https://pt.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&redirects=1&titles=${title}&origin=*`)
