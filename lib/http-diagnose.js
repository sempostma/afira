const { parse } = require('url');
const crawl = require('./crawler');

const sleep = () => new Promise(resolve => {
  setTimeout(resolve, 1000);
})

const _true = true;

module.exports = async ({ url }) => {
  const busy = {};
  const done = {};
  let busyCounter = 0;
  const todo = [url];

  crawlJob();

  async function crawlJob() {
    while (_true) {
      while (todo.length <= 0) {
        if (busyCounter <= 0) return;
        await sleep();
      }
      const url = todo.splice(0, 1)[0];

      if (busy[url]) return;
      if (done[url]) {
        return;
      }
      busy[url] = true;
      busyCounter++;
      try {
        console.log('crawling', url);
        const domain = parse(url).host;
        const { response, getDocument } = await crawl(url);

        if (!response.ok) console.error('Response not OK', response.status, 'for', url, response);
        if (response.redirected) console.warn('Was redirected', url);

        const { document, getLinks } = await getDocument();

        const { links, crawlAllWhen, linksRaw } = await getLinks();

        links.forEach((link, i) => {
          if (!linksRaw[i].getAttribute('href')) {
            console.warn('Link without valid href', url, linksRaw[i].outerHTML)
            return;
          }
          if (parse(url).host !== parse(link).host) return;
          if (todo.includes(link)) return;
          if (busy[link]) return;
          if (done[link]) return;
          todo.push(link);
        })
      } finally {
        // eslint-disable-next-line require-atomic-updates
        done[url] = true;
        // eslint-disable-next-line require-atomic-updates
        delete busy[url];
        busyCounter--;
      }
    }
  }
}

