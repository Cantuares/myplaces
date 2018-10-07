export const getDetails = title => {
  return new Promise(resolve => {
    fetch(`https://pt.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&redirects=1&titles=${title}&origin=*`, {
      cors: `cors`
    })
    .then(response => response.json())
    .then(data => {
      let key = Object.keys(data.query.pages).pop()
      let pages = data.query.pages[key]
      resolve(pages)
    })
  })
}
