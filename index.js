const JIRA_PROJECTS = [
  'COM',
  'INT',
  'LABS',
  'PA',
  'PAF',
  'PARR',
  'PISCS',
  'PO',
  'PSI',
  'PUB',
  'UGC'
];

module.exports = {
  extends: ['./base.js'],
  parserPreset: {
    parserOpts: {
      issuePrefixes: JIRA_PROJECTS.map((name) => `${name}-`)
    }
  }
};
