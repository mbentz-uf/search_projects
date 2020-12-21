$(document).ready(function () {
  // <script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
  // TODO: Replace hardcoding with possible PHP variable
  const fEvents = 'getEvents';
  const fModules = 'getExternalModules';
  const fProjects = 'getProjects';
  const fTemplates = 'getTemplates';
  const headerMapping = {}
  headerMapping[fEvents] = [];
  headerMapping[fModules] = [
    {key: 'external_module_id', alias: 'External Module ID'},
    {key:'directory_prefix', alias: 'Directory Prefix'}
  ];
  headerMapping[fProjects] = [
    {key: 'project_id', alias: 'Project ID'},
    {key: 'project_name', alias: 'Project Name'}
  ];
  headerMapping[fTemplates] = [];

  const app = {
    data() {
      return {
        currentParams: {
          data: '',
          function: '',
          pid: 14,
        },
        initiatedRequest: false,
        handlerFunctions : [
          {'key': fEvents, 'alias': 'Events'},
          { 'key': fModules, 'alias': 'Modules' },
          { 'key': fProjects, 'alias': 'Projects' },
          { 'key': fTemplates, 'alias': 'Templates' },
        ],
        module: ExternalModules['SP'].ExternalModule,
        response: {
          'body': '',
          'statusCode': '',
        },
      }
    },
    computed: {
      getMapping: function() {
        var temp = headerMapping[this.currentParams.function];
        return temp;
      },
      isLoading: function() {
        return this.initiatedRequest;
      },
      missingData: function() {
        return this.currentParams.function == "";
      },
      // TODO: Update to local variable, this is no longer in the URL the plugin lives outside the project context
      pid: function() {
        return this.urlParam('pid');
      },
      url: function() {
        var url = unescape(this.module.tt('ajaxPage').replaceAll('"', ""));
        console.log(url);
        return url;
      }
    },
    methods: {
      clear: function() {
        this.data = '';
      },
      getData: function () {
        var self = this;
        self.initiatedRequest = true;
        $.get({
          url: self.url,
          data: {...self.currentParams}
        }).done(function (response) {
          response = self.parseJSON(response);
          if (response.error) {
            return 0;
          }
          self.initiatedRequest = false;
          self.response['body'] = response.data;
          self.data = response.data;
          console.log('received data:');
          console.log(typeof self.data, self.data);
        });
      },
      parseJSON(json) {
        try {
          return JSON.parse(json);
        } catch(err) {
          console.log("Error occurred for: " + json);
          console.log("With error: " + err);
          this.initiatedRequest = false;
        }
      },
      updateParams(params) {
        this.currentParams = { ...this.currentParams, ...params }
      },
      urlParam: function(key) {
        const queryString = window.location.search;
        return new URLSearchParams(queryString).get(key);
      }
    }
  }

  Vue.createApp(app).mount('#app');
});