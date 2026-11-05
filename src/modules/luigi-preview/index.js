export default {
  name: 'luigi-preview',
  pages: ['*'],
  init() {
    document.documentElement.classList.toggle('ts-luigi-preview', !!window.TimberLoader?.preview);
  },
};
