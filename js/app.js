$(document).ready(function () {
  // <script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
  // TODO: Replace hardcoding with possible PHP variable
  // window.$('#data_table').DataTable();

  const fEvents = 'getEvents';
  const fModules = 'getExternalModules';
  const fProjects = 'getProjects';
  const fTemplates = 'getTemplates';  

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
        filterMapping: {},
        filterParams: {
          event: '',
          external_module_id: '',
          project_id: '',
          user: '',
        },
        initiatedRequest: false,
        handlerFunctions: [
          { 'value': fEvents, 'text': 'Events' },
          { 'value': fModules, 'text': 'Modules' },
          { 'value': fProjects, 'text': 'Projects' },
          { 'value': fTemplates, 'text': 'Templates' },
        ],
        headerMappinp: {},
        module: ExternalModules['SP'].ExternalModule,
        responseData: [],
        search: '',
        tab: null,
      }
    },
    created: function() {
      // Initialize headerMapping
      this.headerMapping = {};
      this.headerMapping[fEvents] = [
        { value: 'log_event_id', text: 'Log ID' },
        { 
          value: 'project_id', 
          text: 'Project ID' ,
          filter: value => {
            if (!this.filterParams.project_id) return true;
            var result = value > this.filterParams.project_id; 
            return result;
          },
          filterLabel: '>'
        },
        { 
          value: 'user', 
          text: 'User',
          filter: value => {
            if (!this.filterParams.user) return true;
            var result = contains(value.toLowerCase(), this.filterParams.user.toLowerCase());
            return result;
          },
          filterLabel: '='
        },
        { value: 'page', text: 'Page' },
        { 
          value: 'event', 
          text: 'Event',
          filter: value => {
            if (!this.filterParams.event) return true;
            var result = contains(value.toLowerCase(), this.filterParams.event.toLowerCase());
            return result;
          },
          filterLabel: '='
        },
        { value: 'description', text: 'Description' }
      ];
      this.headerMapping[fModules] = [
        { 
          value: 'external_module_id', 
          text: 'External Module ID',
          filter: value => {
            if (!this.filterParams.external_module_id) return true;
            var result = value === this.filterParams.external_module_id; 
            return result;
          },
          filterLabel: '='
        },
        { value: 'directory_prefix', text: 'Directory Prefix' }
      ];
      this.headerMapping[fProjects] = [
        { 
          value: 'project_id', 
          text: 'Project ID',
          filter: value => {
            if (!this.filterParams.project_id) return true;
            var result = value === this.filterParams.project_id; 
            return result;
          },
          filterLabel: '='
        },
        // { value: 'project_name', text: 'Project Name' },
        { value: 'app_title', text: 'Project Title' },
        { value: 'status', text: 'Status' },
        { value: 'creation_time', text: 'Created On' },
        { value: 'production_time', text: 'Moved to Prod On' },
        { value: 'url', text: 'Project Page' },
      ];
      this.headerMapping[fTemplates] = [
        { 
          value: 'project_id', 
          text: 'Project ID',
          filter: value => {
            if (!this.filterParams.project_id) return true;
            var result = value === this.filterParams.project_id; 
            return result;
          },
          filterLabel: '='
        },
        { value: 'title', text: 'Title' },
        { value: 'description', text: 'Description' },
      ];

      console.log(this.headerMapping);

      // Initialize filterMapping
      this.filterMapping = {};
      this.filterMapping[fEvents] = [
        { value: 'project_id', text: 'Project'},
        { value: 'user', text: 'User'},
        { value: 'event', text: 'Event'},
      ];
    },
    computed: {
      // getTitle: function() {
      //   for (var i = 0; i < this.handlerFunctions.length; i++) {
      //     if (this.handlerFunctions[i].value === this.currentParams.function) return this.handlerFunctions[i].text;
      //   }
      // },
      contains: function(source, target, options) {
        // TODO : add options for case sensitivity
        // var result = sourceStr.toLowerCase().indexOf(targetStr.toLowerCase()) >= 0;
        console.log(source, target);
        var result = source.indexOf(target) >= 0;
        return result; 
      },
      getFilters: function() {
        var temp = this.filterMapping[this.currentParams.function];
        return temp;
      },
      getHeaders: function() {
        var temp = this.headerMapping[this.currentParams.function];
        return temp;
      },
      getTabs: function() {
        var titles = [];
        for (var i = 0; i < this.handlerFunctions.length; i++) {
          titles.push(this.handlerFunctions[i].text);
        }
        return titles;
      },
      isLoading: function() {
        return this.initiatedRequest;
      },
      // missingData: function () {
      //   return this.currentParams.function == "";
      // },
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
      remove: function(item) {
        this.chips.splice(this.chips.indexOf(item), 1)
        this.chips = [...this.chips]
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