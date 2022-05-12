const JIRA_PROJECTS = [
  'COM',
  'G2TSUPRT',
  'GTP',
  'IN',
  'INT',
  'LABS',
  'PA',
  'PAF',
  'PARR',
  'PII',
  'PISCS',
  'PO',
  'PSI',
  'PUB',
  'TRK',
  'TRKP',
  'TRKFI',
  'TRKINTEG',
  'TSA',
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
