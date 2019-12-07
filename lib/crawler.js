const fetch = require('node-fetch');
const dom = require('./dom');

const crawl = module.exports = async url => {
  const response = await fetch(url);
  
  return {
    response,
    getDocument: getDocument(response)
  }
}

const getDocument = response => async () => {
  const html = await response.text();
  const document = dom(html)
  return {
    document,
    getLinks: getLinks(document)
  }
}

const getLinks = document => async () => {
  const linksRaw = Array.from(document.querySelectorAll('a[href]'));
  const links = linksRaw.map(link => link.href);
  return {
    links,
    linksRaw,
    crawlAllWhen: crawlAllWhen({ document, linksRaw, links })
  }
}

const crawlAllWhen = ({ document, linksRaw, links }) => when => {
  const filtered = links.filter((link, i) => {
    const rawLink = linksRaw[i];
    return when({ rawLink, i });
  });
  return filtered.map(crawl);
}



