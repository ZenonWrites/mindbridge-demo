module.exports = {
  content: ['./app/**/*.js', './components/**/*.js'],
  theme: { extend: {
    colors: { ink: '#1E3A4C', teal: { DEFAULT: '#2A9D8F', soft: '#DDF1EE' }, sage: { DEFAULT: '#A9C4A1', soft: '#EEF4EC' }, mist: '#F4F9F7', alert: '#C2410C' },
    fontFamily: { display: ['var(--f-display)', 'serif'], sans: ['var(--f-body)', 'system-ui', 'sans-serif'] },
  } },
};
