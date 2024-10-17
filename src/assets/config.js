(function (window) {
  window['config'] = window['config'] || {};
  window['config'].VOTING_API_BASE = '${VOTING_API_BASE}';
  window['config'].API_BASE = '${API_BASE}';
  window['config'].SC_SERVICE_NAME = '${SC_SERVICE_NAME}';
  window['config'].AUDIENCE_CLIENT_IDS = [
    '${SC_SERVICE_NAME}',
    '${SC_VO_STIMMREGISTER_CLIENT_ID}',
    '${SC_SERVICE_NAME_IDENTITY}',
    '${SC_SERVICE_NAME_PERMISSION}',
  ];
  window['config'].ENV = '${ENV}';
  window['config'].ISSUER = '${ISSUER}';
  window['config'].DMDOC_BASE = '${DMDOC_BASE}';
})(this);
