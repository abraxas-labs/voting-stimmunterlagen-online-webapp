(function (window) {
  window['config'] = window['config'] || {};
  window['config'].VOTING_API_BASE = '${VOTING_API_BASE}';
  window['config'].API_BASE = '${API_BASE}';
  window['config'].SC_SERVICE_NAME = '${SC_SERVICE_NAME}';
  window['config'].ENV = '${ENV}';
  window['config'].ISSUER = '${ISSUER}';
  window['config'].DMDOC_BASE = '${DMDOC_BASE}';
  window['config'].IS_ELECTORAL_REGISTRATION_ENABLED = '${IS_ELECTORAL_REGISTRATION_ENABLED}';

  let AUDIENCE_CLIENT_IDS = ['${SC_SERVICE_NAME}', '${SC_SERVICE_NAME_IDENTITY}', '${SC_SERVICE_NAME_PERMISSION}'];

  if (window['config'].IS_ELECTORAL_REGISTRATION_ENABLED === 'true') {
    AUDIENCE_CLIENT_IDS.push('${SC_VO_STIMMREGISTER_CLIENT_ID}');
  }

  window['config'].AUDIENCE_CLIENT_IDS = AUDIENCE_CLIENT_IDS;
})(this);
