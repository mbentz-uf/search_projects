$(document).ready(function () {
  // <script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
  // TODO: Replace hardcoding with possible PHP variable
  // window.$('#data_table').DataTable();

  const fEvents = 'getEvents';
  const fModules = 'getExternalModules';
  const fProjects = 'getProjects';
  const fTemplates = 'getTemplates';

  const headerMapping = {}
  headerMapping[fEvents] = [
    { value: 'log_event_id', text: 'Log ID' },
    { value: 'project_id', text: 'Project ID' },
    { value: 'user', text: 'User' },
    { value: 'page', text: 'Page' },
    { value: 'event', text: 'Event' },
    { value: 'description', text: 'Description' }
  ];
  headerMapping[fModules] = [
    { value: 'external_module_id', text: 'External Module ID' },
    { value: 'directory_prefix', text: 'Directory Prefix' }
  ];
  headerMapping[fProjects] = [
    { value: 'project_id', text: 'Project ID' },
    // { value: 'project_name', text: 'Project Name' },
    { value: 'app_title', text: 'Project Title' },
    { value: 'status', text: 'Status' },
    { value: 'creation_time', text: 'Created On' },
    { value: 'production_time', text: 'Moved to Prod On' },
    { value: 'url', text: 'Project Page' },
  ];
  headerMapping[fTemplates] = [
    { value: 'project_id', text: 'Project ID' },
    { value: 'title', text: 'Title' },
    { value: 'description', text: 'Description' },
  ];

  const app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data () { 
      return {
        currentParams: {
          data: '',
          function: fModules,
          pid: '',
        },
        initiatedRequest: false,
        handlerFunctions: [
          { 'value': fEvents, 'text': 'Events' },
          { 'value': fModules, 'text': 'Modules' },
          { 'value': fProjects, 'text': 'Projects' },
          { 'value': fTemplates, 'text': 'Templates' },
        ],
        module: ExternalModules['SP'].ExternalModule,
        responseData: [],
        search: '',
        tab: null,
      }
    },
    computed: {
      // getTitle: function() {
      //   for (var i = 0; i < this.handlerFunctions.length; i++) {
      //     if (this.handlerFunctions[i].value === this.currentParams.function) return this.handlerFunctions[i].text;
      //   }
      // },
      getHeaders: function () {
        var temp = headerMapping[this.currentParams.function];
        return temp;
      },
      getTabs: function() {
        var titles = [];
        for (var i = 0; i < this.handlerFunctions.length; i++) {
          titles.push(this.handlerFunctions[i].text);
        }
        return titles;
      },
      isLoading: function () {
        return this.initiatedRequest;
      },
      // missingData: function () {
      //   return this.currentParams.function == "";
      // },
      // TODO: Update to local variable, this is no longer in the URL the plugin lives outside the project context
      pid: function () {
        return this.urlParam('pid');
      },
      url: function () {
        var url = unescape(this.module.tt('ajaxPage').replaceAll('"', ""));
        console.log(url);
        return url;
      }
    },
    methods: {
      // clear: function () {
      //   this.data = '';
      // },
      updateFunction: function () {
        this.currentParams.function = this.handlerFunctions[this.tab].value;
        this.responseData = [];
        this.getData();
      },
      getData: function () {
        var self = this;
        self.initiatedRequest = true;
        $.get({
          url: self.url,
          data: { ...self.currentParams }
        }).done(function (response) {
          // console.log(response, response.data);
          response = self.parseJSON(response);
          if (response.error) {
            alert(response.error);
            return;
          }
          self.initiatedRequest = false;
          self.responseData = response.data;
          // console.log(typeof self.responseData, self.responseData);
        });
      },
      // isLink: function(key) {
      //   return key === 'url';
      // },
      parseJSON(json) {
        try {
          return JSON.parse(json);
        } catch (err) {
          console.log("Error occurred for: " + json);
          console.log("With error: " + err);
          this.initiatedRequest = false;
        }
      },
      // updateParams(params) {
      //   this.currentParams = { ...this.currentParams, ...params }
      // },
      urlParam: function (key) {
        const queryString = window.location.search;
        return new URLSearchParams(queryString).get(key);
      }
    }
  });

  // Vue.createApp(app).mount('#app');
});